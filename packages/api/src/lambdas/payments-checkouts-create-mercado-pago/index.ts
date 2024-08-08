import Joi from "joi";
import AWS from 'aws-sdk';
import * as uuid from "uuid"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from "../../middlewares/error-handler";
import jsonBodyParser from "../../middlewares/json-body-parser";
import { validatorJoi } from "../../middlewares/validator-joi";

import { MercadoPagoConfig, Preference } from 'mercadopago'
import { Items, Shipments } from "mercadopago/dist/clients/commonTypes";
import { OrderStatus } from "../orders-create/types";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * https://www.mercadopago.com.br/developers/en/reference/preferences/_checkout_preferences/post
 */
const paymentsCheckoutsCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const {
        project_id,
        return_url,
        line_items,
        shipping_options,
        enable_shipping,
        token_id,
        shopping_cart_id,
    } = event.body as unknown as PaymentsCheckoutsMercadoPagoInput

    const config = new MercadoPagoConfig({
        accessToken: token_id,
    });
    const preference = new Preference(config)

    const response = await preference.create({
        body: {
            items: line_items,
            metadata: {
                projectId: project_id,
            },
            back_urls: {
                success: return_url,
                failure: return_url,
                pending: return_url,
            },
            redirect_urls: {
                success: return_url,
                failure: return_url,
                pending: return_url,
            },
            auto_return: "all",
            shipments: enable_shipping ? {
                ...shipping_options,
                mode: "custom",
            } : void 0,
        },
        requestOptions: {

        }
    })

    const id = uuid.v4()
    const createdAt = new Date().toISOString()
    const status = OrderStatus.CREATED

    // create ORDER
    const params = {
        TableName: tableName,
        Item: {
            id,
            platform: "MERCADO_PAGO",

            projectId: project_id,
            sessionId: response.id,
            shoppingCartId: shopping_cart_id,

            status,
            createdAt,
            history: [
                {
                    status,
                    timestamp: createdAt,
                }
            ],
        }
    };

    await dynamoDb.put(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            id: response.id,
            ...response,
        })
    };
};

interface PaymentsCheckoutsMercadoPagoInput {
    // Access token for mercado pago
    token_id: string
    project_id: string
    shopping_cart_id: string
    return_url: string
    line_items: Items[]
    shipping_options: Shipments
    enable_shipping: boolean
}

// TODO unify with stripe
const validationSchema = Joi.object<PaymentsCheckoutsMercadoPagoInput>({
    token_id: Joi.string().required(),
    project_id: Joi.string().required(),
    shopping_cart_id: Joi.string().required(),
    return_url: Joi.string().required(),
    line_items: Joi.array().items(
        Joi.object({
            id: Joi.string().required(),
            title: Joi.string().required(),
            description: Joi.string().required(),
            picture_url: Joi.string().required(),
            quantity: Joi.number().required(),
            unit_price: Joi.number().required(),
            currency_id: Joi.string().required(),
        }),
    ).required(),
    enable_shipping: Joi.boolean().required(),
    shipping_options: Joi.object({
        receiver_address: Joi.object({
            zip_code: Joi.string().required(),
            street_name: Joi.string().required(),
            city_name: Joi.string().required(),
        }).required(),
        cost: Joi.number().required(),
    }).required()
})

const handler = new LambdaMiddlewares()
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(paymentsCheckoutsCreate)

export { handler }
