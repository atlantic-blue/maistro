import env from "../../env"
import { ProjectThreadMessage } from "../../types"
import { requestController } from "../fetch"

export interface AiComponentsCreateInput {
    projectId: string

    messages: ProjectThreadMessage[]
}

export interface AiComponentsCreateOutput {
    createdAt: string,
    id: string,
    data: ProjectThreadMessage
}

const aiComponentsCreate = async (
    {
        projectId,
        messages,
    }: AiComponentsCreateInput,
    apiUrl = env.api.ai.aiComponents.create,
    request = requestController.fetch,
): Promise<AiComponentsCreateOutput> => {
    return request(apiUrl(projectId), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messages,
        })
    }).then(response => response?.json())
}

export {
    aiComponentsCreate
}