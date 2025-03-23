import Joi from "joi"
import AWS from 'aws-sdk';
import jwt from "jsonwebtoken"
import * as uuid from "uuid"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import jsonBodyParser from '../../middlewares/json-body-parser';
import { LambdaMiddlewares } from '../../middlewares';
import { validatorJoi } from '../../middlewares/validator-joi';
import createError from '../../middlewares/error-handler';
import authJwt from "../../middlewares/auth-jwt";

interface EmailListsCreateInput {
    projectId: string
    title: string
    description: string
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const emailListsCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const { payload } = (event as any).auth.decodedJwt as jwt.Jwt
    const userId = payload.sub
    if (!userId) {
        throw createError(500, "userId not specified")
    }

    const id = uuid.v4()
    const { projectId, title, description } = event.body as unknown as EmailListsCreateInput;

    const item = {
        id,
        userId,
        projectId,
        title,
        description,
        createdAt: new Date().toISOString(),
        status: "ACTIVE",
    }

    const params = {
        TableName: tableName,
        Item: item
    };

    await dynamoDb.put(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify(item)
    };
};

const validationSchema = Joi.object<EmailListsCreateInput>({
    projectId: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
})

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(emailListsCreate)

export { handler }
