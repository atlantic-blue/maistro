import Stripe from "stripe"
import Joi from "joi";
import AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from "../../middlewares/error-handler";
import jsonBodyParser from "../../middlewares/json-body-parser";
import { validatorJoi } from "../../middlewares/validator-joi";
import { calculateFeeAmount } from "./feeAmounts";

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

    const { return_url, line_items, project_id, account_id } = event.body as unknown as PaymentsCheckoutsInput

    const session = await stripe.checkout.sessions.create(
        {
            mode: "payment",
            ui_mode: "embedded",
            return_url,
            line_items,
            payment_intent_data: {
                application_fee_amount: calculateFeeAmount(line_items, TRANSACTION_FEE_PERCENTAGE)
            },
            metadata: {
                project_id
            }
        },
        {
            stripeAccount: account_id,
        }
    )

    const params = {
        TableName: tableName,
        Item: {
            id: session.id,
            projectId: project_id,
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

interface PaymentsCheckoutsInput {
    project_id: string
    account_id: string
    return_url: string
    line_items: Stripe.Checkout.SessionCreateParams.LineItem[]
}

const validationSchema = Joi.object<PaymentsCheckoutsInput>({
    project_id: Joi.string().required(),
    account_id: Joi.string().required(),
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
        })
    ).required(),
})

const handler = new LambdaMiddlewares()
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(paymentsCheckoutsCreate)

export { handler }
