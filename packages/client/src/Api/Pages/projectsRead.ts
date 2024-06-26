import env from "../../env"
import { PageStruct } from "../../types"
import { requestController } from "../fetch"

export interface PagesReadInput {
    token: string
    projectId: string
}

export type PagesReadOutput = PageStruct[]

const pagesRead = async (
    {
        token,
        projectId,
    }: PagesReadInput,
    url = env.api.pages.read,
    request = requestController.fetch,
): Promise<PagesReadOutput> => {
    return request(url(projectId), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    }).then(response => response.json())
}

export {
    pagesRead
}