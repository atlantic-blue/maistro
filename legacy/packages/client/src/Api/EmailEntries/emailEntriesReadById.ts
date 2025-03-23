import env from "../../env"
import { requestController } from "../fetch"

export interface EmailEntriesReadInput {
    token: string
    emailListId: string
}

interface EmailEntry {
    id: string,
    name: string,
    email: string,
    createdAt: string
}

export interface EmailEntriesReadOutput {
    totalCount: number
    data: EmailEntry[]
}

const emailEntriesReadById = async (
    input: EmailEntriesReadInput,
    apiUrl = env.api.email.entries.read,
    request = requestController.fetch,
): Promise<EmailEntriesReadOutput> => {
    return request(`${apiUrl}/${input.emailListId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${input.token}`,
        },
    }).then(response => response.json())
}

export {
    emailEntriesReadById
}