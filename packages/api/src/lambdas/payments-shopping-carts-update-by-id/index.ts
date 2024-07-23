import Joi from "joi";
import AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from "../../middlewares/error-handler";
import jsonBodyParser from "../../middlewares/json-body-parser";
import { validatorJoi } from "../../middlewares/validator-joi";
import sanitiseInput from "../../utils/sanitiseInput";
import createUpdateParams from "../../utils/createUpdateParams";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * Idempotent update
 */
const paymentsShoppingCartsUpdate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const shoppingCartId = event.pathParameters && event.pathParameters['shopping-cart-id']
    if (!shoppingCartId) {
        throw createError(500, "shoppingCartId not specified")
    }

    const queryParams: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: tableName,
        IndexName: 'IdIndex',
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
            ':id': shoppingCartId,
        },
        Limit: 25,
    };
    const data = await dynamoDb.query(queryParams).promise();

    if (
        !data ||
        !data.Items ||
        data.Items?.length === 0
    ) {
        return {
            statusCode: 404,
            body: JSON.stringify([])
        };
    }

    const shoppingCartIndex = data.Items.findIndex(i => i.id === shoppingCartId)
    const shoppingCart = data.Items[shoppingCartIndex] as ShoppingCart
    if (!shoppingCart) {
        return {
            statusCode: 404,
            body: JSON.stringify([])
        };
    }

    // Create Map
    const itemsMap = new Map<string, {
        quantity: number,
        productId: string,
        modifiers: Array<{
            id: string;
            quantity: number;
        }>
    }>();
    (shoppingCart.items || []).forEach(i => itemsMap.set(i.productId, i))

    const { items } = event.body as unknown as PaymentsShoppingCartsInput;

    // Update Map
    (items || []).forEach(i => {
        if (i.quantity === 0) {
            itemsMap.delete(i.productId)
        } else {
            itemsMap.set(i.productId, i)
        }
    })

    // Return Map
    const nextItems: ShoppingCart["items"] = [];
    itemsMap.forEach(i => nextItems.push(i));

    const updatedAt = new Date().toISOString()
    const input = sanitiseInput({
        items: nextItems,
        updatedAt,
    })

    const params = createUpdateParams(
        input,
        {
            id: shoppingCartId,
            projectId: shoppingCart.projectId,
        },
        tableName
    )

    await dynamoDb.update(params).promise()

    return {
        statusCode: 200,
        body: JSON.stringify({
            id: shoppingCartId,
            updatedAt,
            items: nextItems,
        })
    };
};

interface ShoppingCart {
    id: string,
    createdAt: string,
    projectId: string
    items: Array<{
        quantity: number,
        productId: string
        modifiers: Array<{
            id: string,
            quantity: number,
        }>
    }>
}

interface PaymentsShoppingCartsInput {
    items: Array<{
        quantity: number,
        productId: string,
        modifiers: Array<{
            id: string,
            quantity: number,
        }>
    }>
}

const validationSchema = Joi.object<PaymentsShoppingCartsInput>({
    items: Joi.array().items(
        Joi.object({
            productId: Joi.string().required(),
            quantity: Joi.number().required(),
            modifiers: Joi.array().items(
                Joi.object({
                    id: Joi.string().required(),
                    quantity: Joi.number().required()
                })
            ).required()
        })
    ).required()
})

const handler = new LambdaMiddlewares()
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(paymentsShoppingCartsUpdate)

export { handler }
