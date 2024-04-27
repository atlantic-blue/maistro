import env from "../../env"
import { ProjectContentStruct } from "../../types"

export interface ContentReadByIdInput {
    token: string
    projectId: string
    pageId: string
}

export type ContentReadByIdOutput = ProjectContentStruct

const contentReadById = async (
    {
        token,
        pageId,
        projectId,
    }: ContentReadByIdInput,
    url = env.api.content.read,
    request = fetch,
): Promise<ContentReadByIdOutput> => {
    return request(`${url(projectId)}/${pageId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    }).then(response => response.json())
}

export {
    contentReadById
}