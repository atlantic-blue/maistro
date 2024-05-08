import env from "../../env"
import { requestController } from "../fetch"

export interface AiContentCreateInput {
    token: string
    projectId: string

    data: string
}

export interface AiContentCreateOutput {
    output: string
    inputTokens: number
    outputTokens: number
}

const aiContentCreate = async (
    {
        token,
        projectId,
        data,
    }: AiContentCreateInput,
    apiUrl = env.api.aiContent.create,
    request = requestController.fetch,
): Promise<AiContentCreateOutput> => {
    return request(apiUrl(projectId), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            data,
        })
    }).then(response => response.json())
}

export {
    aiContentCreate
}