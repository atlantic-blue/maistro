type AstNodeValue = string | number | boolean | AstNodeValueObject | AstNodeValueArray | null;

interface AstNodeValueObject {
    [k: string]: AstNodeValue
}
interface AstNodeValueArray extends Array<AstNodeValue> { }

export const AST_NODE_ARRAY = "__AstNodeArray__"

export class AstNode {
    key: string
    value: AstNodeValue
    children: AstNode[]

    constructor(key: string, value: AstNodeValue = null) {
        this.key = key
        this.value = value
        this.children = []
    }

    public setChild = (child: AstNode) => {
        this.children.push(child)
        return this
    }

    public toJson(): AstNodeValue {
        if (!this.children.length) {
            return this.value
        }

        if (this.value === AST_NODE_ARRAY) {
            return this.children.map(child => child.toJson())
        }

        const obj: AstNodeValueObject = {}
        for (let child of this.children) {
            obj[child.key] = child.toJson()
        }

        return obj
    }

}

export enum Char {
    CHAR_BRACES_OPEN = "{",
    CHAR_BRACES_CLOSE = "}",
    CHAR_BRACKET_OPEN = "[",
    CHAR_BRACKET_CLOSE = "]",
    CHAR_COMMA = ",",
    CHAR_COLON = ":"
}

export class JsonAst {
    private index = 0
    private jsonString: string
    private ast: AstNode | null

    constructor(jsonString: string) {
        this.jsonString = jsonString
        this.ast = this.parseValue()
    }


    private skipWhiteSpace() {
        this.skip(/\s/.test(this.jsonString[this.index]))
    }

    private skip(condition: boolean) {
        while (
            this.index < this.jsonString.length &&
            condition
        ) {
            this.incrementCursor()
        }
    }

    private getChar() {
        return this.jsonString[this.index]
    }

    private incrementCursor() {
        console.log(this.getChar(), this.index)
        this.index++
    }

    private expect(value: string) {
        const currentValue = this.getChar()
        if (currentValue !== value) {
            return this.skip(
                currentValue !== Char.CHAR_COMMA &&
                currentValue !== Char.CHAR_BRACKET_CLOSE &&
                currentValue !== Char.CHAR_BRACES_CLOSE
            )
        }
        return this.incrementCursor()
    }

    private parseValue(): AstNode | null {
        this.skipWhiteSpace()
        const char = this.getChar()
        switch (char) {
            case Char.CHAR_BRACES_OPEN:
                return this.parseObject()
            case "'":
            case '"':
                return this.parseString()
            default:
                return null
        }
    }

    private parseObject(): AstNode {
        this.expect(Char.CHAR_BRACES_OPEN)
        while (
            this.index < this.jsonString.length
        ) {
            if (this.jsonString[this.index] === Char.CHAR_BRACES_CLOSE) {
                this.incrementCursor()
                break;
            }
            const keyNode = this.parseString();
            if (!keyNode) {
                this.incrementCursor()
                continue;
            }
            this.skipWhiteSpace()
            this.expect(Char.CHAR_COLON)
            const valueNode = this.parseValue()

            if (valueNode) {
                console.log({ valueNode })
            }
            console.log({ keyNode })
            this.incrementCursor()
        }
    }

    private parseString(key = ""): AstNode | null {
        const quoteChar = this.getChar()
        if (quoteChar !== "'" && quoteChar !== '"') {
            return null
        }

        this.incrementCursor()
        const stringStart = this.index
        while (
            this.index < this.jsonString.length &&
            this.jsonString[this.index] !== quoteChar
        ) {
            this.incrementCursor()
        }
        if (this.jsonString[this.index] === quoteChar) {
            const value = this.jsonString.slice(stringStart, this.index)
            this.incrementCursor()
            return new AstNode(key, value)
        }
        return null
    }
}

