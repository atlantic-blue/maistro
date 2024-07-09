import env from "../../env"
import { ProductStruct } from "../../types"
import { requestController } from "../fetch"

export interface Product {
    name: string
    description: string
    price: number
    priceDecimal?: string
    stockQuantity: number
    currency: string
    images: string[]
    options: Record<string, string[]>
}

export interface ProductsCreateInput extends Product {
    token: string
    projectId: string
}

export interface ProductsCreateOutput extends ProductStruct {

}

const productsCreate = async (
    {
        token,
        projectId,

        name,
        stockQuantity,
        priceDecimal,
        price,
        options,
        images,
        description,
        currency,
    }: ProductsCreateInput,
    apiUrl = env.api.products.create,
    request = requestController.fetch,
): Promise<ProductsCreateOutput> => {
    return request(apiUrl(projectId), {
        method: "POST",
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
    productsCreate
}