import AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import jsonBodyParser from '../../middlewares/json-body-parser';
import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';
import Stripe from "stripe";
import sendEmail from '../email-create/sendEmail';
import newOrderEmail from './newOrderEmail';
import { extractDataFromEvent, extractFulfillmentDetails } from './extractDataFromEvent';
import { OrderStatus } from '../../types/Order';

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

        const orderResponse = await dynamoDb.update(params).promise()

        // Extract data
        const {date, interval} = extractFulfillmentDetails(orderResponse.Attributes)
        const order = extractDataFromEvent(stripeEvent, {date, interval})

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
            body: newOrderEmail(order)
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
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: e,
            })
        };
    }
};

const handler = new LambdaMiddlewares()
    .before(jsonBodyParser)
    .handler(ordersCreate)

export { handler }


