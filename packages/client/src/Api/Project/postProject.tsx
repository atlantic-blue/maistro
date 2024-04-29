import { Project } from "../../Store/Project";

import { postPage } from './postPage';
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

    return Promise.all(
        Object.values(pages).map(page => {
            return postPage({
                userId,
                project,
                page
            }, url, request)
        })
    )
}

export {
    postProject
}
