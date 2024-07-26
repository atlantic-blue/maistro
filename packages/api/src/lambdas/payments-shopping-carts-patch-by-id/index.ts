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
 * Stateful update
 */
const paymentsShoppingCartsPatch: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
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

    const updatedItemsMap: { [id: string]: ShoppingCartItem } = {};
    const { items } = event.body as unknown as PaymentsShoppingCartsInput

    // Increment or decrement items
    [
        ...shoppingCart.items || [],
        ...items || [],
    ].forEach(item => {
        if (updatedItemsMap[item.productId] !== undefined) {
            updatedItemsMap[item.productId] = {
                ...item,
                quantity: updatedItemsMap[item.productId].quantity += item.quantity,
            }
        } else {
            updatedItemsMap[item.productId] = {
                ...item,
                quantity: item.quantity,
            }
        }
    })

    const nextItems: ShoppingCart["items"] = [];

    Object.keys(updatedItemsMap).map(key => {
        const { quantity, productId, modifiers } = updatedItemsMap[key]
        if (quantity > 0) {
            nextItems.push({
                productId: productId,
                quantity: quantity,
                modifiers: modifiers
            })
        }
    })

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

interface ShoppingCartItem {
    quantity: number,
    productId: string
    modifiers: Array<{
        id: string,
        quantity: number,
    }>
}

interface ShoppingCart {
    id: string,
    createdAt: string,
    projectId: string
    items: Array<ShoppingCartItem>
}

interface PaymentsShoppingCartsInput {
    items: Array<ShoppingCartItem>
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
    .handler(paymentsShoppingCartsPatch)

export { handler }
