import env from "../../../env"
import { requestController } from "../../fetch"

interface PaymentsSubscriptionsReadInput {
    token: string
}

const paymentsSubscriptionsRead = async (
    {
        token
    }: PaymentsSubscriptionsReadInput,
    url = env.api.payments.subscriptions.read,
    request = requestController.fetch,
): Promise<{ subscription: { status: string } }> => {
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