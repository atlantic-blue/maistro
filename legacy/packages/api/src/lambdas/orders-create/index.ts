import Joi from "joi"
import AWS from 'aws-sdk';
import * as uuid from "uuid"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import jsonBodyParser from '../../middlewares/json-body-parser';
import { LambdaMiddlewares } from '../../middlewares';
import { validatorJoi } from '../../middlewares/validator-joi';
import createError from '../../middlewares/error-handler';
import { OrderStatus } from "./types";

interface OrdersCreateInput {
    projectId: string
    shoppingCartId: string
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const ordersCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const id = uuid.v4()
    const createdAt = new Date().toISOString()
    const status = OrderStatus.CREATED
    const {
        shoppingCartId,
        projectId,
    } = event.body as unknown as OrdersCreateInput;

    const input = {
        id,
        projectId,
        shoppingCartId,
        createdAt,

        status,
        history: [
            {
                status,
                timestamp: createdAt,
            }
        ],
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

const validationSchema = Joi.object<OrdersCreateInput>({
    projectId: Joi.string().required(),
    shoppingCartId: Joi.string().required(),
})

const handler = new LambdaMiddlewares()
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(ordersCreate)

export { handler }
