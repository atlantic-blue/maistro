const toSnakeCase = (input: string) => {
    return input
        .replace(/[A-Z]/g, value => `_${value.toLocaleLowerCase()}`)
        .replace(/^_/, '')
        .replaceAll(" ", "_")
        .replaceAll("-", "_")
}

type Input = { [k: string]: unknown }
const keysToSnakeCase = (input: Input) => {
    return Object.keys(input).reduce<Input>((acc, next) => {
        let value = input[next]
        if (
            typeof value === "object" &&
            !Array.isArray(value) &&
            value !== null
        ) {
            value = keysToSnakeCase(value as Input)
        }

        acc[toSnakeCase(next)] = value
        return acc
    }, {})
}

export {
    keysToSnakeCase,
    toSnakeCase as default
}
