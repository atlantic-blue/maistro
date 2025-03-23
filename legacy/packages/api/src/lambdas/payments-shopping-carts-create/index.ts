import Stripe from "stripe"
import Joi from "joi";
import AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import * as uuid from "uuid"

import { LambdaMiddlewares } from '../../middlewares';
import createError from "../../middlewares/error-handler";
import jsonBodyParser from "../../middlewares/json-body-parser";
import { validatorJoi } from "../../middlewares/validator-joi";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const paymentsShoppingCartsCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const id = uuid.v4()
    const createdAt = new Date().toISOString()
    const { projectId } = event.body as unknown as PaymentsShoppingCartsInput

    const params = {
        TableName: tableName,
        Item: {
            id,
            projectId,
            createdAt,
        }
    };

    await dynamoDb.put(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            id,
            projectId,
            createdAt,
        })
    };
};

interface PaymentsShoppingCartsInput {
    projectId: string
}

const validationSchema = Joi.object<PaymentsShoppingCartsInput>({
    projectId: Joi.string().required(),
})

const handler = new LambdaMiddlewares()
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(paymentsShoppingCartsCreate)

export { handler }
