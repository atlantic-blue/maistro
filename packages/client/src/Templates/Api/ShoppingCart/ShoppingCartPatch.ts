interface ShoppingCartPatchInput {
    shoppingCartId: string,
    productId: string,
    quantity: number
}

interface ShoppingCartPatchOutput {
    data: {
        id?: string,
        createdAt?: string,
        items?: any[]
    },
    errors: Array<{
        description: string
    }>
}

export const shoppingCartPatch = async (input: ShoppingCartPatchInput): Promise<ShoppingCartPatchOutput> => {
    return await fetch(`https://api.maistro.website/payments/shopping-carts/${input.shoppingCartId}`, {
        method: "PATCH",
        body: JSON.stringify({
            items: [
                {
                    productId: input.productId,
                    quantity: input.quantity,
                }
            ]
        })
    }).then(response => {
        if (!response.ok) {
            return {
                data: {},
                errors: [
                    {
                        description: "Patch Unsuccessful",
                    }
                ]
            }
        }
        return {
            data: {},
            errors: []
        }
    })
}
