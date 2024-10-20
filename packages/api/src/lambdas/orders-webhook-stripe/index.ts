import AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import jsonBodyParser from '../../middlewares/json-body-parser';
import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';
import Stripe from "stripe";
import { OrderStatus } from '../orders-create/types';
import sendEmail from '../email-create/sendEmail';
import newOrderEmail from './newOrderEmail';

const paymentsSecretKey = process.env.PAYMENTS_SECRET_KEY
const paymentsWebhookKey = process.env.PAYMENTS_WEBHOOK_SECRET_KEY || ""

const stripe = new Stripe(paymentsSecretKey as string, {
    apiVersion: "2024-04-10",
})
const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * Listens to a webhook to create orders
 * https://docs.stripe.com/connect/direct-charges?platform=web&ui=embedded-form#handle-post-payment-events
 */
const ordersCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableNameOrders = process.env.TABLE_NAME_ORDERS
    if (!tableNameOrders) {
        throw createError(500, "process TABLE_NAME_ORDERS not specified")
    }

    const tableNameProjects = process.env.TABLE_NAME_PROJECTS
    if (!tableNameProjects) {
        throw createError(500, "process TABLE_NAME_PROJECTS not specified")
    }

    try {
        const signature = event.headers['Stripe-Signature'] || "";
        const stripeEvent = stripe.webhooks.constructEvent(event.rawBody, signature, paymentsWebhookKey);

        if (stripeEvent.type !== "checkout.session.completed") {
            throw createError(500, `${stripeEvent.type} not supported`)
        }

        const checkoutObject = stripeEvent?.data?.object
        const projectId = checkoutObject?.metadata?.project_id
        const orderId = checkoutObject?.metadata?.order_id
        const paymentIntent = checkoutObject?.payment_intent
        const returnUrl = checkoutObject?.return_url

        const updatedAt = new Date().toISOString()
        const status = OrderStatus.CHECKOUT_COMPLETED
        const history = {
            status,
            timestamp: updatedAt
        }

        const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
            TableName: tableNameOrders,
            Key: {
                id: orderId,
                projectId,
            },
            UpdateExpression: 'set #status = :status, #updatedAt = :updatedAt, #history = list_append(#history, :history)',
            ExpressionAttributeValues: {
                ':status': status,
                ':updatedAt': updatedAt,
                ':history': [history]
            },
            ExpressionAttributeNames: {
                '#status': 'status',
                '#updatedAt': 'updatedAt',
                '#history': 'history',
            },
            ReturnValues: 'ALL_NEW',
        };

        await dynamoDb.update(params).promise()

        // Send Email
        const queryParams: AWS.DynamoDB.DocumentClient.QueryInput = {
            TableName: tableNameProjects,
            IndexName: 'idIndex',
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': projectId,
            },
            Limit: 25,
        };
        const data = await dynamoDb.query(queryParams).promise()
        const project = (data.Items || []).find(item => item.id === projectId)
        const projectEmail = project?.email || "hello@atlanticblue.solutions"

        await sendEmail({
            to: [projectEmail, "atlanticbluesolutionslimited@gmail.com"],
            from: "info@team.maistro.website",
            subject: "You have a new order",
            body: newOrderEmail({
                orderId,
                projectId,
                paymentIntent,
                returnUrl,
            })
        })

        return {
            statusCode: 200,
            body: JSON.stringify({
                id: orderId,
                projectId,
                history,
                updatedAt,
                status,
            })
        };
    } catch (e) {
        console.log(e)
    }
};

const handler = new LambdaMiddlewares()
    .before(jsonBodyParser)
    .handler(ordersCreate)

export { handler }


