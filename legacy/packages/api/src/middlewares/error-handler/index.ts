class LambdaError extends Error {

    constructor(code: number, message: string) {
        super(`${code} : ${message}`)
    }
}

const createError = (code: number, message: string) => {
    return new LambdaError(code, message)
}

export default createError
