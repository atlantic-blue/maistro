import env from '../../env';
import { requestController } from '../fetch';

export interface CreateFileInput {
    token: string,
    userId: string,
    projectId: string,
    fileName: string,
    fileContent: string,
    fileType: string
}

export interface CreateFileOutput {
    src: string
    message: string
}

const fileCreate = (
    {
        token,
        userId,
        projectId,

        fileName,
        fileContent,
        fileType,
    }: CreateFileInput,
    url = env.api.file.create,
    request = requestController.fetch,
): Promise<CreateFileOutput> => {
    return request(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            userId,
            projectId,
            fileName,
            fileContent,
            fileType,
        })
    }).then(response => response.json())
        .then(response => {
            const baseUrl = env.hosting.baseUrl
            return {
                src: `${baseUrl}/${response.key}`,
                message: response.message,
            }
        })
}

export {
    fileCreate
}
