import env from "../../env"
import { requestController } from "../fetch"
import { AiTemplatesReadByIdOutput } from "./aiTemplatesReadById"

export interface AiTemplatesReadInput {
}

export type AiTemplatesReadOutput = AiTemplatesReadByIdOutput[]

const aiTemplatesRead = async (
    { }: AiTemplatesReadInput,
    apiUrl = env.api.ai.aiTemplates.read,
    request = requestController.fetch,
): Promise<AiTemplatesReadOutput> => {
    return request(apiUrl(), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }).then(response => response.json())
}

export {
    aiTemplatesRead
}