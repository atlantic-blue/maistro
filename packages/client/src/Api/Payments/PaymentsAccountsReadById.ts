import env from "../../env"
import { requestController } from "../fetch"

export interface PaymentsAccountsReadByIdInput {
    token: string
    accountId: string
}

interface ConnectedAccount {
    createdAt: number
    email: string
    id: string
    userId: string
}

export type PaymentsAccountsReadByIdOutput = ConnectedAccount[]

const paymentsAccountsReadById = async (
    {
        token,
        accountId,
    }: PaymentsAccountsReadByIdInput,
    url = env.api.payments.accounts.readById,
    request = requestController.fetch,
): Promise<PaymentsAccountsReadByIdOutput> => {
    return request(url(accountId), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    }).then(response => response.json())
}

export {
    paymentsAccountsReadById
}