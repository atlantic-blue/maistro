import env from '../../env';

interface PostFileInput {
    userId: string,
    projectId: string,
    fileName: string,
    fileContent: string,
    fileType: string
}

const postFile = (
    {
        userId,
        projectId,
        fileName,
        fileContent,
        fileType,
    }: PostFileInput,
    url = env.api.upload,
    request = fetch,
): Promise<{ key: string, message: string }> => {
    return request(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId,
            projectId,
            fileName,
            fileContent,
            fileType,
        })
    }).then(response => response.json())
}

export {
    postFile
}
