import env from "../../env"
import { ProjectThreadMessage } from "../../types"
import { requestController } from "../fetch"

export interface AiThreadsUpdateByIdInput {
    token: string
    projectId: string
    threadId: string

    messages: ProjectThreadMessage[]
}

export interface AiThreadsUpdateByIdOutput {
    message: ProjectThreadMessage
    inputTokens: number
    outputTokens: number
}

const aiThreadsUpdateById = async (
    {
        token,
        projectId,
        threadId,

        messages,
    }: AiThreadsUpdateByIdInput,
    apiUrl = env.api.ai.aiThreads.updateById,
    request = requestController.fetch,
): Promise<AiThreadsUpdateByIdOutput> => {
    return request(apiUrl(projectId, threadId), {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            messages,
        })
    }).then(response => response.json())
}

export {
    aiThreadsUpdateById
}