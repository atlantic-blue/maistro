const handler = async () => {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: "PONG",
        }),
    }
}

export { handler }
