import { Project } from "../../Store/Project";

import { postPage } from './postPage';
import env from "../../env"
import { requestController } from "../fetch";
import { projectUpload } from "./projectUpload";
import postSitemap from "./postSitemap";

interface PostProjectsInput {
    token: string
    userId: string
    project: Project
}

const robotsFile = () => `
User-agent: *
Disallow: /admin/
Disallow: /private/
Allow: /

Sitemap: https://www.example.com/sitemap.xml
`

const postProject = (
    {
        token,
        userId,
        project,
    }: PostProjectsInput,
    url = env.api.file.create,
    request = requestController.fetch
) => {
    const pages = project.getPages()

    return Promise.all(
        [
            ...Object.values(pages)
                .map(page => {
                    return postPage({
                        token,
                        userId,
                        project,
                        page
                    }, url, request)
                }),
            ...postSitemap({
                token,
                project,
            }, url, request)
        ]
    )
}

export {
    postProject
}
