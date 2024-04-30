import { Project } from "../../Store/Project";

import { postPage } from './postPage';
import env from "../../env"
import { requestController } from "../fetch";

interface PostProjectsInput {
    token: string
    userId: string
    project: Project
}

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
        Object.values(pages).map(page => {
            return postPage({
                token,
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
