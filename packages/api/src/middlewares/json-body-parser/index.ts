import { APIGatewayProxyEvent } from "aws-lambda"
import createError from "../error-handler";

const NAME = "JSON_BODY_PARSER"
const jsonBodyParser = (event: APIGatewayProxyEvent) => {
    try {
        if (event.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            if (event.isBase64Encoded && typeof event.body === "string") {
                const formData = Buffer.from(event.body, 'base64').toString()
                const params = new URLSearchParams(formData)
                const body: Record<string, string> = {}
                params.forEach((value, key) => {
                    body[key] = value
                })

                // @ts-expect-error parsing into object
                event.body = body
                return event
            }
        }

        const body = event.body && JSON.parse(event.body);
        if (!body) {
            // TODO add logger
            console.log(500, `Middleware | ${NAME} | Empty request`, { event })
            throw createError(500, `Middleware | ${NAME} | Empty request`)
        }

        event.rawBody = event.body
        event.body = body
        return event
    } catch (error) {
        // TODO add logger
        console.log(500, `Middleware | ${NAME} | Unable to parse body`, { error })
        throw createError(500, `Middleware | JSON Parser | Unable to parse body`)
    }
}

export default jsonBodyParser
