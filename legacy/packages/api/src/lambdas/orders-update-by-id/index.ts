import Joi from "joi"
import AWS from 'aws-sdk';
import jwt from "jsonwebtoken"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from '../../middlewares/error-handler';
import authJwt from '../../middlewares/auth-jwt';
import jsonBodyParser from "../../middlewares/json-body-parser";
import { validatorJoi } from "../../middlewares/validator-joi";
import { OrderStatus } from "../orders-create/types";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const productsUpdateById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
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

    const orderId = event.pathParameters && event.pathParameters['order-id']
    if (!orderId) {
        throw createError(500, "orderId not specified")
    }

    const {
        status
    } = event.body as unknown as OrdersUpdateByIdInput;

    const updatedAt = new Date().toISOString()
    const history = {
        status,
        timestamp: updatedAt
    }

    const params = {
        TableName: tableName,
        Key: {
            id: orderId,
            projectId,
        },
        UpdateExpression: 'set status = :status, updatedAt = :updatedAt, history = list_append(history, :newHistory)',
        ExpressionAttributeValues: {
            ':status': status,
            ':updatedAt': updatedAt,
            ':newHistory': [history]
        },
        ReturnValues: 'ALL_NEW',
    };

    await dynamoDb.update(params).promise()

    return {
        statusCode: 200,
        body: JSON.stringify({
            id: orderId,
            projectId,
            history,
            updatedAt,
            status,
        })
    };
};

interface OrdersUpdateByIdInput {
    status: OrderStatus
}

const validationSchema = Joi.object<OrdersUpdateByIdInput>({
    status: Joi.string().optional(),
})

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(productsUpdateById)

export { handler }
