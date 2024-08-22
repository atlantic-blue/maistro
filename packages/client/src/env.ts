interface Env {
    api: {
        baseUrl: string
        ping: string
        file: {
            create: string
        }
        images: {
            get: string
        }
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
        ai: {
            aiTemplates: {
                create: () => string
                read: () => string
                readById: (id: string) => string
            }
            aiComponents: {
                create: (projectId: string) => string
            }
            aiThreads: {
                create: (projectId: string) => string
                updateById: (projectId: string, threadId: string) => string
                read: (projectId: string) => string
                readById: (projectId: string, threadId: string) => string

            }
            aiImages: {
                create: (projectId: string) => string
            }
        }
        content: {
            create: (projectId: string) => string
            read: (projectId: string) => string
            update: (projectId: string) => string
            deleteById: (projectId: string, id: string) => string
        }
        pages: {
            create: (projectId: string) => string
            read: (projectId: string) => string
            update: (projectId: string) => string
            delete: (projectId: string) => string
        }
        products: {
            create: (projectId: string) => string
            read: (projectId: string) => string
            readById: (projectId: string, id: string) => string
            updateById: (projectId: string, id: string) => string
            deleteById: (projectId: string, id: string) => string
        }
        projects: {
            create: string
            read: string
            update: string
            delete: string
            upload: (projectId: string) => string
            uploadMultipart: (projectId: string) => string
        }
        orders: {
            create: string
            read: (projectId: string) => string
            readById: (projectId: string, id: string) => string
            updateById: (projectId: string, id: string) => string
            deleteById: (projectId: string, id: string) => string
        }
        payments: {
            accounts: {
                create: string
                read: string
                readById: (accountId: string) => string
            }
            accountsLink: {
                create: string
            }
            subscriptions: {
                read: string
            }
            checkouts: {
                create: {
                    stripe: string
                    mercadoPago: string
                }
            }
            process: {
                createLatam: string
            }
        }
        system: {
            users: {
                read: string
            }
            projects: {
                read: string
                readById: (projectId: string) => string
                updateUser: (projectId: string) => string
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
            pricingTableId: string
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
            file: {
                create: `${apiBaseUrl}/upload`,
            },
            images: {
                get: `${apiBaseUrl}/images`,
            },
            email: {
                lists: {
                    create: `${apiBaseUrl}/email/lists`,
                    read: `${apiBaseUrl}/email/lists`,
                },
                entries: {
                    // Public
                    create: `${apiBaseUrl}/email/entries`,
                    read: `${apiBaseUrl}/email/list-entries`,
                }
            },
            ai: {
                aiTemplates: {
                    // create: () => `${apiBaseUrl}/templates`
                    create: () => "https://4jido7pc4pukpdi7icw7tlg6mi0gogmq.lambda-url.us-east-1.on.aws",
                    read: () => `${apiBaseUrl}/templates/`,
                    readById: (id: string) => `${apiBaseUrl}/templates/${id}`
                },
                aiComponents: {
                    // create: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/ai/components`,
                    create: () => "https://4jido7pc4pukpdi7icw7tlg6mi0gogmq.lambda-url.us-east-1.on.aws"
                },
                aiThreads: {
                    create: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/ai/threads`,
                    updateById: (projectId: string, threadId: string) => `${apiBaseUrl}/projects/${projectId}/ai/threads/${threadId}`,
                    read: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/ai/threads`,
                    readById: (projectId: string, threadId: string) => `${apiBaseUrl}/projects/${projectId}/ai/threads/${threadId}`,
                },
                aiImages: {
                    create: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/ai/images`,
                },
            },
            content: {
                create: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/content`,
                read: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/content`,
                update: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/content`,
                deleteById: (projectId: string, contentId: string) => `${apiBaseUrl}/projects/${projectId}/content/${contentId}`,
            },
            orders: {
                // public url
                create: `${apiBaseUrl}/orders`,
                // private urls
                read: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/orders`,
                readById: (projectId: string, id: string) => `${apiBaseUrl}/projects/${projectId}/orders/${id}`,
                updateById: (projectId: string, id: string) => `${apiBaseUrl}/projects/${projectId}/orders/${id}`,
                deleteById: (projectId: string, id: string) => `${apiBaseUrl}/projects/${projectId}/orders/${id}`,
            },
            pages: {
                create: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/pages`,
                read: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/pages`,
                update: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/pages`,
                delete: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/pages`,
            },
            products: {
                create: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/products`,
                read: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/products`,
                readById: (projectId: string, id: string) => `${apiBaseUrl}/projects/${projectId}/products/${id}`,
                updateById: (projectId: string, id: string) => `${apiBaseUrl}/projects/${projectId}/products/${id}`,
                deleteById: (projectId: string, id: string) => `${apiBaseUrl}/projects/${projectId}/products/${id}`,
            },
            projects: {
                create: `${apiBaseUrl}/projects`,
                read: `${apiBaseUrl}/projects`,
                update: `${apiBaseUrl}/projects`,
                delete: `${apiBaseUrl}/projects`,
                upload: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/upload`,
                uploadMultipart: (projectId: string) => `${apiBaseUrl}/projects/${projectId}/upload-multipart`
            },
            payments: {
                accounts: {
                    create: `${apiBaseUrl}/payments/accounts`,
                    read: `${apiBaseUrl}/payments/accounts`,
                    readById: (accountId: string) => `${apiBaseUrl}/payments/accounts/${accountId}`,
                },
                accountsLink: {
                    create: `${apiBaseUrl}/payments/accounts/link`,
                },
                subscriptions: {
                    read: `${apiBaseUrl}/payments/subscriptions`,
                },
                // Public
                checkouts: {
                    create: {
                        stripe: `${apiBaseUrl}/payments/checkouts/stripe`,
                        mercadoPago: `${apiBaseUrl}/payments/checkouts/mercado-pago`,
                    }
                },
                // Public (specific to mercado pago)// TODO revise
                process: {
                    createLatam: `${apiBaseUrl}/payments/process/latam`,
                }
            },
            system: {
                users: {
                    read: `${apiBaseUrl}/system/users`,
                },
                projects: {
                    read: `${apiBaseUrl}/system/projects`,
                    readById: (projectId: string) => `${apiBaseUrl}/system/projects/${projectId}`,
                    updateUser: (projectId: string) => `${apiBaseUrl}/system/projects/${projectId}/user`,
                },
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
                pricingTableId: process.env.STRIPE_PRICING_TABLE_ID || "",
            },
            successUrl: `${window.location.origin}/settings?success=true`,
            cancelUrl: window.location.origin,
        }
    }
}

const env = createEnv()
export default env
