import env from "../../env"
import { ProjectContentStruct } from "../../types"
import { requestController } from "../fetch"

export interface ContentReadInput {
    token: string
    projectId: string
}

export type ContentReadOutput = ProjectContentStruct[]

const contentRead = async (
    {
        token,
        projectId,
    }: ContentReadInput,
    url = env.api.content.read,
    request = requestController.fetch,
): Promise<ContentReadOutput> => {
    return request(url(projectId), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    }).then(response => response.json())
}

export {
    contentRead
}