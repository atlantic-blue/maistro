import { renderToString } from 'react-dom/server';

import PageStore from '../../Store/Page';

interface PostPageInput {
    userId: string,
    projectId: string,
    page: PageStore
}

const postPage = ({
    userId,
    projectId,
    page,
}: PostPageInput, url: string, request = fetch) => {
    return request(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            metadata: {
                userId: userId,
                projectId: projectId,
                pageName: page.getPath(),
            },
            html: renderToString(page.getHtml())
        })
    })
}

export {
    postPage
}
