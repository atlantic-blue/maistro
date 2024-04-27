interface Env {
    api: {
        baseUrl: string
        ping: string
        upload: string
        email: {
            lists: {
                create: string
                read: string
            }
            entries: {
                create: string
                read: string
            }
        }
        content: {
            create: (projectId: string) => string
            read: (projectId: string) => string
            update: (projectId: string) => string
            delete: (projectId: string) => string
        }
        pages: {
            create: (projectId: string) => string
            read: (projectId: string) => string
            update: (projectId: string) => string
            delete: (projectId: string) => string
        }
        projects: {
            create: string
            read: string
            update: string
            delete: string
        }
        payments: {
            subscriptions: {
                read: string
            }
        }
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
    payments: {
        stripe: {
            publishableKey: string
            subscriptionPriceId: string
        }
        successUrl: string
        cancelUrl: string
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
            email: {
                lists: {
                    create: `${apiBaseUrl}/email/lists`,
                    read: `${apiBaseUrl}/email/lists`,
                },
                entries: {
                    create: `${apiBaseUrl}/email/entries`,
                    read: `${apiBaseUrl}/email/list-entries`,
                }
            },
            content: {
                create: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/content`,
                read: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/content`,
                update: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/content`,
                delete: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/content`,
            },
            pages: {
                create: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/pages`,
                read: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/pages`,
                update: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/pages`,
                delete: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/pages`,
            },
            projects: {
                create: `${apiBaseUrl}/projects`,
                read: `${apiBaseUrl}/projects`,
                update: `${apiBaseUrl}/projects`,
                delete: `${apiBaseUrl}/projects`,
            },
            payments: {
                subscriptions: {
                    read: `${apiBaseUrl}/payments/subscriptions`,
                }
            }
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
        payments: {
            stripe: {
                publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
                subscriptionPriceId: process.env.STRIPE_SUBSCRIPTION_PRICE_ID || "",
            },
            successUrl: `${window.location.origin}/settings?success=true`,
            cancelUrl: window.location.origin,
        }
    }
}

const env = createEnv()
export default env
