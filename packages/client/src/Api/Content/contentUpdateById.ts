import sanitiseInput from "../../Utils/sanitiseInput"
import env from "../../env"

export interface ContentUpdateByIdInput {
    projectId: string
    contentId: string
    token: string

    template?: string
    data?: Object
    categories?: any[]
    description?: string
}

const contentUpdateById = async (
    {
        projectId,
        contentId,
        token,
        ...payload
    }: ContentUpdateByIdInput,
    apiUrl = env.api.content.update,
    request = fetch,
): Promise<void> => {
    return request(`${apiUrl(projectId)}/${contentId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(sanitiseInput(payload))
    }).then(response => response.json())
}

export {
    contentUpdateById
}