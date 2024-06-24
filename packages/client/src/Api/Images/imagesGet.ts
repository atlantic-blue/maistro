import env from "../../env"
import { PageStruct } from "../../types"
import { requestController } from "../fetch"

export interface ImagesGetInput {
    token: string
    query: string
    page: number
    perPage: number
}

export interface ImagePreview {
    urls: {
        raw: string
        full: string
        regular: string
        small: string
        thumb: string
        small_s3: string
    }
}

export type ImagesGetOutput = {
    total: number,
    totalPages: number,
    results: ImagePreview[],
}

const imagesGet = async (
    {
        token,
        query,
        page,
        perPage,
    }: ImagesGetInput,
    url = env.api.images.get,
    request = requestController.fetch,
): Promise<ImagesGetOutput> => {
    const params = new URLSearchParams()
    params.set("query", query)
    params.set("page", String(page))
    params.set("perPage", String(perPage))

    return request(`${url}?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    }).then(response => response.json())
}

export {
    imagesGet
}