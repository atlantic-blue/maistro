import { renderToString } from 'react-dom/server';

import { Project } from "../../Store/Project";

import { postFile } from './postFile';
import env from "../../env"

interface PostProjectsInput {
    userId: string
    project: Project
}

const postProject = (
    { userId, project }: PostProjectsInput,
    url = env.api.upload,
    request = fetch
) => {
    const pages = project.getPages()

    return Promise.all(Object.values(pages).map(page => {
        return postFile(
            {
                userId,
                projectId: project.getId(),
                fileName: page.getPath(),
                fileContent: `<!DOCTYPE html>${renderToString(page.getHtml())}`,
                fileType: "text/html",
            },
            url,
            request
        )
    }))
}

export {
    postProject
}
