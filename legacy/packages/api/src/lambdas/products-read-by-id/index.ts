import AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const productsReadById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const projectId = event.pathParameters && event.pathParameters['project-id']
    if (!projectId) {
        throw createError(500, "projectId not specified")
    }

    const productId = event.pathParameters && event.pathParameters['product-id']
    if (!productId) {
        throw createError(500, "productId not specified")
    }

    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
        TableName: tableName,
        Key: {
            id: productId,
            projectId,
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
    .handler(productsReadById)

export { handler }
