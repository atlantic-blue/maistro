import { TemplateCategory, TemplateComponentType } from "../../Templates/templateTypes"
import env from "../../env"
import { requestController } from "../fetch"

export interface ContentCreateInput {
    token: string
    projectId: string

    data: Object
    template: TemplateComponentType
    categories: TemplateCategory[]
    description: string
}

export interface ContentCreateOutput {
    id: string
    projectId: string
    createdAt: string

    data: string
    template: TemplateComponentType
    categories: TemplateCategory[]
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
    request = requestController.fetch,
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