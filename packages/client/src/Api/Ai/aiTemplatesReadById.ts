import env from "../../env"
import { ProjectThreadMessage } from "../../types"
import { requestController } from "../fetch"

export interface AiTemplatesReadByIdInput {
    templateId: string
}

export interface AiTemplatesReadByIdOutput {
    createdAt: string,
    id: string,
    data: ProjectThreadMessage
}

const aiTemplatesReadById = async (
    {
        templateId,
    }: AiTemplatesReadByIdInput,
    apiUrl = env.api.ai.aiTemplates.readById,
    request = requestController.fetch,
): Promise<AiTemplatesReadByIdOutput> => {
    return request(apiUrl(templateId), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }).then(response => response.json())
}

export {
    aiTemplatesReadById
}