import { APIGatewayProxyEvent } from "aws-lambda"
import createError from "../error-handler";

const NAME = "CORS"
const cors = (event: APIGatewayProxyEvent) => {
    try {
        // CORS headers
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',  // Allow all origins
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',  // Allowed methods
            'Access-Control-Allow-Headers': 'Content-Type',  // Allowed headers
        };
        // Determine if The request is a CORS protocol request.
        if (event.headers["sec-fetch-mode"] === 'cors') {
            // Handle pre-flight request for CORS
            return {
                statusCode: 200,
                headers: headers,
                body: JSON.stringify('CORS preflight response'),
            };
        }

        event.corsHeaders
        return event
    } catch (error) {
        // TODO add logger
        console.log(500, `Middleware | ${NAME}`, { error })
        throw createError(500, `Middleware | ${NAME}`)
    }
}

export default cors
