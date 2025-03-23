import { parse, print } from "recast";

const constructJSON = (input: string) => {
    const ast = parse(input)
    console.log(ast)
}

export default constructJSON
