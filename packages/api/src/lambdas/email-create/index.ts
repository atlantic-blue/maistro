import Joi from "joi"
import jwt from "jsonwebtoken"
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

import jsonBodyParser from '../../middlewares/json-body-parser';
import { LambdaMiddlewares } from '../../middlewares';
import { validatorJoi } from '../../middlewares/validator-joi';
import authJwt from "../../middlewares/auth-jwt";
import createError from "../../middlewares/error-handler";
import sendEmail from "./sendEmail";

const emailCreate: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    const { payload } = (event as any).auth.decodedJwt as jwt.Jwt
    const userId = payload.sub
    if (!userId) {
        throw createError(500, "userId not specified")
    }

    const { to, cc, bcc, from, subject, body } = event.body as unknown as EmailEntryCreateInput;

    const response = await sendEmail({ to, cc, bcc, from, subject, body })

    return {
        statusCode: 202,
        body: JSON.stringify({
            id: response.MessageId
        })
    };
};

interface EmailEntryCreateInput {
    to: string[]
    cc?: string[]
    bcc?: string[]
    from: string
    subject: string
    body: string
}

const validationSchema = Joi.object<EmailEntryCreateInput>({
    to: Joi.array().items(Joi.string().email()).required(),
    cc: Joi.array().items(Joi.string().email()),
    bcc: Joi.array().items(Joi.string().email()),
    from: Joi.string().email().required(),
    subject: Joi.string().required(),
    body: Joi.string().required(),
})

const handler = new LambdaMiddlewares()
    .before(authJwt)
    .before(jsonBodyParser)
    .before(validatorJoi(validationSchema))
    .handler(emailCreate)

export { handler }
