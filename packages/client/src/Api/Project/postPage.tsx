import { renderToString } from 'react-dom/server';

import { Project } from "../../Store/Project";

import { postFile } from './postFile';
import env from "../../env"
import { withExtension } from '../../Utils/url';
import React from 'react';
import PageStore from '../../Store/Page';
import { Theme } from '@radix-ui/themes';

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

    const hydrationState: Record<string, Object | undefined> = {}
    contentIds.forEach(contentId => {
        const content = project.getContentById(contentId)
        const data = content.getData()
        const templateName = content.getTemplateName()
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

    return postFile(
        {
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
