import Joi from "joi";
import AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import * as uuid from "uuid"

import { LambdaMiddlewares } from '../../middlewares';
import createError from "../../middlewares/error-handler";
import jsonBodyParser from "../../middlewares/json-body-parser";
import { validatorJoi } from "../../middlewares/validator-joi";

import { MercadoPagoConfig, Payment } from 'mercadopago'
import { PaymentCreateData } from "mercadopago/dist/clients/payment/create/types";
import { Items, Shipments } from "mercadopago/dist/clients/commonTypes";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * 
 * https://www.mercadopago.com.br/developers/en/reference/payments/_payments/post
 */
const paymentsProcessCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    const {
        project_id,
        token_id,
        form_data,
        statement_descriptor,
        line_items,
        checkout_id,
        shipping_options,
        payer,
    } = event.body as unknown as PaymentsCheckoutsMercadoPagoInput

    const config = new MercadoPagoConfig({
        accessToken: token_id,
    });
    const payment = new Payment(config)

    const response = await payment.create({
        body: {
            binary_mode: true,
            token: form_data.token,
            issuer_id: form_data.issuer_id,
            payment_method_id: form_data.payment_method_id,
            transaction_amount: form_data.transaction_amount,
            installments: form_data.installments,
            payer: {
                email: form_data.payer?.email,
                identification: {
                    number: form_data.payer?.identification?.number,
                    type: form_data.payer?.identification?.type
                }
            },
            statement_descriptor,
            external_reference: checkout_id,
            metadata: {
                project_id,
            },
            additional_info: {
                items: line_items,
                shipments: {
                    receiver_address: {
                        zip_code: shipping_options.receiver_address?.zip_code,
                        street_name: shipping_options.receiver_address?.street_name,
                        city_name: shipping_options.receiver_address?.city_name,
                    }
                },
                payer: {
                    first_name: payer.first_name,
                    last_name: payer.last_name,
                    phone: {
                        area_code: payer.phone.area_code,
                        number: payer.phone.number,
                    },
                    address: {
                        zip_code: shipping_options.receiver_address?.zip_code,
                        street_name: shipping_options.receiver_address?.street_name,
                    }
                },
            }
        },
        requestOptions: {
            idempotencyKey: uuid.v1(),
        }
    })

    console.log(JSON.stringify(response))

    const createdAt = new Date().toISOString()
    const params = {
        TableName: tableName,
        Item: {
            id: String(response.id),
            projectId: project_id,
            type: "PLATFORM_MERCADO_PAGO",
            checkout_id: checkout_id,
            createdAt,
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
    checkout_id: string
    form_data: PaymentCreateData["body"]
    statement_descriptor: string
    line_items: Items[]
    shipping_options: Shipments
    payer: {
        first_name: string
        last_name: string
        phone: {
            area_code: string
            number: string
        },
    }
}

const validationSchema = Joi.object<PaymentsCheckoutsMercadoPagoInput>({
    token_id: Joi.string().required(),
    project_id: Joi.string().required(),
    checkout_id: Joi.string().required(),
    statement_descriptor: Joi.string().required(),
    form_data: Joi.object({
        token: Joi.string().required(),
        issuer_id: Joi.string().required(),
        payment_method_id: Joi.string().required(),
        transaction_amount: Joi.number().required(),
        installments: Joi.number().required(),
        payer: Joi.object({
            email: Joi.string().required(),
            identification: {
                number: Joi.string().required(),
                type: Joi.string().required(),
            }
        }).required(),
    }).required(),
    line_items: Joi.array().items(
        Joi.object({
            id: Joi.string().required(),
            title: Joi.string().required(),
            description: Joi.string().required(),
            picture_url: Joi.string().required(),
            quantity: Joi.number().required(),
            unit_price: Joi.number().required(),
            category_id: Joi.string().required(),
        }),
    ).required(),
    shipping_options: Joi.object({
        receiver_address: Joi.object({
            zip_code: Joi.string().required(),
            street_name: Joi.string().required(),
            city_name: Joi.string().required(),
        }).required(),
    }).required(),
    payer: Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        phone: Joi.object({
            area_code: Joi.string().required(),
            number: Joi.string().required(),
        }).required(),
    }).required()
})

const handler = new LambdaMiddlewares()
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(paymentsProcessCreate)

export { handler }
