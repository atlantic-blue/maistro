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

interface ContentCreateInput {
    template: string
    data: Object
    categories: string
    description: string
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const contentCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
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

    const id = uuid.v4()
    const { template, categories, description, data } = event.body as unknown as ContentCreateInput;
    const createdAt = new Date().toISOString()

    const params = {
        TableName: tableName,
        Item: {
            id,
            projectId,
            createdAt,

            template,
            data,
            categories,
            description,
        }
    };

    await dynamoDb.put(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            id,
            projectId,
            createdAt,

            template,
            data,
            categories,
            description,
        })
    };
};

const validationSchema = Joi.object<ContentCreateInput>({
    template: Joi.string().required(),
    data: Joi.object().required(),
    categories: Joi.array().optional(),
    description: Joi.string().optional(),
})

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(contentCreate)

export { handler }
