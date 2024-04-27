import React from "react"
import { Navigate, useParams } from 'react-router-dom';

import Helmet from "../Components/Helmet/Helmet"
import IconNew from "../../../Components/Icons/New/New";
import { PageMessageType, ProjectMessageType, TemplateStruct } from "../../../types";
import PageEdit from "../../../Page";

import { ProjectsContext } from "../../../Projects";

import useObservable from "../../../Utils/Hooks/UseObservable";
import { filter } from "rxjs/operators";
import { Box, Button, Progress, Section } from "@radix-ui/themes";
import EditMenuItem from "../../../Components/EditMenuItem/EditMenuItem";
import SearchItem from "../../../Components/SearchItem/SearchItem";
import { GetTemplates, templates } from "../../../Components/Gallery";
import { ApiContext } from "../../../Api/ApiProvider";

import * as styles from "./RouteProjectPage.scss"
import DragAndDrop from "../../../Components/DragDrop/DragDrop";
import { appRoutes } from "../../router";

const RouteProjectPage: React.FC = () => {
    const { api } = React.useContext(ApiContext)
    const { projects, user } = React.useContext(ProjectsContext)
    const { projectId, pageId } = useParams()
    const [showMenu, setShowMenu] = React.useState(false)
    const project = projects.getProjectById(projectId || "")
    const [isLoading, setIsLoading] = React.useState(false)

    // Rerender every time a new page or content is set
    useObservable(project?.event$?.pipe(
        filter(e => {
            return (
                (
                    e.type === ProjectMessageType.SET_PAGE &&
                    e.data.projectId === pageId
                ) ||
                (
                    e.type === ProjectMessageType.SET_CONTENT &&
                    e.data.projectId === projectId
                )
            )
        })
    ))

    // Rerender every time a content is shuffled
    useObservable(project?.getPageById(pageId)?.event$?.pipe(
        filter(e => {
            return (
                (
                    e.type === PageMessageType.SET_CONTENT_IDS
                )
            )
        })
    ))

    if (!project || !projectId) {
        return (
            <div>Loading Project...</div>
        )
    }

    const page = project.getPageById(pageId || "")

    if (!page) {
        return (
            <Navigate to={appRoutes.getProjectRoute(projectId)} />
        )
    }

    const onTemplateClick = async (template: TemplateStruct) => {
        setShowMenu(false)
        setIsLoading(true)
        try {
            const response = await api.content.create({
                token: user.getTokenId(),
                projectId: projectId,
                template: template.name,
                categories: template.categories,
                description: template.description,
                data: template.props,
            })

            project.event$.next({
                type: ProjectMessageType.SET_CONTENT,
                data: {
                    id: response.id,
                    description: response.description,
                    template: response.template,
                    projectId: response.projectId,
                    createdAt: response.createdAt,
                    data: response.data,
                    categories: response.categories,
                },
            })

            page.event$.next({
                type: PageMessageType.PUSH_CONTENT_IDS,
                data: [response.id]
            })

            // TODO include in save button
            await api.pages.updateById({
                projectId,
                pageId: page.getId(),
                token: user.getTokenId(),
                contentIds: [...page.getContentIds(), response.id]
            })
        } catch (error) {
            // TODO app level message
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const onAddContentClick = () => {
        setShowMenu(prev => !prev)
    }

    return (
        <Helmet>
            <PageEdit
                page={page}
            >
                <div className={styles.main}>
                    <DragAndDrop />

                    <Section className={styles.section} onClick={onAddContentClick}>
                        <div className={styles.sectionContent}>
                            Add content
                        </div>
                        <Button
                            className={styles.sectionButton}
                        >
                            <IconNew className={styles.sectionImage} />
                        </Button>
                    </Section>
                </div>

                <EditMenuItem title="Content" show={showMenu}>
                    <SearchItem
                        templates={Object.values(templates)}
                        onClick={onTemplateClick}
                    />
                </EditMenuItem>
            </PageEdit>
        </Helmet>
    )
}

export default RouteProjectPage
