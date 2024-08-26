import { Currency } from "../../Utils/currency"
import env from "../../env"
import { ProjectTheme } from "../../types"
import { requestController } from "../fetch"

export interface ProjectsUpdateInput {
    projectId: string
    token: string
    name: string
    url: string
    theme: ProjectTheme
    currency: Currency
    logo: string
    email: string
}

const projectsUpdateById = async (
    {
        projectId,
        token,

        name,
        url,
        theme,
        currency,
        logo,
        email,
    }: ProjectsUpdateInput,
    apiUrl = env.api.projects.update,
    request = requestController.fetch,
): Promise<void> => {
    return request(`${apiUrl}/${projectId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            name,
            url,
            theme,
            currency,
            logo,
            email,
        })
    }).then(response => response.json())
}

export {
    projectsUpdateById
}