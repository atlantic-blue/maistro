import env from "../../env"
import { ProjectStruct } from "../../types"
import { requestController } from "../fetch"

interface ProjectsReadInput {
    projectId: string
    token: string
}

const projectsReadById = async (
    {
        projectId,
        token
    }: ProjectsReadInput,
    url = env.api.projects.read,
    request = requestController.fetch,
): Promise<ProjectStruct> => {
    return request(`${url}/${projectId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    }).then(response => response.json())
}

export {
    projectsReadById
}