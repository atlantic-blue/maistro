import { AST_NODE_ARRAY, AstNode, JsonAst } from "./parser"

describe("Node", () => {
    it("creates a new node", () => {
        [
            "foo",
            0,
            true,
            { "foo": "baz" },
            ["foo"]
        ]
            .forEach(v => {
                const node = new AstNode("foo", v)
                expect(node.key).toEqual("foo")
                expect(node.value).toEqual(v)
            })
    })

    it("adds children to Node", () => {
        const node = new AstNode("foo", "baz")
        const childNode = new AstNode("foo", "gizmo")
        node.setChild(childNode);

        expect(node.children[0]).toEqual(childNode)
    })

    it("converts node to JSON", () => {
        const node = new AstNode("foo", "baz")
        const expected = "baz"
        expect(node.toJson()).toBe(expected)
    })

    it("converts nested node JSON", () => {
        const node = new AstNode("foo")
        const childNode = new AstNode("baz", "gizmo")
        node.setChild(childNode);

        const expected = { "baz": "gizmo" }
        expect(node.toJson()).toMatchObject(expected)
    })

    it("converts nested array node JSON", () => {
        const node = new AstNode("foo")
        const childNode = new AstNode("baz", AST_NODE_ARRAY)
        const nestedChildArray = new AstNode("foo", 0)
        childNode.setChild(nestedChildArray)
        node.setChild(childNode);

        const expected = { "baz": [0] }
        expect(node.toJson()).toMatchObject(expected)
    })

    it("converts combined nested array and objects nodes to JSON", () => {
        const node = new AstNode("foo")
            .setChild(
                new AstNode("baz", AST_NODE_ARRAY)
                    .setChild(new AstNode("item", 2))
                    .setChild(new AstNode("item", true))
                    .setChild(
                        new AstNode("obj")
                            .setChild(new AstNode("bar", 2))
                    )
            )

        const expected = {
            "baz": [
                2,
                true,
                { bar: 2 }
            ]
        }
        expect(node.toJson()).toMatchObject(expected)
    })
})

describe("Parser", () => {
    it.only("should parse object strings", () => {
        const input = `{"foo": {"a": "3"}}`

        const output = new JsonAst(input)
        console.log({ output })
    })
})