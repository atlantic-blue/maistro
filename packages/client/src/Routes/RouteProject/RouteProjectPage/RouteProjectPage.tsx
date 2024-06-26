import React from "react"
import { Navigate, useParams } from 'react-router-dom';

import Helmet from "../Components/Helmet/Helmet"
import IconNew from "../../../Components/Icons/New/New";
import { PageMessageType, ProjectMessageType } from "../../../types";

import { ProjectsContext } from "../../../Projects";

import useObservable from "../../../Utils/Hooks/UseObservable";
import { filter } from "rxjs/operators";
import { Button, Card, Dialog, Flex, IconButton, Section, Spinner, Text } from "@radix-ui/themes";
import SearchItem from "../../../Components/SearchItem/SearchItem";
import { templates } from "../../../Templates";
import { ApiContext } from "../../../Api/ApiProvider";

import * as styles from "./RouteProjectPage.scss"
import DragAndDrop from "../../../Components/DragDrop/DragDrop";
import { appRoutes } from "../../router";
import IconClose from "../../../Components/Icons/Close/Close";
import Loading from "../../../Components/Loading/Loading";
import { TemplateComponentType, TemplateStruct } from "../../../Templates/templateTypes";
import env from "../../../env";
import SectionFlow from "./Components/SectionFlow/SectionFlow";

const RouteProjectPage: React.FC = () => {
    const { api } = React.useContext(ApiContext)
    const { projects, user } = React.useContext(ProjectsContext)
    const { projectId, pageId } = useParams()
    const [open, setOpen] = React.useState(false);

    const project = projects.getProjectById(projectId || "")
    const [isLoading, setIsLoading] = React.useState(false)
    const [progressUpdate, setProgressUpdate] = React.useState("")

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
        setProgressUpdate("Creating Template...")
        try {
            let data = template.props

            if (
                [
                    TemplateComponentType.SUBSCRIBE_BASIC,
                    TemplateComponentType.HERO_SUBSCRIBE,
                ].includes(template.name)
            ) {
                let emailListId = Object.values(project.getEmailLists())[0]?.getId()
                if (!emailListId) {
                    setProgressUpdate("Creating Mailing list...")
                    await api.email.lists.create({
                        token: user.getTokenId(),
                        title: project.getName(),
                        description: page.getDescription(),
                        projectId: project.getId(),
                    }).then(emailListResponse => {
                        setProgressUpdate("Creating mailing list...")
                        emailListId = emailListResponse.id
                        project.event$.next({
                            type: ProjectMessageType.SET_EMAIL_LIST,
                            data: {
                                createdAt: emailListResponse.createdAt,
                                title: emailListResponse.title,
                                status: emailListResponse.status,
                                projectId: emailListResponse.projectId,
                                id: emailListResponse.id,
                                description: emailListResponse.description
                            }
                        })
                    })
                }

                data = {
                    ...template.props,
                    url: env.api.email.entries.create,
                    emailListId,
                }

                let successPage = project.getPageByPathname("success")
                if (!successPage) {
                    setProgressUpdate("Creating Success page...")
                    await api.pages.create({
                        token: user.getTokenId(),
                        path: 'success',
                        title: project.getName(),
                        description: page.getDescription(),
                        projectId: project.getId(),
                        contentIds: [],
                    }).then(pageResponse => {
                        setProgressUpdate("Success page created...")
                        project.event$.next({
                            type: ProjectMessageType.SET_PAGE,
                            data: {
                                id: pageResponse.id,
                                projectId: pageResponse.projectId,
                                path: pageResponse.path,
                                title: pageResponse.title,
                                description: pageResponse.description,
                                contentIds: [],
                            },
                        })
                    })
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

            setProgressUpdate("Updating page...")
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
            <div className={styles.main}>
                <div className={styles.dragDrop}>
                    <DragAndDrop />
                </div>

                <Dialog.Root open={open} onOpenChange={setOpen}>
                    <Dialog.Trigger>
                        <Card className={styles.section} onClick={onAddContentClick}>
                            <Button
                                className={styles.sectionButton}
                            >
                                <Flex direction="column" justify="center" align="center">
                                    <IconNew className={styles.sectionImage} />
                                    <Text as="div" className={styles.sectionContent}>
                                        Add a section
                                    </Text>
                                </Flex>
                            </Button>
                        </Card>
                    </Dialog.Trigger>

                    <Dialog.Content maxWidth="880px">
                        <Flex>
                            <Dialog.Close>
                                <IconButton size="1" variant="soft" color="gray" style={{ marginLeft: "auto" }}>
                                    <IconClose style={{ width: "10px" }} />
                                </IconButton>
                            </Dialog.Close>
                        </Flex>
                        <Dialog.Title align="center">Add a section</Dialog.Title>

                        {isLoading ? (
                            <Flex direction="column" align="center" justify="center" gap="2">
                                <Spinner />
                                <Text>
                                    {progressUpdate}
                                </Text>
                            </Flex>
                        ) : (
                            <SectionFlow onTemplateClick={onTemplateClick} />
                        )}
                    </Dialog.Content>
                </Dialog.Root>
            </div>
        </Helmet>
    )
}

export default RouteProjectPage
