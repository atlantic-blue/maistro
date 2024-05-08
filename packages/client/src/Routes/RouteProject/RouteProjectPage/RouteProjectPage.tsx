import React from "react"
import { Navigate, useParams } from 'react-router-dom';

import Helmet from "../Components/Helmet/Helmet"
import IconNew from "../../../Components/Icons/New/New";
import { PageMessageType, ProjectMessageType } from "../../../types";
import PageEdit from "../../../Page";

import { ProjectsContext } from "../../../Projects";

import useObservable from "../../../Utils/Hooks/UseObservable";
import { filter } from "rxjs/operators";
import { Button, Dialog, Flex, IconButton, Section, Spinner } from "@radix-ui/themes";
import SearchItem from "../../../Components/SearchItem/SearchItem";
import { templates } from "../../../Templates";
import { ApiContext } from "../../../Api/ApiProvider";

import * as styles from "./RouteProjectPage.scss"
import DragAndDrop from "../../../Components/DragDrop/DragDrop";
import { appRoutes } from "../../router";
import IconClose from "../../../Components/Icons/Close/Close";
import Loading from "../../../Components/Loading/Loading";
import { TemplateStruct } from "../../../Templates/templateTypes";
import env from "../../../env";

const RouteProjectPage: React.FC = () => {
    const { api } = React.useContext(ApiContext)
    const { projects, user } = React.useContext(ProjectsContext)
    const { projectId, pageId } = useParams()
    const [open, setOpen] = React.useState(false);

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
            <Loading>
                Loading Project...
            </Loading>
        )
    }

    const page = project.getPageById(pageId || "")

    if (!page) {
        return (
            <Navigate to={appRoutes.getProjectRoute(projectId)} />
        )
    }

    const onTemplateClick = async (template: TemplateStruct) => {
        setIsLoading(true)

        try {
            let data = template.props
            if (template.name.includes("SectionSubscribe")) {
                const emailListId = Object.values(project.getEmailLists())[0]?.getId()
                data = {
                    ...template.props,
                    url: env.api.email.entries.create,
                    emailListId,
                }
            }

            const response = await api.content.create({
                token: user.getTokenId(),
                projectId: projectId,
                template: template.name,
                categories: template.categories,
                description: template.description,
                data,
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
            setOpen(false)
        }
    }

    const onAddContentClick = () => {
        setOpen(prev => !prev)
    }

    return (
        <Helmet>
            <PageEdit
                page={page}
            >
                <div className={styles.main}>
                    <DragAndDrop />

                    <Dialog.Root open={open} onOpenChange={setOpen}>
                        <Dialog.Trigger>
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
                        </Dialog.Trigger>

                        <Dialog.Content maxWidth="800px">
                            <Flex>
                                <Dialog.Close>
                                    <IconButton size="1" variant="soft" color="gray" style={{ marginLeft: "auto" }}>
                                        <IconClose style={{ width: "10px" }} />
                                    </IconButton>
                                </Dialog.Close>
                            </Flex>
                            <Dialog.Title>Add Content</Dialog.Title>

                            <Flex direction="column" gap="3" align="center" justify="center">
                                {isLoading ? (
                                    <Spinner />
                                ) : (
                                    <SearchItem
                                        templates={Object.values(templates)}
                                        onClick={onTemplateClick}
                                    />
                                )}
                            </Flex>
                        </Dialog.Content>
                    </Dialog.Root>
                </div>

            </PageEdit>
        </Helmet>
    )
}

export default RouteProjectPage
