import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda"

const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: "PONG",
        }),
    }
}

export { handler }
