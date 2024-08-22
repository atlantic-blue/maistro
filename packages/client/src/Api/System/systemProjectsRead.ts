import env from "../../env"
import { ProjectStruct } from "../../types"
import { requestController } from "../fetch"

export interface SystemProjectsReadInput {
    token: string
    userId: string
}

export type SystemProjectsReadOutput = ProjectStruct[]

const systemProjectsRead = async (
    {
        token,
        userId
    }: SystemProjectsReadInput,
    url = env.api.system.projects.read,
    request = requestController.fetch,
): Promise<SystemProjectsReadOutput> => {
    const requestUrl = new URL(url)
    requestUrl.searchParams.set("user-id", String(userId))

    return request(requestUrl.toString(), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    }).then(response => response.json())
}

export {
    systemProjectsRead
}
