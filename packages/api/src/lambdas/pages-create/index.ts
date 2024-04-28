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
import sanitiseInput from "../../utils/sanitiseInput";

interface PagesCreateInput {
    title: string
    path: string
    description: string

    colourScheme?: string
    contentIds?: string[]
    fontScheme?: string
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
    const createdAt = new Date().toISOString()

    const input = {
        ...sanitiseInput(event.body as unknown as PagesCreateInput),
        id,
        projectId,
        createdAt,
    }

    const params = {
        TableName: tableName,
        Item: input
    };

    await dynamoDb.put(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify(input)
    };
};

const validationSchema = Joi.object<PagesCreateInput>({
    title: Joi.string().required(),
    path: Joi.string().required(),
    description: Joi.string().required(),
    colourScheme: Joi.string().optional(),
    contentIds: Joi.array().optional(),
    fontScheme: Joi.string().optional(),
})

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(pagesCreate)

export { handler }
