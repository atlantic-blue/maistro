import { renderToString } from 'react-dom/server';

import { Project } from "../../Store/Project";

import { postFile } from './postFile';
import env from "../../env"
import { withExtension } from '../../Utils/url';
import React from 'react';
import PageStore from '../../Store/Page';

interface PostProjectsInput {
    userId: string
    project: Project
    page: PageStore
}

const postPage = (
    {
        userId,
        project,
        page
    }: PostProjectsInput,
    url = env.api.upload,
    request = fetch
) => {
    const contentIds = page.getContentIds()

    const Components = () => contentIds.map(contentId => {
        const content = project.getContentById(contentId)
        return <content.Component />
    })

    const Styles = () => contentIds.map(contentId => {
        const content = project.getContentById(contentId)
        const styles = content.getStylesFromClassNames()
        if (!styles) {
            return null
        }

        return (
            <style>
                {content.getStylesFromClassNames()}
            </style>
        )
    })

    const Html = () => page.createHtml({
        Body() {
            return <Components />
        },
        Css() {
            return <Styles />
        },
    })

    const htmlString = renderToString(<Html />)

    return postFile(
        {
            userId,
            projectId: project.getId(),
            fileName: withExtension(page.getPath(), ".html"),
            fileContent: `<!DOCTYPE html>${htmlString}`,
            fileType: "text/html",
        },
        url,
        request
    )
}

export {
    postPage
}
