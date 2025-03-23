import env from "../../env"
import { ProductStruct as OrderStruct } from "../../types"
import { requestController } from "../fetch"

export interface OrdersUpdateByIdInput extends OrderStruct {
    token: string
    projectId: string
    orderId: string
}

export interface OrdersUpdateByIdOutput extends OrderStruct {

}

const ordersUpdateById = async (
    {
        token,
        projectId,
        orderId,
    }: OrdersUpdateByIdInput,
    apiUrl = env.api.products.updateById,
    request = requestController.fetch,
): Promise<OrdersUpdateByIdOutput> => {
    return request(apiUrl(projectId, orderId), {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({

        })
    }).then(response => response.json())
}

export {
    ordersUpdateById
}