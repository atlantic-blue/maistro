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

interface ProjectsUpdateInput {
    name: string
    url: string
    theme: {
        accentColor: string,
        appearance: string,
        grayColor: string,
        radius: string,
        scaling: string,
    }
    currency: string
    logo: string
    email: string
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const projectsUpdateById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
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

    const queryParams: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: tableName,
        IndexName: 'idIndex',
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
            ':id': projectId,
        },
        Limit: 25,
    };

    const data = await dynamoDb.query(queryParams).promise()
    if (!data || !data.Items || data.Items?.length === 0) {
        return {
            statusCode: 404,
            body: JSON.stringify({})
        };
    }

    const project = data.Items.find(item => item.id === projectId)
    if (!project) {
        return {
            statusCode: 404,
            body: JSON.stringify({})
        };
    }

    const { name, url, theme, currency, logo, email } = event.body as unknown as ProjectsUpdateInput;

    const input = sanitiseInput({
        name,
        url,
        theme,
        currency,
        logo,
        email,
        updatedAt: new Date().toISOString(),
    })

    const updateParams = createUpdateParams(
        input,
        {
            userId: project.userId,
            id: projectId
        },
        tableName
    )

    await dynamoDb.update(updateParams).promise()

    return {
        statusCode: 200,
        body: JSON.stringify({
            ...project,
            ...input,
        })
    };
};


const validationSchema = Joi.object<ProjectsUpdateInput>({
    name: Joi.string().optional(),
    url: Joi.string().optional(),
    theme: Joi.object().optional(),
    currency: Joi.string().optional(),
    logo: Joi.string().optional(),
    email: Joi.string().optional(),
})

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(projectsUpdateById)

export { handler }
