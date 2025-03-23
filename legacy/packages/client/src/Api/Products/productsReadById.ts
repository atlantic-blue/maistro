import env from "../../env"
import { ProductStruct } from "../../types"
import { requestController } from "../fetch"

export interface ProductsReadByIdInput {
    token: string
    projectId: string
    productId: string
}

const productsReadById = async (
    {
        projectId,
        productId,
        token
    }: ProductsReadByIdInput,
    url = env.api.products.readById,
    request = requestController.fetch,
): Promise<ProductStruct> => {
    return request(url(projectId, productId), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    }).then(response => response.json())
}

export {
    productsReadById
}