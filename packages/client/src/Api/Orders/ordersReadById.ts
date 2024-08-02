import env from "../../env"
import { OrderStruct } from "../../types"
import { requestController } from "../fetch"

export interface OrdersReadByIdInput {
    token: string
    projectId: string
    orderId: string
}

const ordersReadById = async (
    {
        projectId,
        orderId,
        token
    }: OrdersReadByIdInput,
    url = env.api.orders.readById,
    request = requestController.fetch,
): Promise<OrderStruct> => {
    return request(url(projectId, orderId), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    }).then(response => response.json())
}

export {
    ordersReadById
}