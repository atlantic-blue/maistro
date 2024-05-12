import env from "../../env"
import { ProjectThreadMessage } from "../../types"
import { requestController } from "../fetch"

export interface AiThreadsReadByIdInput {
    token: string
    projectId: string
    threadId: string
}

export interface AiThreadsReadByIdOutput {
    messages: ProjectThreadMessage[]
    name: string,
    createdAt: string
}

const aiThreadsReadById = async (
    {
        token,
        projectId,
        threadId,
    }: AiThreadsReadByIdInput,
    apiUrl = env.api.ai.aiThreads.readById,
    request = requestController.fetch,
): Promise<AiThreadsReadByIdOutput> => {
    return request(apiUrl(projectId, threadId), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    }).then(response => response.json())
}

export {
    aiThreadsReadById
}