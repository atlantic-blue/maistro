import { renderToString } from 'react-dom/server';

import env from '../../env';
import PageStore from '../../Store/Page';

interface PostFileInput {
    userId: string,
    projectId: string,
    fileName: string,
    fileContent: string,
}

const postFile = ({
    userId,
    projectId,
    fileName,
    fileContent,
}: PostFileInput,
    url = env.api.upload,
    request = fetch) => {
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
        })
    })
}

export {
    postFile
}
