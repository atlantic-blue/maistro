interface Env {
    api: {
        baseUrl: string
        ping: string
        upload: string
    }
    hosting: {
        baseUrl: string
    }
}

const createEnv = (): Env => {
    const apiBaseUrl = process.env.URL_API_BASE_URL || ""

    return {
        api: {
            baseUrl: apiBaseUrl,
            ping: `${apiBaseUrl}/ping`,
            upload: `${apiBaseUrl}/upload`,
        },
        hosting: {
            baseUrl: process.env.URL_HOSTING_BASE_URL || ""
        }
    }
}

const env = createEnv()
export default env
