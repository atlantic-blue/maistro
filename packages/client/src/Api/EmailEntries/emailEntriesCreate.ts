import env from "../../env"
import { requestController } from "../fetch"

export interface EmailEntriesCreateInput {
    name: string,
    email: string
    emailListId: string,
}

export interface EmailEntriesCreateOutput { }

const emailEntriesCreate = async (
    input: EmailEntriesCreateInput,
    apiUrl = env.api.email.entries.create,
    request = requestController.fetch,
): Promise<EmailEntriesCreateOutput> => {
    return request(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: input.name,
            email: input.email,
            emailListId: input.emailListId,
        })
    }).then(response => response.json())
}

export {
    emailEntriesCreate
}