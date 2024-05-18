import env from "../../env"
import { requestController } from "../fetch"

export interface PaymentsAccountsLinkCreateInput {
    token: string

    accountId: string
}

export interface PaymentsAccountsLinkCreateOutput {
    accountLink: {
        object: "account_link",
        created: number,
        expires_at: number,
        url: string
    }
}

const paymentsAccountsLinkCreate = async (
    {
        token,

        accountId
    }: PaymentsAccountsLinkCreateInput,
    url = env.api.payments.accountsLink.create,
    request = requestController.fetch,
): Promise<PaymentsAccountsLinkCreateOutput> => {
    return request(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            accountId,
        })
    }).then(response => response.json())
}

export {
    paymentsAccountsLinkCreate
}