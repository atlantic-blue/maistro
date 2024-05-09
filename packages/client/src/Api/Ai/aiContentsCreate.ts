import env from "../../env"
import { requestController } from "../fetch"

export interface AiContentsCreateInput {
    token: string
    projectId: string

    data: string
}

export interface AiContentsCreateOutput {
    output: string
    inputTokens: number
    outputTokens: number
}

const aiContentsCreate = async (
    {
        token,
        projectId,
        data,
    }: AiContentsCreateInput,
    apiUrl = env.api.ai.aiContents.create,
    request = requestController.fetch,
): Promise<AiContentsCreateOutput> => {
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
    aiContentsCreate
}