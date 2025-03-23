import AWS from 'aws-sdk';
import jwt from "jsonwebtoken"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const projectsReadById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const shoppingCartId = event.pathParameters && event.pathParameters['shopping-cart-id']
    if (!shoppingCartId) {
        throw createError(500, "shoppingCartId not specified")
    }

    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: tableName,
        IndexName: 'IdIndex',
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
            ':id': shoppingCartId,
        },
        Limit: 25,
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
    .handler(projectsReadById)

export { handler }
