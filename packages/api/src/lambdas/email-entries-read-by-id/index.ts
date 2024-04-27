import AWS from 'aws-sdk';
import jwt from "jsonwebtoken"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';
import authJwt from '../../middlewares/auth-jwt';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const emailListsReadById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const { payload } = (event as any).auth.decodedJwt as jwt.Jwt
    const userId = payload.sub
    if (!userId) {
        throw createError(500, "userId not specified")
    }

    const emailListId = event.pathParameters && event.pathParameters['email-list-id']
    if (!emailListId) {
        throw createError(500, "email-list not specified")
    }

    const emailListsParams: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: tableName,
        KeyConditionExpression: 'emailListId = :emailListId',
        ExpressionAttributeValues: {
            ':emailListId': emailListId
        },
        Limit: 25 // TODO create pagination
    };

    const emailListData = await dynamoDb.query(emailListsParams).promise()

    if (!emailListData || !emailListData.Items) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                totalCount: 0,
                data: []
            })
        };
    }

    const countParams = {
        TableName: tableName,
        KeyConditionExpression: 'emailListId = :emailListId',
        ExpressionAttributeValues: {
            ':emailListId': emailListId
        },
        Select: "COUNT"
    };

    const countData = await dynamoDb.query(countParams).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            totalCount: countData.Count,
            data: emailListData.Items
        })
    };
};


const handler = new LambdaMiddlewares()
    .before(authJwt)
    .handler(emailListsReadById)

export { handler }
