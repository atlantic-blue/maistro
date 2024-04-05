import { Project } from "../../Store/Project";

import { postPage } from './postPage';

const postProjects = (userId: string, project: Project) => {
    const pages = project.getPages()

    return Promise.all(Object.values(pages).map(page => {
        return postPage(
            {
                userId,
                projectId: project.getId(),
                page
            }, ""
        )
    }))
}

export {
    postProjects
}
