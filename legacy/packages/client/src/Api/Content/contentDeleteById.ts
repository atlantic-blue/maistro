import env from "../../env"
import { requestController } from "../fetch"

export interface ContentDeleteByIdInput {
    projectId: string
    contentId: string
    token: string
}

const contentDeleteById = async (
    {
        projectId,
        contentId,
        token,
    }: ContentDeleteByIdInput,
    apiUrl = env.api.content.deleteById,
    request = requestController.fetch,
): Promise<void> => {
    return request(apiUrl(projectId, contentId), {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({})
    }).then(response => response.json())
}

export {
    contentDeleteById
}