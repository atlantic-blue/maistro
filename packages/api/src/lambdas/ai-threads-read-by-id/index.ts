import AWS from 'aws-sdk';
import jwt from "jsonwebtoken"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';
import authJwt from '../../middlewares/auth-jwt';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const aiThreadsReadById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const { payload } = (event as any).auth.decodedJwt as jwt.Jwt
    const userId = payload.sub
    if (!userId) {
        throw createError(500, "userId not specified")
    }

    const threadId = event.pathParameters && event.pathParameters['thread-id']
    if (!threadId) {
        throw createError(500, "email-list not specified")
    }

    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
        TableName: tableName,
        Key: {
            userId,
            id: threadId,
        }
    };

    const data = await dynamoDb.get(params).promise()

    if (!data || !data.Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({})
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(data.Item)
    };
};


const handler = new LambdaMiddlewares()
    .before(authJwt)
    .handler(aiThreadsReadById)

export { handler }
