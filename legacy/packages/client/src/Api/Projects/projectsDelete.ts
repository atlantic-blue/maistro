import env from "../../env"
import { requestController } from "../fetch"

interface ProjectsDeleteInput {
    id: string
    token: string
}

const projectsDelete = async (
    {
        token,
        id
    }: ProjectsDeleteInput,
    url = env.api.projects.delete,
    request = requestController.fetch,
): Promise<void> => {
    return request(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            id
        })
    }).then(response => response.json())
}

export {
    projectsDelete
}