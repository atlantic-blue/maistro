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

const paymentsAccountsCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    if (!paymentsSecretKey) {
        throw createError(500, "process PAYMENTS_SECRET_KEY not specified")
    }

    const { payload } = (event as any).auth.decodedJwt as jwt.Jwt
    const userId = payload.sub
    if (!userId) {
        throw createError(500, "userId not specified")
    }

    // @ts-expect-error email is added by cognito and it is not a default payload
    const email: string = payload.email
    if (!email) {
        throw createError(500, "email not specified")
    }

    const account = await stripe.accounts.create({
        email,
    });

    const params = {
        TableName: tableName,
        Item: {
            id: account.id,
            userId,
            email,
            createdAt: account.created,
        }
    };

    await dynamoDb.put(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            account
        })
    };
};

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .handler(paymentsAccountsCreate)

export { handler }
