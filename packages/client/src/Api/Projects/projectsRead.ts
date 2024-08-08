import env from "../../env"
import { ProjectStruct } from "../../types"
import { requestController } from "../fetch"

interface ProjectsReadInput {
    token: string
}

const projectsRead = async (
    {
        token
    }: ProjectsReadInput,
    url = env.api.projects.read,
    request = requestController.fetch,
): Promise<ProjectStruct[]> => {
    return request(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    }).then(response => response.json())
}

export {
    projectsRead
}
