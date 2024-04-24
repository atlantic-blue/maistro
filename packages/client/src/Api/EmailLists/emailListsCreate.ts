import env from "../../env"

import { ProjectEmailListStruct } from "../../types"

export interface EmailListsCreateInput {
    token: string
    projectId: string
    title: string
    description: string
}

export type EmailListsCreateOutput = ProjectEmailListStruct

const emailListsCreate = async (
    {
        token,
        projectId,
        title,
        description,
    }: EmailListsCreateInput,
    apiUrl = env.api.email.lists.create,
    request = fetch,
): Promise<EmailListsCreateOutput> => {
    return request(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            projectId,
            title,
            description
        })
    }).then(response => response.json())
}

export {
    emailListsCreate
}