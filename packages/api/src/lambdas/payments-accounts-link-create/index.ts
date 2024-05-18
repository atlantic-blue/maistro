import Stripe from "stripe"
import jwt from "jsonwebtoken"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from "../../middlewares/error-handler";
import authJwt from "../../middlewares/auth-jwt";
import Joi from "joi";
import jsonBodyParser from "../../middlewares/json-body-parser";
import { validatorJoi } from "../../middlewares/validator-joi";

const paymentsSecretKey = process.env.PAYMENTS_SECRET_KEY
const stripe = new Stripe(paymentsSecretKey as string, {
    apiVersion: "2024-04-10",
})

interface PaymentsAccountsLinkCreateInput {
    accountId: string
}

const paymentsAccountsLinkCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    if (!paymentsSecretKey) {
        throw createError(500, "process PAYMENTS_SECRET_KEY not specified")
    }

    const { payload } = (event as any).auth.decodedJwt as jwt.Jwt
    // @ts-expect-error email is added by cognito and it is not a default payload
    const email: string = payload.email
    if (!email) {
        throw createError(500, "email not specified")
    }

    const { accountId } = event.body as unknown as PaymentsAccountsLinkCreateInput;

    const accountLink = await stripe.accountLinks.create({
        account: accountId,
        return_url: `https://maistro.website/payments/accounts/success`,
        refresh_url: `https://maistro.website/payments/accounts`,
        type: "account_onboarding",
    });

    return {
        statusCode: 200,
        body: JSON.stringify({
            accountLink
        })
    };
};

const validationSchema = Joi.object<PaymentsAccountsLinkCreateInput>({
    accountId: Joi.string().required(),
})

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(paymentsAccountsLinkCreate)

export { handler }
