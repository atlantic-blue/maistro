import Joi from "joi"
import { APIGatewayProxyEvent } from "aws-lambda";

import createError from "../error-handler";

const NAME = "VALIDATOR_JOI"
const validatorJoi = (schema: Joi.ObjectSchema<unknown>) => {
    return (event: APIGatewayProxyEvent) => {
        const { error } = schema.validate(event.body)
        if (error) {
            // TODO add logger
            console.log(500, `Middleware | ${NAME} | ${error.name} | details: ${JSON.stringify(error.details || [])}`);
            throw createError(500, `Middleware | ${NAME} | ${error.name} | details: ${JSON.stringify(error.details || [])}`)
        }

        return event
    }
}

export { validatorJoi }