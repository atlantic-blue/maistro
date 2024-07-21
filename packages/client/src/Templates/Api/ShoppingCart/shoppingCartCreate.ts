interface ShoppingCartCreateInput {
    projectId: string
}

interface ShoppingCartCreateOutput {
    data: {
        id?: string,
        createdAt?: string,
        items?: any[]
    },
    errors: Array<{
        description: string
    }>
}

export const shoppingCartCreate = async (input: ShoppingCartCreateInput): Promise<ShoppingCartCreateOutput> => {
    return await fetch("https://api.maistro.website/payments/shopping-carts", {
        method: "POST",
        body: JSON.stringify({
            projectId: input.projectId,
        })
    })
        .then(response => {
            if (!response.ok) {
                return {
                    data: {},
                    errors: [
                        {
                            description: "unable to create shopping cart"
                        }
                    ]
                }
            }
            return response.json()
        })
        .then(response => {
            if (response && response.id) {
                return {
                    data: {
                        id: response.id,
                        createdAt: response.createdAt,
                        items: response.items || []
                    },
                    errors: []
                }
            }
            return {
                data: {},
                errors: [
                    {
                        description: "shopping cart id not found"
                    }
                ]
            }
        })
        .catch(e => {
            return {
                data: {},
                errors: [
                    {
                        description: "unable to create shopping cart"
                    }
                ]
            }
        })
}
