import env from "../../env"
import { requestController } from "../fetch"

export interface AiImagesCreateInput {
    token: string
    projectId: string

    data: string
}

export interface AiImagesCreateOutput {
    src: string
    totalImages: number
}

const aiImagesCreate = async (
    {
        token,
        projectId,
        data,
    }: AiImagesCreateInput,
    apiUrl = env.api.ai.aiImages.create,
    request = requestController.fetch,
): Promise<AiImagesCreateOutput> => {
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
    aiImagesCreate
}