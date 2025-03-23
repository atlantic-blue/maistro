import Joi from "joi"
import AWS from 'aws-sdk';
import jwt from "jsonwebtoken"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';
import authJwt from '../../middlewares/auth-jwt';
import jsonBodyParser from "../../middlewares/json-body-parser";
import { validatorJoi } from "../../middlewares/validator-joi";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

interface EmailListsDeleteInput {
    id: string
}

const emailListsDelete: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const { payload } = (event as any).auth.decodedJwt as jwt.Jwt
    const userId = payload.sub
    if (!userId) {
        throw createError(500, "userId not specified")
    }

    const { id } = event.body as unknown as EmailListsDeleteInput;

    const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
        TableName: tableName,
        Key: {
            userId,
            id,
        }
    };

    const data = await dynamoDb.delete(params).promise()

    const httpResponse = data.$response.httpResponse
    if (httpResponse.statusCode >= 400) {
        return {
            statusCode: httpResponse.statusCode,
            body: JSON.stringify({ message: httpResponse.statusMessage })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Email-list deleted successfully" })
    };
};


const validationSchema = Joi.object<EmailListsDeleteInput>({
    id: Joi.string().required(),
})

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(emailListsDelete)

export { handler }
