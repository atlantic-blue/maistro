import sanitiseInput from "../../Utils/sanitiseInput"
import env from "../../env"

export interface PagesUpdateByIdInput {
    projectId: string
    pageId: string
    token: string

    title?: string
    path?: string
    colourScheme?: string
    contentIds?: string[]
    description?: string
    fontScheme?: string
}

const pagesUpdateById = async (
    {
        projectId,
        pageId,
        token,
        ...payload
    }: PagesUpdateByIdInput,
    apiUrl = env.api.pages.update,
    request = fetch,
): Promise<void> => {
    return request(`${apiUrl(projectId)}/${pageId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(sanitiseInput(payload))
    }).then(response => response.json())
}

export {
    pagesUpdateById
}