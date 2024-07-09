import env from "../../env"
import { ProductStruct } from "../../types"
import { requestController } from "../fetch"

export interface Product {
    name: string
    description: string
    price: number
    priceDecimal: string
    stockQuantity: number
    currency: string
    images: string[]
    options: Record<string, string[]>
}

export interface ProductsUpdateByIdInput extends Product {
    token: string
    projectId: string
    productId: string
}

export interface ProductsUpdateByIdOutput extends ProductStruct {

}

const productsUpdateById = async (
    {
        token,
        projectId,
        productId,

        name,
        stockQuantity,
        priceDecimal,
        price,
        options,
        images,
        description,
        currency,
    }: ProductsUpdateByIdInput,
    apiUrl = env.api.products.updateById,
    request = requestController.fetch,
): Promise<ProductsUpdateByIdOutput> => {
    return request(apiUrl(projectId, productId), {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            name,
            description,
            price,
            priceDecimal,
            currency,
            stockQuantity,
            options,
            images,
        })
    }).then(response => response.json())
}

export {
    productsUpdateById
}