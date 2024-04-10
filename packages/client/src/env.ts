interface Env {
    app: {
        /**
         * Unique identifier for this app
         */
        uuid: string
    }
    api: {
        baseUrl: string
        ping: string
        upload: string
    }
    hosting: {
        baseUrl: string
    }
    auth: {
        domain: string
        clientId: string
    }
}

const createEnv = (): Env => {
    const apiBaseUrl = process.env.URL_API_BASE_URL || ""

    return {
        app: {
            uuid: process.env.APP_UUID || "",
        },
        api: {
            baseUrl: apiBaseUrl,
            ping: `${apiBaseUrl}/ping`,
            upload: `${apiBaseUrl}/upload`,
        },
        hosting: {
            baseUrl: process.env.URL_HOSTING_BASE_URL || "",
        },
        auth: {
            domain: process.env.AUTH_DOMAIN || "",
            clientId: process.env.AUTH_CLIENT_ID || "",
        }
    }
}

const env = createEnv()
export default env
