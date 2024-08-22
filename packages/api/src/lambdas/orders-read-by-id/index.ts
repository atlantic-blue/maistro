import AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const ordersReadById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const orderId = event.pathParameters && event.pathParameters['order-id']
    if (!orderId) {
        throw createError(500, "orderId not specified")
    }

    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: tableName,
        IndexName: 'idIndex',
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
            ':id': orderId,
        },
        Limit: 25,
    };

    const data = await dynamoDb.query(params).promise()

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
    .handler(ordersReadById)

export { handler }
