import env from "../../env"
import { ProjectThreadMessage } from "../../types"
import { requestController } from "../fetch"

export interface AiThreadsCreateInput {
    token: string
    projectId: string

    name: string
    messages: ProjectThreadMessage[]
}

export interface AiThreadsCreateOutput {
    id: string
    projectId: string
    createdAt: string

    name: string
    messages: ProjectThreadMessage[]
}

const aiThreadsCreate = async (
    {
        token,
        projectId,

        name,
        messages,
    }: AiThreadsCreateInput,
    apiUrl = env.api.ai.aiThreads.create,
    request = requestController.fetch,
): Promise<AiThreadsCreateOutput> => {
    return request(apiUrl(projectId), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            name,
            messages,
        })
    }).then(response => response.json())
}

export {
    aiThreadsCreate
}