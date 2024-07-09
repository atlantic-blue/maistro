import AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import jsonBodyParser from '../../middlewares/json-body-parser';
import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';
import Stripe from "stripe";

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

    const signature = event.headers['stripe-signature'];
    const stripeEvent = stripe.webhooks.constructEvent(event.body, signature, paymentsWebhookKey);

    console.log(JSON.stringify(stripeEvent, void 0, 4))

    // const {

    // } = event.body as unknown as OrdersCreateInput;

    // const id = uuid.v4()
    // const createdAt = new Date().toISOString()
    // const status = OrderStatus.PENDING

    // const params = {
    //     TableName: tableName,
    //     Item: {
    //         id,
    //         createdAt,

    //         customerId,
    //         status,
    //         history: [
    //             {
    //                 status,
    //                 timestamp: createdAt,
    //             }
    //         ],
    //     }
    // };

    // await dynamoDb.put(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({

        })
    };
};


export enum OrderStatus {
    PENDING = "PENDING",
    ACKNOWLEDGED = "ACKNOWLEDGED",
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    COMPLETED = "COMPLETED",
}


const handler = new LambdaMiddlewares()
    .before(jsonBodyParser)
    .handler(ordersCreate)

export { handler }
