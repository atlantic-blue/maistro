import Stripe from "stripe"
import Joi from "joi";
import AWS from 'aws-sdk';
import * as uuid from "uuid"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from "../../middlewares/error-handler";
import jsonBodyParser from "../../middlewares/json-body-parser";
import { validatorJoi } from "../../middlewares/validator-joi";
import { calculateFeeAmount } from "./feeAmounts";
import { OrderStatus } from "../orders-create/types";

const TRANSACTION_FEE_PERCENTAGE = 1
const paymentsSecretKey = process.env.PAYMENTS_SECRET_KEY
const stripe = new Stripe(paymentsSecretKey as string, {
    apiVersion: "2024-04-10",
})
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const paymentsCheckoutsCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const tableName = process.env.TABLE_NAME
    if (!tableName) {
        throw createError(500, "process TABLE_NAME not specified")
    }

    if (!paymentsSecretKey) {
        throw createError(500, "process PAYMENTS_SECRET_KEY not specified")
    }

    const {
        return_url,
        line_items,
        project_id,
        account_id,
        shopping_cart_id,
        enable_shipping,
        allowed_countries,
        shipping_options,
        fulfilment_date,
        fulfilment_date_interval,
    } = event.body as unknown as PaymentsCheckoutsInput

    const id = uuid.v4()
    const createdAt = new Date().toISOString()
    const status = OrderStatus.CREATED

    const session = await stripe.checkout.sessions.create(
        {
            mode: "payment",
            ui_mode: "embedded",
            return_url: `${return_url}?orderId=${id}`,
            line_items,
            payment_intent_data: {
                application_fee_amount: calculateFeeAmount(line_items, TRANSACTION_FEE_PERCENTAGE)
            },
            phone_number_collection: {
                enabled: true,
            },
            metadata: {
                project_id,
                account_id,
                shopping_cart_id,
                order_id: id,
            },
            ...(enable_shipping ? {
                shipping_address_collection: {
                    allowed_countries,
                },
                shipping_options,
            } : {}
            ),
        },
        {
            stripeAccount: account_id,
        }
    )

    // create ORDER
    const params = {
        TableName: tableName,
        Item: {
            id,
            platform: "STRIPE",

            projectId: project_id,
            sessionId: session.id,
            shoppingCartId: shopping_cart_id,

            fulfilment: {
                date: fulfilment_date,
                interval: fulfilment_date_interval,
            },
            items: line_items,
            shippingOptions: shipping_options,

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
            session
        })
    };
};

interface PaymentShippingOptions {
    shipping_rate: string
    shipping_rate_data: {
        display_name: string
        type: string
        fixed_amount: {
            amount: number
            currency: string
        }
    }
}

interface PaymentsCheckoutsInput {
    project_id: string
    account_id: string
    shopping_cart_id: string
    return_url: string
    line_items: Stripe.Checkout.SessionCreateParams.LineItem[]
    fulfilment_date?: string
    fulfilment_date_interval?: string
    enable_shipping: boolean
    allowed_countries: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[]
    shipping_options: PaymentShippingOptions[]
}

const validationSchema = Joi.object<PaymentsCheckoutsInput>({
    project_id: Joi.string().required(),
    account_id: Joi.string().required(),
    shopping_cart_id: Joi.string().required(),
    return_url: Joi.string().required(),
    line_items: Joi.array().items(
        Joi.object({
            quantity: Joi.number().required(),
            price_data: Joi.object({
                currency: Joi.string().required(),
                unit_amount: Joi.number().required(),
                unit_amount_decimal: Joi.string().optional(),

                product_data: Joi.object({
                    name: Joi.string().required(),
                    description: Joi.string().optional(),
                    images: Joi.array().items(Joi.string()).optional()
                }).required()
            }).required()
        }),
    ).required(),
    fulfilment_date: Joi.string().allow("").optional(),
    fulfilment_date_interval: Joi.string().allow("").optional(),
    enable_shipping: Joi.boolean().required(),
    allowed_countries: Joi.array().items(Joi.string()).optional(),
    shipping_options: Joi.array()
        .items(
            Joi.object({
                shipping_rate_data: Joi.object({
                    display_name: Joi.string().required(),
                    type: Joi.string().required(),
                    fixed_amount: {
                        amount: Joi.number().required(),
                        currency: Joi.string().required()
                    }
                }).required()
            }))
        .max(5)
        .optional()
})

const handler = new LambdaMiddlewares()
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(paymentsCheckoutsCreate)

export { handler }
