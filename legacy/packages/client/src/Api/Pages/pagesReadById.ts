import env from "../../env"
import { PageStruct } from "../../types"
import { requestController } from "../fetch"

export interface PagesReadByIdInput {
    token: string
    projectId: string
    pageId: string
}

export type PagesReadByIdOutput = PageStruct

const pagesReadById = async (
    {
        token,
        pageId,
        projectId,
    }: PagesReadByIdInput,
    url = env.api.pages.read,
    request = requestController.fetch,
): Promise<PagesReadByIdOutput> => {
    return request(`${url(projectId)}/${pageId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    }).then(response => response.json())
}

export {
    pagesReadById
}