import env from "../../env"
import { ProjectStruct } from "../../types"
import { requestController } from "../fetch"

export interface SystemProjectsUpdateUserInput {
    token: string
    projectId: string
    userId: string
}

export type SystemProjectsReadUpdateUserOutput = ProjectStruct

const systemProjectsUpdateUser = async (
    {
        token,
        projectId,
        userId,
    }: SystemProjectsUpdateUserInput,
    url = env.api.system.projects.updateUser,
    request = requestController.fetch,
): Promise<SystemProjectsReadUpdateUserOutput> => {
    const requestUrl = new URL(url(projectId))
    console.log({ token, projectId, userId }, requestUrl.toString())
    return request(requestUrl.toString(), {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            userId
        })
    }).then(response => response.json())
}

export {
    systemProjectsUpdateUser
}
