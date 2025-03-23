import Joi from "joi"
import AWS from 'aws-sdk';
import jwt from "jsonwebtoken"
import * as uuid from "uuid"
import {
    APIGatewayProxyEvent,
    APIGatewayProxyHandler
} from 'aws-lambda';

import jsonBodyParser from '../../middlewares/json-body-parser';
import { LambdaMiddlewares } from '../../middlewares';
import { validatorJoi } from '../../middlewares/validator-joi';
import createError from '../../middlewares/error-handler';
import authJwt from "../../middlewares/auth-jwt";

interface AiThreadsCreateInput {
    name: string
    messages: {
        timestamp: string
        content: {
            text: string
        }[]
        role: string
    }[]
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const aiThreadsCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
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

    const threadId = uuid.v4()
    const { name, messages } = event.body as unknown as AiThreadsCreateInput;
    const now = new Date().toISOString()

    const params = {
        TableName: tableName,
        Item: {
            id: threadId,
            userId,
            projectId,
            createdAt: now,
            updatedAt: now,
            name,
            messages,
        }
    };

    await dynamoDb.put(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            id: threadId,
            projectId,
            createdAt: now,

            name,
            messages,
        })
    };
};

const validationSchema = Joi.object<AiThreadsCreateInput>({
    name: Joi.string().required(),
    messages: Joi.array().items(
        Joi.object({
            content: Joi.array().items(
                Joi.object({
                    text: Joi.string().required()
                }).required()
            ).required(),
            role: Joi.string().required(),
            timestamp: Joi.date().required()
        }).required()
    ).required(),
})

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(aiThreadsCreate)

export { handler }
