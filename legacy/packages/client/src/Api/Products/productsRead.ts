import env from "../../env"
import { ProductStruct } from "../../types"
import { requestController } from "../fetch"

export interface ProductsReadInput {
    projectId: string
    token: string
}

const productsRead = async (
    {
        projectId,
        token
    }: ProductsReadInput,
    url = env.api.products.read,
    request = requestController.fetch,
): Promise<ProductStruct[]> => {
    return request(url(projectId), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    }).then(response => response.json())
}

export {
    productsRead
}