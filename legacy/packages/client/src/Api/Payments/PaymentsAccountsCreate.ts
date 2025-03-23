import env from "../../env"
import { requestController } from "../fetch"
import { ConnectedAccount } from "./PaymentsAccountsRead"

export interface PaymentsAccountsCreateInput {
    token: string
}

export interface PaymentsAccountsCreateOutput {
    account: ConnectedAccount
}

const paymentsAccountsCreate = async (
    {
        token
    }: PaymentsAccountsCreateInput,
    url = env.api.payments.accounts.create,
    request = requestController.fetch,
): Promise<PaymentsAccountsCreateOutput> => {
    return request(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    }).then(response => response.json())
}

export {
    paymentsAccountsCreate
}