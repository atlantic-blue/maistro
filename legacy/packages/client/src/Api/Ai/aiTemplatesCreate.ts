import env from "../../env"
import { ProjectThreadMessage } from "../../types"
import { requestController } from "../fetch"

export interface AiTemplatesCreateInput {
    messages: ProjectThreadMessage[]
}

export interface AiTemplatesCreateOutput {
    createdAt: string,
    id: string,
    data: ProjectThreadMessage
}

const aiTemplatesCreate = async (
    {
        messages,
    }: AiTemplatesCreateInput,
    apiUrl = env.api.ai.aiTemplates.create,
    request = requestController.fetch,
): Promise<AiTemplatesCreateOutput> => {
    return request(apiUrl(), {
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
    aiTemplatesCreate
}