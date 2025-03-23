import env from "../../env"
import { ProjectContentStruct } from "../../types"
import { requestController } from "../fetch"

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
    request = requestController.fetch,
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