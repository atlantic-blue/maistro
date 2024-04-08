interface Env {
    api: {
        baseUrl: string
        ping: string
        upload: string
    }
}

const createEnv = (): Env => {
    const baseUrl = process.env.URL_API_BASE_URL || "https://api.maistro.website/v1"

    return {
        api: {
            baseUrl,
            ping: `${baseUrl}/ping`,
            upload: `${baseUrl}/upload`,
        }
    }
}

const env = createEnv()
export default env
