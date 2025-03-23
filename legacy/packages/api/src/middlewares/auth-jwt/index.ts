import jwt from "jsonwebtoken"
import { APIGatewayProxyEvent } from "aws-lambda"

import createError from "../error-handler";

const authJwt = (event: APIGatewayProxyEvent) => {
    const token = event.headers.Authorization || event.headers.authorization;
    if (!token) {
        throw createError(401, "No JWT Provided")
    }

    const decoded = jwt.decode(token.replace('Bearer ', ''), { complete: true });
    if (!decoded || !decoded.payload) {
        throw createError(401, "Invalid token")
    }

    // @ts-expect-error
    event.auth = {
        decodedJwt: decoded
    }
    return event
}

export default authJwt