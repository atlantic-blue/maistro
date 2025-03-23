import { Order, ProductStruct } from "../../types"

interface OrderGetByIdInput {
    orderId: string
}

interface OrdersGetByIdOutput {
    data?: Order,
    errors?: Array<{ description: string }>
}

export const ordersGetById = async (input: OrderGetByIdInput): Promise<OrdersGetByIdOutput> => {
    return await fetch(`https://api.maistro.website/v1/orders/${input.orderId}`, {
        method: "GET",
    })
        .then(response => response.json())
        .then((response: Order[]) => {
            if (response && Array.isArray(response)) {
                return {
                    data: response.find(o => o.id === input.orderId)
                }
            }

            return {
                errors: [
                    {
                        description: "Unable to get products"
                    }
                ]
            }
        })
        .catch(e => {
            return {
                errors: [
                    {
                        description: "Unable to get products"
                    }
                ]
            }
        })
}
