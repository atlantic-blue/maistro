import AWS from 'aws-sdk';
import jwt from "jsonwebtoken"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';
import authJwt from '../../middlewares/auth-jwt';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const emailListsEntriesRead: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const { payload } = (event as any).auth.decodedJwt as jwt.Jwt
    const userId = payload.sub
    if (!userId) {
        throw createError(500, "userId not specified")
    }

    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: tableName,
        KeyConditionExpression: "#userId = :userIdValue",
        ExpressionAttributeNames: {
            "#userId": "userId"
        },
        ExpressionAttributeValues: {
            ":userIdValue": userId
        }
    };

    const data = await dynamoDb.query(params).promise();
    if (!data || !data.Items || data.Items?.length === 0) {
        return {
            statusCode: 404,
            body: JSON.stringify([])
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(data.Items)
    };
};


const handler = new LambdaMiddlewares()
    .before(authJwt)
    .handler(emailListsEntriesRead)

export { handler }
