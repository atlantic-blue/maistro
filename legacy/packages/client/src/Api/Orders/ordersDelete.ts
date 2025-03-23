import env from "../../env"
import { requestController } from "../fetch"

export interface OrdersDeleteInput {
    projectId: string
    orderId: string
    token: string
}

const ordersDelete = async (
    {
        token,
        projectId,
        orderId,
    }: OrdersDeleteInput,
    url = env.api.orders.deleteById,
    request = requestController.fetch,
): Promise<void> => {
    return request(url(projectId, orderId), {
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
    ordersDelete
}