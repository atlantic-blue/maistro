import sanitiseInput from "../../Utils/sanitiseInput"
import env from "../../env"

export interface PagesCreateInput {
    token: string
    projectId: string

    title: string
    path: string
    description: string
    contentIds?: string[]
}

export interface PagesCreateOutput {
    id: string
    projectId: string
    title: string
    path: string
    description: string
    createdAt: string
}

const pagesCreate = async (
    {
        token,
        projectId,
        title,
        path,
        description,
        contentIds,
    }: PagesCreateInput,
    apiUrl = env.api.pages.create,
    request = fetch,
): Promise<PagesCreateOutput> => {
    return request(apiUrl(projectId), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(sanitiseInput({
            title,
            path,
            description,
            contentIds,
        }))
    }).then(response => response.json())
}

export {
    pagesCreate
}