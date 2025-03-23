import Stripe from "stripe"
import AWS from 'aws-sdk';
import jwt from "jsonwebtoken"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from "../../middlewares/error-handler";
import authJwt from "../../middlewares/auth-jwt";

const paymentsSecretKey = process.env.PAYMENTS_SECRET_KEY
const stripe = new Stripe(paymentsSecretKey as string, {
    apiVersion: "2024-04-10",
})
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const paymentsAccountsReadById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const { payload } = (event as any).auth.decodedJwt as jwt.Jwt
    const userId = payload.sub
    if (!userId) {
        throw createError(500, "userId not specified")
    }

    const connectedAccountId = event.pathParameters && event.pathParameters['account-id']
    if (!connectedAccountId) {
        throw createError(500, "connectedAccountId not specified")
    }

    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
        TableName: tableName,
        Key: {
            userId,
            id: connectedAccountId
        }
    };

    const promises = (): [
        Promise<AWS.DynamoDB.DocumentClient.GetItemOutput>,
        Promise<Stripe.Response<Stripe.Account>>
    ] => [
            dynamoDb.get(params).promise(),
            stripe.accounts.retrieve(connectedAccountId),
        ]

    const [
        data,
        stripeAccount
    ] = await Promise.all(promises())

    if (!data || !data.Item || !stripeAccount) {
        return {
            statusCode: 404,
            body: JSON.stringify({})
        };
    }

    const connectedAccount = data.Item

    return {
        statusCode: 200,
        body: JSON.stringify({
            id: connectedAccount?.id,
            email: connectedAccount?.email,
            userId: connectedAccount?.userId,
            createdAt: connectedAccount?.createdAt,
            detailsSubmitted: stripeAccount.details_submitted || false,
        })
    };
};

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .handler(paymentsAccountsReadById)

export { handler }
