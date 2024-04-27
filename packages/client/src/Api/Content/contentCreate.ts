import env from "../../env"

export interface ContentCreateInput {
    token: string
    projectId: string

    template: string
    data: Object
    categories: any[]
    description: string
}

export interface ContentCreateOutput {
    id: string
    projectId: string
    createdAt: string

    template: string
    data: string
    categories: string
    description: string
}

const contentCreate = async (
    {
        token,
        projectId,
        template,
        data,
        categories,
        description,
    }: ContentCreateInput,
    apiUrl = env.api.content.create,
    request = fetch,
): Promise<ContentCreateOutput> => {
    return request(apiUrl(projectId), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            template,
            data,
            categories,
            description,
        })
    }).then(response => response.json())
}

export {
    contentCreate
}