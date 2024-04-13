interface Env {
    api: {
        baseUrl: string
        ping: string
        upload: string
    }
    hosting: {
        baseUrl: string
    }
    auth: {
        baseUrl: string
        logInUrl: string
        logOutUrl: string
        callbackUrl: string
        clientId: string
        clientSecret: string
    }
}

const createEnv = (): Env => {
    const apiBaseUrl = process.env.URL_API_BASE_URL || ""
    const authBaseUrl = process.env.AUTH_DOMAIN || ""

    return {
        api: {
            baseUrl: apiBaseUrl,
            ping: `${apiBaseUrl}/ping`,
            upload: `${apiBaseUrl}/upload`,
        },
        hosting: {
            baseUrl: process.env.URL_HOSTING_BASE_URL || "",
        },
        auth: {
            baseUrl: authBaseUrl,
            logInUrl: `${authBaseUrl}/login/`,
            logOutUrl: `${authBaseUrl}/logout`,
            callbackUrl: `${window.location.origin}/callback/`,
            clientId: process.env.AUTH_CLIENT_ID || "",
            clientSecret: process.env.AUTH_CLIENT_SECRET || "",
        },
    }
}

const env = createEnv()
export default env
