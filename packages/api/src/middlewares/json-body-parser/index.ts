import { APIGatewayProxyEvent } from "aws-lambda"
import createError from "../error-handler";

const NAME = "JSON_BODY_PARSER"
const jsonBodyParser = (event: APIGatewayProxyEvent) => {
    try {
        const body = event.body && JSON.parse(event.body);
        if (!body) {
            // TODO add logger
            console.log(500, `Middleware | ${NAME} | Empty request`, { event })
            throw createError(500, `Middleware | ${NAME} | Empty request`)
        }

        event.body = body
        return event
    } catch (error) {
        // TODO add logger
        console.log(500, `Middleware | ${NAME} | Unable to parse body`, { error })
        throw createError(500, `Middleware | JSON Parser | Unable to parse body`)
    }
}

export default jsonBodyParser
