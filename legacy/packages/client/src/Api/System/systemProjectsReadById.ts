import env from "../../env"
import { ProjectStruct } from "../../types"
import { requestController } from "../fetch"

export interface SystemProjectsReadByIdInput {
    token: string
    projectId: string
}

export type SystemProjectsReadByIdOutput = ProjectStruct

const systemProjectsReadById = async (
    {
        token,
        projectId
    }: SystemProjectsReadByIdInput,
    url = env.api.system.projects.readById,
    request = requestController.fetch,
): Promise<SystemProjectsReadByIdOutput> => {
    const requestUrl = new URL(url(projectId))
    return request(requestUrl.toString(), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    }).then(response => response.json())
}

export {
    systemProjectsReadById
}
