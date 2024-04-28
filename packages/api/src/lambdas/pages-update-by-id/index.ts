import Joi from "joi"
import AWS from 'aws-sdk';
import jwt from "jsonwebtoken"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';
import authJwt from '../../middlewares/auth-jwt';
import jsonBodyParser from "../../middlewares/json-body-parser";
import { validatorJoi } from "../../middlewares/validator-joi";
import createUpdateParams from "../../utils/createUpdateParams";
import sanitiseInput from "../../utils/sanitiseInput";

interface PagesUpdateInput {
    title?: string
    path?: string
    colourScheme?: string
    contentIds?: string[]
    description?: string
    fontScheme?: string
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const pagesUpdateById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
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

    const pageId = event.pathParameters && event.pathParameters['page-id']
    if (!pageId || pageId === 'undefined') {
        throw createError(500, "pageId not specified")
    }

    const input = {
        ...sanitiseInput(event.body as unknown as PagesUpdateInput),
        updatedAt: new Date().toISOString(),
    }

    const params = createUpdateParams(
        input,
        {
            projectId,
            id: pageId
        },
        tableName
    )

    await dynamoDb.update(params).promise()

    return {
        statusCode: 200,
        body: JSON.stringify({ message: `Project ${projectId} updated successfully` })
    };
};


const validationSchema = Joi.object<PagesUpdateInput>({
    title: Joi.string().optional(),
    path: Joi.string().optional(),
    description: Joi.string().optional(),
    colourScheme: Joi.string().optional(),
    contentIds: Joi.array().optional(),
    fontScheme: Joi.string().optional(),
})

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(pagesUpdateById)

export { handler }
