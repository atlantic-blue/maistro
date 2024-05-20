import Joi from "joi"
import AWS from 'aws-sdk';
import * as uuid from "uuid"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import jsonBodyParser from '../../middlewares/json-body-parser';
import { LambdaMiddlewares } from '../../middlewares';
import { validatorJoi } from '../../middlewares/validator-joi';
import createError from '../../middlewares/error-handler';

interface EmailEntryCreateInput {
    name: string
    email: string
    emailListId: string
    redirectTo?: string
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const emailEntryCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const id = uuid.v4()
    const { name, email, emailListId, redirectTo } = event.body as unknown as EmailEntryCreateInput;

    const item = {
        id,
        emailListId,
        name,
        email,
        createdAt: new Date().toISOString(),
    }

    const params = {
        TableName: tableName,
        Item: item
    };

    await dynamoDb.put(params).promise();

    if (redirectTo) {
        return {
            statusCode: 302,
            headers: {
                'Location': new URL(redirectTo, event.headers.origin).toString()
            }
        };
    }

    return {
        statusCode: 202,
        body: JSON.stringify({})
    };
};

const validationSchema = Joi.object<EmailEntryCreateInput>({
    emailListId: Joi.string().required(),
    name: Joi.string().optional(),
    email: Joi.string().required(),
    redirectTo: Joi.string().optional(),
})

const handler = new LambdaMiddlewares()
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(emailEntryCreate)

export { handler }
