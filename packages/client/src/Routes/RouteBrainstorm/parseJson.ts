import { fromMarkdown } from "mdast-util-from-markdown"
import json5 from "json5"

const parseJson = (input: string) => {
    const md = fromMarkdown(input)
    console.log({ md })
    const code = md.children.find(child => child.type === "code")
    console.log({ code })
    return json5.parse(code?.value)
}

export default parseJson
