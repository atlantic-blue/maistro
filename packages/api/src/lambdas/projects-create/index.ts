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

interface ProjectsCreateInput {
    name: string
    url: string
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const projectsCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
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
    const { name, url } = event.body as unknown as ProjectsCreateInput;

    const params = {
        TableName: tableName,
        Item: {
            id,
            userId,
            name,
            url,
        }
    };

    await dynamoDb.put(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({ id, name, url })
    };
};

const validationSchema = Joi.object<ProjectsCreateInput>({
    name: Joi.string().required(),
    url: Joi.string().required(),
})

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(projectsCreate)

export { handler }
