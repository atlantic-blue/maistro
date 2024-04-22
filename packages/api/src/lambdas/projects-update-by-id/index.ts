import Joi from "joi"
import AWS from 'aws-sdk';
import jwt from "jsonwebtoken"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';
import authJwt from '../../middlewares/auth-jwt';
import jsonBodyParser from "../../middlewares/json-body-parser";
import { validatorJoi } from "../../middlewares/validator-joi";
import createUpdateParams from "./createUpdateParams";

interface ProjectsUpdateInput {
    name: string
    url: string
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const projectsReadById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
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

    const { name, url } = event.body as unknown as ProjectsUpdateInput;

    const input = {
        name,
        url,
    }

    const params = createUpdateParams(
        input,
        {
            userId,
            id: projectId
        },
        tableName
    )

    await dynamoDb.update(params).promise()

    return {
        statusCode: 200,
        body: JSON.stringify({ message: `Project ${projectId} updated successfully` })
    };
};


const validationSchema = Joi.object<ProjectsUpdateInput>({
    name: Joi.string().optional(),
    url: Joi.string().optional(),
})

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(projectsReadById)

export { handler }
