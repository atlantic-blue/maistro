import React from 'react';
import { renderToString } from 'react-dom/server';
import { Theme } from '@radix-ui/themes';

import { Project } from "../../Store/Project";

import { fileCreate } from '../File/fileCreate';
import { withExtension } from '../../Utils/url';
import PageStore from '../../Store/Page';
import env from "../../env"
import { requestController } from '../fetch';

interface PostProjectsInput {
    token: string
    userId: string
    project: Project
    page: PageStore
}

const postPage = (
    {
        token,
        userId,
        project,
        page
    }: PostProjectsInput,
    url = env.api.file.create,
    request = requestController.fetch
) => {
    const contentIds = page.getContentIds()

    const hydrationState: Record<string, Object | undefined> = {}
    contentIds.forEach(contentId => {
        const content = project.getContentById(contentId)
        const data = content.getData()
        const templateName = content.getTemplate()
        const id = content.getId()
        hydrationState[`${templateName}:${id}`] = data
    })

    const Components = () => contentIds.map(contentId => {
        const content = project.getContentById(contentId)
        return <content.Component />
    })

    const Css = () => contentIds.map(contentId => {
        const content = project.getContentById(contentId)
        const styles = content.getStylesFromClassNames()
        if (!styles) {
            return ""
        }

        return content.getStylesFromClassNames().join("\n")
    })

    const Html = () => page.createHtml({
        state: hydrationState,
        Body() {
            return renderToString(
                <Theme accentColor="amber" grayColor="mauve">
                    <Components />
                </Theme>
            )
        },
        Css,
    })

    return fileCreate(
        {
            token,
            userId,
            projectId: project.getId(),
            fileName: withExtension(page.getPath(), ".html"),
            fileContent: Html(),
            fileType: "text/html",
        },
        url,
        request
    )
}

export {
    postPage
}
