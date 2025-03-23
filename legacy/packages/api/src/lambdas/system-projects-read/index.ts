import AWS from 'aws-sdk';
import jwt from "jsonwebtoken"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';
import authJwt from '../../middlewares/auth-jwt';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const projectsRead: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const userPoolSystemGroup = process.env.USERS_POOL_SYSTEM_GROUP;
    if (!userPoolSystemGroup) {
        throw createError(500, "process USERS_POOL_SYSTEM_GROUP not specified")
    }

    const { payload } = (event as any).auth.decodedJwt as jwt.Jwt
    const groups = payload["cognito:groups"] as string[]
    const isAdmin = groups.includes(userPoolSystemGroup)
    if (!isAdmin) {
        throw createError(500, `${payload.sub} | user is not Admin`)
    }

    const userId = event.queryStringParameters && event.queryStringParameters['user-id']
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
    .handler(projectsRead)

export { handler }
