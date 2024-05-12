import env from "../../env"
import { ProjectThreadStruct } from "../../types"
import { requestController } from "../fetch"

export interface AiThreadsReadInput {
    token: string
    projectId: string
}

export type AiThreadsReadOutput = ProjectThreadStruct[]

const aiThreadsRead = async (
    {
        token,
        projectId,
    }: AiThreadsReadInput,
    apiUrl = env.api.ai.aiThreads.read,
    request = requestController.fetch,
): Promise<AiThreadsReadOutput> => {
    return request(apiUrl(projectId), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    }).then(response => response.json())
}

export {
    aiThreadsRead
}