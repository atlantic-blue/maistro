import { Currency } from "../../Utils/currency"
import env from "../../env"
import { ProductModifierStruct, ProductStruct } from "../../types"
import { requestController } from "../fetch"

export interface Product {
    name: string
    description: string
    price: number
    stockQuantity: number
    currency: Currency
    images: string[]
    options: Record<string, string[]>
    modifiers: ProductModifierStruct[]
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
        modifiers,
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
            modifiers,
        })
    }).then(response => response.json())
}

export {
    productsUpdateById
}