import env from "../../env"

import { ProjectEmailListStruct } from "../../types"
import { requestController } from "../fetch"

export interface EmailListsReadInput {
    token: string
}

export type EmailListsReadOutput = ProjectEmailListStruct[]

const emailListsRead = async (
    {
        token
    }: EmailListsReadInput,
    url = env.api.email.lists.read,
    request = requestController.fetch,
): Promise<EmailListsReadOutput> => {
    return request(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    }).then(response => response.json())
}

export {
    emailListsRead
}