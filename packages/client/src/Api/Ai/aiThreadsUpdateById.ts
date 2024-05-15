import env from "../../env"
import { ProjectThreadMessage } from "../../types"
import { requestController } from "../fetch"

export interface AiThreadsUpdateByIdInput {
    token: string
    projectId: string
    threadId: string
    messages: ProjectThreadMessage[]

    stateless?: boolean
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
        stateless,

        messages,
    }: AiThreadsUpdateByIdInput,
    apiUrl = env.api.ai.aiThreads.updateById,
    request = requestController.fetch,
): Promise<AiThreadsUpdateByIdOutput> => {
    const params = new URLSearchParams()
    params.append("stateless", stateless ? "true" : "false");

    return request(`${apiUrl(projectId, threadId)}?${params.toString()}`, {
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