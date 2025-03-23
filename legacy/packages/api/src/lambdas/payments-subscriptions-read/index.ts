import Stripe from "stripe"
import jwt from "jsonwebtoken"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import { LambdaMiddlewares } from '../../middlewares';
import createError from "../../middlewares/error-handler";
import authJwt from "../../middlewares/auth-jwt";

const paymentsSecretKey = process.env.PAYMENTS_SECRET_KEY
const stripe = new Stripe(paymentsSecretKey as string)

const paymentsSubscriptionsRead: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    if (!paymentsSecretKey) {
        throw createError(500, "process PAYMENTS_SECRET_KEY not specified")
    }

    const { payload } = (event as any).auth.decodedJwt as jwt.Jwt
    // @ts-expect-error email is added by cognito and it is not a default payload
    const email: string = payload.email
    if (!email) {
        throw createError(500, "email not specified")
    }

    const customers = await stripe.customers.search({
        query: `email:\'${email}\'`,
    });
    const customer = customers.data[0]

    if (!customer) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                customer: null,
                subscription: null
            })
        };
    }

    const subscriptions = await stripe.subscriptions.list({ customer: customer.id })
    const subscription = subscriptions.data[0]

    if (!subscription) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                customer,
                subscription: null
            })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            customer: customer,
            subscription: subscription
        })
    };
};

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .handler(paymentsSubscriptionsRead)

export { handler }
