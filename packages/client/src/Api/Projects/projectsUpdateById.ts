import env from "../../env"
import { ProjectTheme } from "../../types"
import { requestController } from "../fetch"

export interface ProjectsReadInput {
    projectId: string
    token: string
    name: string
    url: string
    theme: ProjectTheme
}

const projectsUpdateById = async (
    {
        projectId,
        token,

        name,
        url,
        theme,

    }: ProjectsReadInput,
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
            theme
        })
    }).then(response => response.json())
}

export {
    projectsUpdateById
}