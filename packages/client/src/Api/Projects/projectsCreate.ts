import env from "../../env"
import { requestController } from "../fetch"

interface ProjectsCreateInput {
    name: string
    url: string
    token: string
}

interface ProjectsCreateOutput {
    id: string
    url: string
    name: string
}

const projectsCreate = async (
    {
        token,
        name,
        url,
    }: ProjectsCreateInput,
    apiUrl = env.api.projects.create,
    request = requestController.fetch,
): Promise<ProjectsCreateOutput> => {
    return request(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            name,
            url
        })
    }).then(response => response.json())
}

export {
    projectsCreate
}