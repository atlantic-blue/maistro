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

interface PagesCreateInput {
    title: string
    path: string
    description: string
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const pagesCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
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
    const { title, path, description } = event.body as unknown as PagesCreateInput;
    const createdAt = new Date().toISOString()

    const params = {
        TableName: tableName,
        Item: {
            id,
            projectId,
            title,
            path,
            description,
            createdAt,
        }
    };

    await dynamoDb.put(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            id,
            projectId,
            title,
            path,
            description,
            createdAt,
        })
    };
};

const validationSchema = Joi.object<PagesCreateInput>({
    title: Joi.string().required(),
    path: Joi.string().required(),
    description: Joi.string().required(),
})

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(pagesCreate)

export { handler }
