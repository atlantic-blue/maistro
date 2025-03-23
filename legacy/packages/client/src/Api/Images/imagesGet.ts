import env from "../../env"
import { PageStruct } from "../../types"
import { requestController } from "../fetch"

export interface ImagesGetInput {
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
        query,
        page,
        perPage,
    }: ImagesGetInput,
    url = env.api.images.get,
    request = requestController.fetch,
): Promise<ImagesGetOutput> => {
    const requestUrl = new URL(url)
    requestUrl.searchParams.set("query", query)
    requestUrl.searchParams.set("page", String(page))
    requestUrl.searchParams.set("perPage", String(perPage))

    return request(requestUrl.toString(), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(response => response.json())
}

export {
    imagesGet
}