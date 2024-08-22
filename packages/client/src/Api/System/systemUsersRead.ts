import env from "../../env"
import { ProjectStruct } from "../../types"
import { requestController } from "../fetch"

export interface SystemUsersReadInput {
    token: string
    limit?: number
    page?: string
    search?: string
}

export interface SystemUser {
    Attributes: {
        Name: string
        Value: string
    }[]
    UserCreateDate: string
    UserLastModifiedDate: string
    Username: string
}

export interface SystemUsersReadOutput {
    users: SystemUser[]
    page: string
}

const systemUsersRead = async (
    {
        token,
        limit,
        page,
        search,
    }: SystemUsersReadInput,
    url = env.api.system.users.read,
    request = requestController.fetch,
): Promise<SystemUsersReadOutput> => {
    const requestUrl = new URL(url)
    if (limit) {
        requestUrl.searchParams.set("limit", String(limit))
    }
    if (page) {
        requestUrl.searchParams.set("page", String(page))
    }
    if (search) {
        requestUrl.searchParams.set("search", String(search))
    }

    return request(requestUrl.toString(), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    }).then(response => response.json())
}

export {
    systemUsersRead
}
