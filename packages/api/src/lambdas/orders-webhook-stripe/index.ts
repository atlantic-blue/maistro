import AWS from 'aws-sdk';
import * as uuid from "uuid"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import jsonBodyParser from '../../middlewares/json-body-parser';
import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';
import Stripe from "stripe";
import { OrderStatus } from '../orders-create/types';
import sendEmail from '../email-create/sendEmail';

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
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
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
            TableName: tableName,
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

        await sendEmail({
            to: ["sweetsin.au@gmail.com", "atlanticbluesolutionslimited@gmail.com"],
            // to: ["sweetsin.au@gmail.com", "atlanticbluesolutionslimited@gmail.com"],
            // to: ["atlanticbluesolutionslimited@gmail.com"],
            from: "info@team.maistro.website",
            subject: "You have a new order",
            body: `
                You have a new order! 
                \n
                \n

                Maistro Order:
                \n
                https://maistro.website/en/projects/${projectId}/orders/${orderId}
                \n
                \n

                Stripe: 
                \n
                https://dashboard.stripe.com/payments/${paymentIntent}
                \n
                \n

                Order Receipt:
                ${returnUrl}
                \n
                \n

            `
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


