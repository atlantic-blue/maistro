import AWS from 'aws-sdk';
import jwt from "jsonwebtoken"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';
import authJwt from '../../middlewares/auth-jwt';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const pagesReadById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const { payload } = (event as any).auth.decodedJwt as jwt.Jwt
    const userId = payload.sub
    if (!userId) {
        throw createError(500, "userId not specified")
    }

    const projectId = event.pathParameters && event.pathParameters['project-id']
    if (!projectId) {
        throw createError(500, "projectId not specified")
    }

    const pageId = event.pathParameters && event.pathParameters['page-id']
    if (!pageId) {
        throw createError(500, "pageId not specified")
    }

    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
        TableName: tableName,
        Key: {
            id: pageId,
            projectId,
        }
    };

    const data = await dynamoDb.get(params).promise();

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
    .handler(pagesReadById)

export { handler }
