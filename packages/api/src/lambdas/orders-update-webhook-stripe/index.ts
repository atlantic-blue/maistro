import AWS from 'aws-sdk';
import * as uuid from "uuid"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import jsonBodyParser from '../../middlewares/json-body-parser';
import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';
import Stripe from "stripe";
import { OrderStatus } from '../orders-create/types';

const paymentsSecretKey = process.env.PAYMENTS_SECRET_KEY
const paymentsWebhookKey = process.env.PAYMENTS_WEBHOOK_SECRET_KEY

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
        const signature = event.headers['stripe-signature'];
        const stripeEvent = stripe.webhooks.constructEvent(event.body, signature, paymentsWebhookKey);

        if (stripeEvent.type !== "checkout.session.completed") {
            throw createError(500, `${stripeEvent.type} not supported`)
        }

        stripeEvent.data.object.amount_total
        const checkoutObject = stripeEvent.data.object

        const id = uuid.v4()
        const createdAt = new Date().toISOString()
        const status = OrderStatus.PAYMENT_ACCEPTED

        const params = {
            TableName: tableName,
            Item: {
                id,
                createdAt,

                projectId: checkoutObject?.metadata?.projectId,
                shoppingCartId: checkoutObject?.metadata?.shoppingCartId,

                status,
                history: [
                    {
                        status,
                        timestamp: createdAt,
                    }
                ],
                stripeEvent,
            }
        };

        await dynamoDb.put(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({

            })
        };
    } catch {
        throw createError(500, "Failed to unmarshall event with stripe-signature")
    }
};

const handler = new LambdaMiddlewares()
    .before(jsonBodyParser)
    .handler(ordersCreate)

export { handler }
