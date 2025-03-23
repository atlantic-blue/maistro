import env from "../../env"
import { requestController } from "../fetch"

export interface ProjectUploadInput {
    token: string

    projectId: string
    fileContent: string
    fileName: string
    fileType: string
    path?: string
}

export interface ProjectUploadOutput {
    src: string
    message: string
}

const projectUpload = async (
    {
        token,
        projectId,
        fileType,
        fileName,
        fileContent,
        path,
    }: ProjectUploadInput,
    apiUrl = env.api.projects.upload,
    request = requestController.fetch,
): Promise<ProjectUploadOutput> => {
    const url = new URL(apiUrl(projectId))

    return request(url.toString(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            fileType,
            fileName,
            fileContent,
            path,
        })
    })
        .then(response => response.json())
        .then(response => {
            const baseUrl = env.hosting.baseUrl
            return {
                src: `${baseUrl}/${response.key}`,
                message: response.message,
            }
        })
}

export {
    projectUpload
}