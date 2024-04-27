import { renderToString } from 'react-dom/server';

import { Project } from "../../Store/Project";

import { postFile } from './postFile';
import env from "../../env"
import { withExtension } from '../../Utils/url';
import React from 'react';
import { postPage } from './postPage';

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
