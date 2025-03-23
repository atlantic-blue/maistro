import AWS from 'aws-sdk';
import jwt from "jsonwebtoken"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';
import authJwt from '../../middlewares/auth-jwt';
import jsonBodyParser from "../../middlewares/json-body-parser";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const ordersDeleteById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
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

    const orderId = event.pathParameters && event.pathParameters['order-id']
    if (!orderId) {
        throw createError(500, "productId not specified")
    }

    const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
        TableName: tableName,
        Key: {
            id: orderId,
            projectId,
        }
    };

    const data = await dynamoDb.delete(params).promise()

    const httpResponse = data.$response.httpResponse
    if (httpResponse.statusCode >= 400) {
        return {
            statusCode: httpResponse.statusCode,
            body: JSON.stringify({ message: httpResponse.statusMessage })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "deleted successfully" })
    };
};

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .before(jsonBodyParser)
    .handler(ordersDeleteById)

export { handler }
