import Joi from "joi"
import AWS from 'aws-sdk';
import jwt from "jsonwebtoken"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';
import authJwt from '../../middlewares/auth-jwt';
import jsonBodyParser from "../../middlewares/json-body-parser";
import { validatorJoi } from "../../middlewares/validator-joi";

interface ProjectsUpdateInput {
    userId: string
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const projectsUpdateById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const userPoolSystemGroup = process.env.USERS_POOL_SYSTEM_GROUP;
    if (!userPoolSystemGroup) {
        throw createError(500, "process USERS_POOL_SYSTEM_GROUP not specified")
    }

    const { payload } = (event as any).auth.decodedJwt as jwt.Jwt
    const groups = payload["cognito:groups"] as string[]
    const isAdmin = groups.includes(userPoolSystemGroup)
    if (!isAdmin) {
        throw createError(500, `${payload.sub} | user is not Admin`)
    }

    const projectId = event.pathParameters && event.pathParameters['project-id']
    if (!projectId) {
        throw createError(500, "projectId not specified")
    }

    const { userId } = event.body as unknown as ProjectsUpdateInput;

    // 1. Find
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

    // 2. Create a copy
    const input = {
        ...project,
        userId,
        updatedAt: new Date().toISOString(),
    }

    const putParams = {
        TableName: tableName,
        Item: input,
    };

    await dynamoDb.put(putParams).promise();

    // 3. Delete original
    const deleteParams: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
        TableName: tableName,
        Key: {
            userId: project.userId,
            id: projectId,
        }
    };

    await dynamoDb.delete(deleteParams).promise()

    return {
        statusCode: 200,
        body: JSON.stringify({
            ...input,
        })
    };
};

const validationSchema = Joi.object<ProjectsUpdateInput>({
    userId: Joi.string().required(),
})

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(projectsUpdateById)

export { handler }
