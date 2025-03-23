import { APIGatewayProxyEvent } from "aws-lambda"
import authJwt from "."

describe("auth jwt", () => {
    it("should reject if no token is supplied", () => {

        // @ts-expect-error
        const event: APIGatewayProxyEvent = {
            headers: {}
        }

        expect(() => authJwt(event)).toThrow()
    })

    it("should reject invalid token", () => {

        // @ts-expect-error
        const event: APIGatewayProxyEvent = {
            headers: {
                Authorization: "Bearer eyJ0eXUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MTM0ODc1MzEsImV4cCI6MTc0NTAyMzUzMSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.5y01pDwH_apTnulgef-JW5whsp_lYUH8ZbdYmvn4BcU"
            }
        }

        expect(() => authJwt(event)).toThrow()
    })

    it("should decode token", () => {

        // @ts-expect-error
        const event: APIGatewayProxyEvent = {
            headers: {
                Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MTM0ODc1MzEsImV4cCI6MTc0NTAyMzUzMSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.5y01pDwH_apTnulgef-JW5whsp_lYUH8ZbdYmvn4BcU"
            }
        }

        const response = authJwt(event)
        // @ts-expect-error
        expect(response.auth.decodedJwt).toBeTruthy()
        // @ts-expect-error
        expect(response.auth.decodedJwt.payload).toBeTruthy()
        // @ts-expect-error
        expect(response.auth.decodedJwt.header).toBeTruthy()
        // @ts-expect-error
        expect(response.auth.decodedJwt.signature).toBeTruthy()
    })
})