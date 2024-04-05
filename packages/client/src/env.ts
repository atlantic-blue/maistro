interface Env {
    api: {
        baseURL: string
    }
}

const env: Env = {
    api: {
        baseURL: process.env.URL_API_BASE_URL || "",
    }
}

export default env
