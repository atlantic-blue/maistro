import AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const aiTemplatesReadById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const templateId = event.pathParameters && event.pathParameters['template-id']
    if (!templateId) {
        throw createError(500, "template id not specified")
    }

    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
        TableName: tableName,
        Key: {
            id: templateId,
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
        body: JSON.stringify({
            id: data?.Item?.id,
            createdAt: data?.Item?.createAt,
            prompt: data?.Item?.prompt,
            data: data?.Item?.data,
        })
    };
};


const handler = new LambdaMiddlewares()
    .handler(aiTemplatesReadById)

export { handler }
