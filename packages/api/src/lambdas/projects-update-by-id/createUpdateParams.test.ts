import createUpdateParams from "./createUpdateParams"

describe("createUpdateParams", () => {
    it("should format update input params based on input", () => {
        const tableName = "baz"
        const key = {
            userId: "gizmo",
            id: "bar"
        }
        const input = {
            name: "foo",
            picture: "foo-bar"
        }

        const output = createUpdateParams(input, key, tableName)

        const expected = {
            TableName: 'baz',
            Key: { userId: 'gizmo', id: 'bar' },
            UpdateExpression: 'set #name = :val0, #picture = :val1',
            ExpressionAttributeNames: {
                '#name': 'name',
                "#picture": "picture",
            },
            ExpressionAttributeValues: {
                ':val0': 'foo',
                ":val1": "foo-bar",
            },
            ReturnValues: 'UPDATED_NEW'
        }

        expect(output).toStrictEqual(expected)
    })

    it("should throw if no keyed input is supplied", () => {
        const tableName = "baz"
        const key = {
            userId: "gizmo",
            id: "bar"
        }

        const input = {}

        expect(() => createUpdateParams(input, key, tableName)).toThrow()
    })

    it("should throw if null input is supplied", () => {
        const tableName = "baz"
        const key = {
            userId: "gizmo",
            id: "bar"
        }

        const input = null

        expect(() => createUpdateParams(input, key, tableName)).toThrow()
    })
})