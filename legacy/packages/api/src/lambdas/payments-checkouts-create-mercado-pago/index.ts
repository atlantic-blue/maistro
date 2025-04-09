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

const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * Generate a preference with the information of a product or service
 * and obtain the necessary URL to start the payment flow
 * 
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
        token_id,
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
        },
        requestOptions: {

        }
    })

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
})

const handler = new LambdaMiddlewares()
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(paymentsCheckoutsCreate)

export { handler }
