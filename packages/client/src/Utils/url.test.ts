import { createUrl } from "./url"

describe("url utils", () => {
    it("should validate a new url", () => {
        const input = "foo.maistro.live"
        const output = createUrl(input)
        expect(output).toBe(input)
    })

    it("should create path url", () => {
        const input = "foo"
        const output = createUrl(input)
        expect(output).toBe("foo.maistro.live")
    })

    it("should create path url", () => {
        const input = "foo."
        const output = createUrl(input)
        expect(output).toBe("foo.maistro.live")
    })

    it("should validate external url", () => {
        let input = "external-url.google.com"
        let output = createUrl(input)
        expect(output).toBe("external-url.google.com")

        input = "foo.com"
        output = createUrl(input)
        expect(output).toBe("foo.com")
    })
})
