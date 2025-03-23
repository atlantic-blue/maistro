import { ProductStruct } from "../../types"

interface ProductsGetInput {
    projectId: string
}

interface ShoppingCartGetOutput {
    data?: ProductStruct[],
    errors?: Array<{ description: string }>
}

export const productsGet = async (input: ProductsGetInput): Promise<ShoppingCartGetOutput> => {
    return await fetch(`https://api.maistro.website/v1/projects/${input.projectId}/products`, {
        method: "GET",
    })
        .then(response => response.json())
        .then((response: ProductStruct[]) => {
            if (response && Array.isArray(response)) {
                return {
                    data: response
                }
            }

            return {
                errors: [
                    {
                        description: "Unable to get products"
                    }
                ]
            }
        })
        .catch(e => {
            return {
                errors: [
                    {
                        description: "Unable to get products"
                    }
                ]
            }
        })
}
