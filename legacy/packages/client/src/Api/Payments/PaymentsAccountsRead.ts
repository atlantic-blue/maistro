import env from "../../env"
import { requestController } from "../fetch"

export interface PaymentsAccountsReadInput {
    token: string
}

export interface ConnectedAccount {
    createdAt: number
    email: string
    id: string
    userId: string
}

export type PaymentsAccountsReadOutput = ConnectedAccount[]

const paymentsAccountsRead = async (
    {
        token
    }: PaymentsAccountsReadInput,
    url = env.api.payments.accounts.read,
    request = requestController.fetch,
): Promise<PaymentsAccountsReadOutput> => {
    return request(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    }).then(response => response.json())
}

export {
    paymentsAccountsRead
}