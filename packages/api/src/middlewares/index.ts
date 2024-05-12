import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Callback, CloudFrontRequestHandler, Context } from "aws-lambda"

type middlewareRequestFn = (e: APIGatewayProxyEvent) => Promise<APIGatewayProxyEvent> | APIGatewayProxyEvent
type middlewaresResponseFn = (e: APIGatewayProxyResult) => APIGatewayProxyResult

class LambdaMiddlewares {
    private middlewaresRequest: middlewareRequestFn[] = []
    private middlewaresResponse: middlewaresResponseFn[] = []

    private reduceMiddlewaresRequest = async (
        event: APIGatewayProxyEvent,
        context: Context,
        callback: Callback<APIGatewayProxyResult>,
        middlewares: middlewareRequestFn[]
    ) => {
        return await middlewares
            .reduce(
                async (params, fn) => {
                    const resolvedParams = await params
                    resolvedParams.event = await fn(resolvedParams.event)
                    return resolvedParams
                },
                Promise.resolve({ event, context, callback })
            )
    }

    public before(fn: middlewareRequestFn) {
        this.middlewaresRequest.push(fn)
        return this
    }

    public after(fn: middlewaresResponseFn) {
        this.middlewaresResponse.push(fn)
        return this
    }

    public handler(handler: APIGatewayProxyHandler | CloudFrontRequestHandler) {
        return async (
            rawEvent: APIGatewayProxyEvent,
            rawContext: Context,
            rawCallback: Callback<APIGatewayProxyResult>,
        ) => {
            try {
                // prepare request
                const { event, context, callback } = await this.reduceMiddlewaresRequest(
                    rawEvent,
                    rawContext,
                    rawCallback,
                    this.middlewaresRequest
                )

                // biz logic
                const result = await handler(event, context, callback)

                // prepare response
                return result
            } catch (error) {
                console.log({ error })
                console.log(JSON.stringify(rawEvent, void 0, 4))
                return {
                    statusCode: 500,
                    body: JSON.stringify({ message: error.message })
                };
            }
        }

    }
}

export { LambdaMiddlewares }