import env from "../../../env"
import { requestController } from "../../fetch"

export interface PaymentsSubscriptionsReadInput {
    token: string
}

export interface PaymentsSubscriptionsReadOutput {
    subscription: {
        id: string,
        created: number,
        currency: string,
        customer: string,
        status: string,
        plan: {
            product: string,
        }
    }
}

const paymentsSubscriptionsRead = async (
    {
        token
    }: PaymentsSubscriptionsReadInput,
    url = env.api.payments.subscriptions.read,
    request = requestController.fetch,
): Promise<PaymentsSubscriptionsReadOutput> => {
    return request(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    }).then(response => response.json())
}

export {
    paymentsSubscriptionsRead
}