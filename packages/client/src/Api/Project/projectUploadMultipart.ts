import env from "../../env"
import { requestController } from "../fetch"

export interface ProjectUploadMultipartInput {
    token: string

    projectId: string
    fileContent: string
    fileName: string
    fileType: string
}

export interface ProjectUploadMultipartOutput {
    key: string
    message: string
}

const projectUploadMultipart = async (
    {
        token,
        projectId,
        fileName,
    }: ProjectUploadMultipartInput,
    apiUrl = env.api.projects.uploadMultipart,
    request = requestController.fetch,
): Promise<ProjectUploadMultipartOutput> => {
    const url = new URL(apiUrl(projectId))

    return request(url.toString(), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            fileName,
        })
    }).then(response => response.json())
}

export {
    projectUploadMultipart
}