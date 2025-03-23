import env from "../../env"
import { OrderStruct } from "../../types"
import { requestController } from "../fetch"

export interface OrdersReadInput {
    token: string
    projectId: string
}

const ordersRead = async (
    {
        token,
        projectId,
    }: OrdersReadInput,
    url = env.api.orders.read,
    request = requestController.fetch,
): Promise<OrderStruct[]> => {
    return request(url(projectId), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    }).then(response => response.json())
}

export {
    ordersRead
}