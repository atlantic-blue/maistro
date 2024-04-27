import sanitiseInput from "./sanitiseInput"

describe("createUpdateInput", () => {
    it("should create input from event.body", () => {
        const event = {
            body: {
                title: "data",
                path: "data",
                colourScheme: "data",
                contentIds: "data",
                description: "data",
                fontScheme: "data",
            }
        }

        const output = sanitiseInput(event.body)
        expect(output).toStrictEqual({
            title: "data",
            path: "data",
            colourScheme: "data",
            contentIds: "data",
            description: "data",
            fontScheme: "data",
        })
    })


    it("should remove undefined values", () => {
        const event = {
            body: {
                title: "data",
                path: "data",
                colourScheme: "data",
                contentIds: "data",
                description: undefined,
                fontScheme: undefined,
            }
        }

        const output = sanitiseInput(event.body)
        expect(output).toStrictEqual({
            title: "data",
            path: "data",
            colourScheme: "data",
            contentIds: "data",
        })
    })

    it("should remove undefined values", () => {
        const event = {
            body: undefined
        }

        const output = sanitiseInput(event.body)
        expect(output).toStrictEqual({})
    })
})