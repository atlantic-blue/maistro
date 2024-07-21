import { IShoppingCart } from "../../types"

interface ShoppingCartUpdateInput {
    shoppingCartId: string,
    items: Array<{
        quantity: number,
        productId: string
    }>
}

interface ShoppingCartUpdateOutput {
    data?: IShoppingCart,
    errors?: Array<{ description: string }>
}

export const shoppingCartUpdate = async (
    input: ShoppingCartUpdateInput
): Promise<ShoppingCartUpdateOutput> => {
    return await fetch(`https://api.maistro.website/payments/shopping-carts/${input.shoppingCartId}`, {
        method: "PUT",
        body: JSON.stringify({
            items: input.items
        })
    })
        .then(response => response.json())
        .then((response: IShoppingCart) => {
            if (response && response.id) {
                return {
                    data: {
                        id: response.id || "",
                        createdAt: response.createdAt || "",
                        items: response.items || [],
                    },
                    errors: [
                        {
                            description: "unable to update cart"
                        }
                    ]
                }
            }

            return {
                data: {
                    id: response.id || "",
                    createdAt: response.createdAt || "",
                    items: response.items || [],
                },
                errors: [
                    {
                        description: "unable to update cart"
                    }
                ]
            }
        })
        .catch(e => {
            return {
                errors: [
                    {
                        description: "unable to update cart"
                    }
                ]
            }
        })
}