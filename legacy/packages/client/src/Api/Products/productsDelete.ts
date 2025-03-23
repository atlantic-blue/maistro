import env from "../../env"
import { requestController } from "../fetch"

export interface ProductsDeleteInput {
    projectId: string
    productId: string
    token: string
}

const productsDelete = async (
    {
        token,
        projectId,
        productId,
    }: ProductsDeleteInput,
    url = env.api.products.deleteById,
    request = requestController.fetch,
): Promise<void> => {
    return request(url(projectId, productId), {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({

        })
    }).then(response => response.json())
}

export {
    productsDelete
}