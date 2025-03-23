const sanitiseInput = (input?: Record<string, any>) => {
    if (!input) {
        return {}
    }

    return Object.keys(input)
        .reduce<Record<string, any>>((output, next) => {
            if (input[next] !== null && input[next] !== undefined) {
                output[next] = input[next]
            }
            return output
        }, {})
}

export default sanitiseInput
