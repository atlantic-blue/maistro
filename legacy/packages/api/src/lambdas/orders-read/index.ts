import AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';
import authJwt from '../../middlewares/auth-jwt';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const productsRead: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const projectId = event.pathParameters && event.pathParameters['project-id']
    if (!projectId) {
        throw createError(500, "projectId not specified")
    }

    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: tableName,
        IndexName: 'ProjectIdIndex',
        KeyConditionExpression: "projectId = :projectId",
        ExpressionAttributeValues: {
            ':projectId': projectId
        },
        Limit: 100,
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
    .handler(productsRead)

export { handler }
