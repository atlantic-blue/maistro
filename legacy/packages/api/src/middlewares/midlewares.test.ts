import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"
import { LambdaMiddlewares } from "."
import jsonBodyParser from "./json-body-parser"

describe("LambdaMiddlewares", () => {
    it("should reject empty events with jsonBodyParser", async () => {
        const middlewares = new LambdaMiddlewares()

        const bizLogic = (event: APIGatewayProxyEvent) => {

        }

        const handler = middlewares
            .before(jsonBodyParser)
            .handler(bizLogic)

        // @ts-expect-error partial implementation
        const event: APIGatewayProxyEvent = {
            // body: JSON.stringify({ a: 1 })
        }

        // @ts-expect-error partial implementation
        const context: Context = {}

        await expect(
            handler(event, context, () => void 0)
        ).rejects.toThrow(
            "500 : Middleware | JSON Parser | Unable to parse body"
        )
    })

    it("should reject empty body events with jsonBodyParser", async () => {
        const middlewares = new LambdaMiddlewares()

        const bizLogic = (event: APIGatewayProxyEvent) => {

        }

        const handler = middlewares
            .before(jsonBodyParser)
            .handler(bizLogic)

        // @ts-expect-error partial implementation
        const event: APIGatewayProxyEvent = {
            body: ""
        }

        // @ts-expect-error partial implementation
        const context: Context = {}

        await expect(
            handler(event, context, () => void 0)
        ).rejects.toThrow(
            "500 : Middleware | JSON Parser | Unable to parse body"
        )
    })


    it("should reject empty malformed body events with jsonBodyParser", async () => {
        const middlewares = new LambdaMiddlewares()

        const bizLogic = (event: APIGatewayProxyEvent) => {

        }

        const handler = middlewares
            .before(jsonBodyParser)
            .handler(bizLogic)

        // @ts-expect-error partial implementation
        const event: APIGatewayProxyEvent = {
            body: "not a parsable obj"
        }

        // @ts-expect-error partial implementation
        const context: Context = {}

        await expect(
            handler(event, context, () => void 0)
        ).rejects.toThrow(
            "500 : Middleware | JSON Parser | Unable to parse body"
        )
    })

    it("should parse events with jsonBodyParser", async () => {
        const middlewares = new LambdaMiddlewares()

        const bizLogic = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
            return {
                statusCode: 200,
                body: JSON.stringify(event.body),
            }
        }

        const handler = middlewares
            .before(jsonBodyParser)
            .handler(bizLogic)

        // @ts-expect-error partial implementation
        const event: APIGatewayProxyEvent = {
            body: JSON.stringify({ a: 1 })
        }

        // @ts-expect-error partial implementation
        const context: Context = {}

        const result = await handler(event, context, () => void 0)
        expect(result).toBeTruthy()

        if (!result) {
            return
        }

        expect(result.statusCode).toBe(200)
    })
})