import Stripe from "stripe"
import Joi from "joi";
import AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import * as uuid from "uuid"

import { LambdaMiddlewares } from '../../middlewares';
import createError from "../../middlewares/error-handler";
import jsonBodyParser from "../../middlewares/json-body-parser";
import { validatorJoi } from "../../middlewares/validator-joi";
import sanitiseInput from "../../utils/sanitiseInput";
import createUpdateParams from "../../utils/createUpdateParams";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const paymentsShoppingCartsCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const shoppingCartId = event.pathParameters && event.pathParameters['shopping-cart-id']
    if (!shoppingCartId) {
        throw createError(500, "shoppingCartId not specified")
    }

    const createdAt = new Date().toISOString()
    const { projectId, items } = event.body as unknown as PaymentsShoppingCartsInput

    const input = sanitiseInput({
        items,
        updatedAt: new Date().toISOString(),
    })


    const params = createUpdateParams(
        input,
        {
            id: shoppingCartId,
            projectId,
        },
        tableName
    )

    await dynamoDb.update(params).promise()

    return {
        statusCode: 200,
        body: JSON.stringify({
            id: shoppingCartId,
            projectId,
            createdAt,
            items,
        })
    };
};

interface PaymentsShoppingCartsInput {
    projectId: string
    items: {
        productId: string
        price: number
        priceDecimal: string
        quantity: number
    }[]
}

const validationSchema = Joi.object<PaymentsShoppingCartsInput>({
    projectId: Joi.string().required(),
    items: Joi.array().items(
        Joi.object({
            productId: Joi.string().required(),
            price: Joi.number().required(),
            priceDecimal: Joi.string().optional(),
            quantity: Joi.number().required()
        })
    ).required()
})

const handler = new LambdaMiddlewares()
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(paymentsShoppingCartsCreate)

export { handler }
