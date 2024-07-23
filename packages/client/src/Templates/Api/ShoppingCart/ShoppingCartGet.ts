import { ShoppingCartStruct } from "../../types"

interface ShoppingCartGetInput {
    shoppingCartId: string
}

interface ShoppingCartGetOutput {
    data?: ShoppingCartStruct,
    errors?: Array<{ description: string }>
}

export const shoppingCartGet = async (input: ShoppingCartGetInput): Promise<ShoppingCartGetOutput> => {
    return await fetch(`https://api.maistro.website/payments/shopping-carts/${input.shoppingCartId}`, {
        method: "GET",
    })
        .then(response => response.json())
        .then((response: ShoppingCartStruct[]) => {
            if (!response) {
                return {
                    errors: [
                        {
                            description: "Unable to get shopping cart"
                        }
                    ]
                }
            }

            const cart = response.filter(r => r.id === input.shoppingCartId)[0]

            return {
                data: cart
            }
        })
        .catch(e => {
            return {
                errors: [
                    {
                        description: "Unable to get shopping cart"
                    }
                ]
            }
        })
}