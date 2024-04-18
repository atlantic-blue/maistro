import Joi from "joi"
import AWS from 'aws-sdk';
import * as uuid from "uuid"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import jsonBodyParser from '../../middlewares/json-body-parser';
import { LambdaMiddlewares } from '../../middlewares';
import { validatorJoi } from '../../middlewares/validator-joi';
import createError from '../../middlewares/error-handler';

interface ProjectsCreateInput {
    name: string
    userId: string
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const projectsCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const { userId, name } = event.body as unknown as ProjectsCreateInput;

    const params = {
        TableName: tableName,
        Item: {
            id: uuid.v4(),
            userId,
            name,
        }
    };

    await dynamoDb.put(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Project created successfully" })
    };
};

const validationSchema = Joi.object<ProjectsCreateInput>({
    userId: Joi.string().required(),
    name: Joi.string().required(),
})

const handler = new LambdaMiddlewares()
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(projectsCreate)

export { handler }
