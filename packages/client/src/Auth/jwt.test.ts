import { decodeJwt } from "./jwt"

describe("jwt", () => {
    it("should capture header payload and signature", () => {
        const header = btoa(JSON.stringify({}))
        const payload = btoa(JSON.stringify({}))
        const [decoded] = decodeJwt(`${header}.${payload}.signature`)

        expect(decoded).not.toBeNull()
        if (!decoded) {
            return
        }

        expect(decoded.encoded.header).toBe(header)
        expect(decoded.encoded.payload).toBe(payload)
        expect(decoded.encoded.signature).toBe("signature")
    })

    it("should throw an error if jwt header is not found", () => {
        const header = btoa(JSON.stringify({}))

        const [, error] = decodeJwt(`${header}.`)
        expect(error).not.toBeNull()
    })

    it("should throw an error if jwt payload is not found", () => {
        const header = btoa(JSON.stringify({}))
        const payload = btoa(JSON.stringify({}))

        const [, error] = decodeJwt(`${header}.${payload}`)
        expect(error).not.toBeNull()
    })

    it("should return decoded headers and payloads", () => {
        const header = {
            foo: "baz"
        }
        const headerEncoded = btoa(JSON.stringify(header))
        const payload = {
            "gizmo": "modo"
        }
        const payloadEncoded = btoa(JSON.stringify(payload))
        const [decodedJwt] = decodeJwt(`${headerEncoded}.${payloadEncoded}.signature`)

        expect(decodedJwt).not.toBeNull()
        if (!decodedJwt) {
            return
        }

        expect(decodedJwt.decoded.header).toMatchObject(header)
        expect(decodedJwt.decoded.payload).toMatchObject(payload)
    })
})