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
        if (!content) {
            return
        }

        const data = content?.getData()
        const templateName = content.getTemplate()
        const id = content.getId()
        hydrationState[`${templateName}:${id}`] = data
    })

    const Components = () => contentIds.map(contentId => {
        const content = project.getContentById(contentId)
        if (!content) {
            return null
        }

        return <content.Component />
    })

    const getContentStyles = () => contentIds.map(contentId => {
        const content = project.getContentById(contentId)
        if (!content) {
            return ""
        }

        const styles = content.getStylesFromClassNames()
        if (!styles) {
            return ""
        }
        return [...new Set(styles)].join("\n")
    })

    const Html = () => page.createHtml({
        state: hydrationState,
        theme: project.getTheme(),
        Body() {
            return renderToString(
                <Theme
                    accentColor={project.getTheme()?.accentColor}
                    grayColor={project.getTheme()?.grayColor}
                    appearance={project.getTheme()?.appearance}
                    radius={project.getTheme()?.radius}
                    scaling={project.getTheme()?.scaling}
                >
                    <Components />
                </Theme>
            )
        },
        Css: () => getContentStyles().join("\n"),
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
