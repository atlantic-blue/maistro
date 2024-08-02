import React from "react"
import { CirclePlus } from "lucide-react";
import { Navigate, useParams } from 'react-router-dom';

import Helmet from "../Components/Helmet/Helmet"
import { PageMessageType, ProjectMessageType } from "../../../types";

import { ProjectsContext } from "../../../Projects";

import useObservable from "../../../Utils/Hooks/UseObservable";
import { filter } from "rxjs/operators";
import { Box, Button, Card, Dialog, Flex, IconButton, Spinner, Tabs, Text } from "@radix-ui/themes";
import { ApiContext } from "../../../Api/ApiProvider";

import * as styles from "./RouteProjectPage.scss"
import DragAndDrop from "../../../Components/DragDrop/DragDrop";
import { appRoutes } from "../../router";
import IconClose from "../../../Components/Icons/Close/Close";
import Loading from "../../../Components/Loading/Loading";
import { TemplateComponentType, TemplateStruct } from "../../../Templates/templateTypes";
import env from "../../../env";
import SectionFlow from "./Components/SectionFlow/SectionFlow";
import SectionCustom from "./Components/SectionFlow/SectionCustom";
import ProjectContent from "../../../Store/ProjectContent";
import PageNavigationDropdown from "./PageNavigationDropdown/PageNavigationDropdown";
import Menu from "../Components/Menu/Menu";

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

    const onContentClick = async (content: ProjectContent) => {
        try {
            setIsLoading(true)
            project.event$.next({
                type: ProjectMessageType.SET_CONTENT,
                data: {
                    ...content.getStruct()
                },
            })

            page.event$.next({
                type: PageMessageType.PUSH_CONTENT_IDS,
                data: [content.getId()]
            })

            setProgressUpdate("Updating page...")
            await api.pages.updateById({
                projectId,
                pageId: page.getId(),
                token: user.getTokenId(),
                contentIds: [...page.getContentIds(), content.getId()]
            })
        } catch (error) {
            // TODO app level message
            console.error(error)
        } finally {
            setIsLoading(false)
            setOpen(false)
        }
    }

    const onTemplateClick = async (template: TemplateStruct<{}>) => {
        setIsLoading(true)
        setProgressUpdate("Creating Template...")
        try {
            let data = template.props

            // TODO HACK
            // intercepts template props to add compulsory data
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

            if (
                [
                    TemplateComponentType.CHECKOUT_STRIPE,
                ].includes(template.name)
            ) {
                data = {
                    ...template.props,
                    projectId,
                    checkoutUrl: env.api.payments.checkouts.create,
                }
            }

            if (
                [
                    TemplateComponentType.SHOPPING_CART_BASIC,
                    TemplateComponentType.CHECKOUT_STRIPE,
                    TemplateComponentType.CHECKOUT_MERCADO_PAGO,
                ].includes(template.name)
            ) {
                data = {
                    ...template.props,
                    projectId,
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
            <PageNavigationDropdown />

            <div className={styles.main}>
                <div className={styles.dragDrop}>
                    <DragAndDrop />
                </div>

                <Dialog.Root open={open} onOpenChange={setOpen}>
                    <Dialog.Trigger>
                        <Card className={styles.section} onClick={onAddContentClick}>
                            <Button
                                size="4"
                                variant="ghost"
                                title="Add a section"
                            >
                                <Flex direction="column" justify="center" align="center">
                                    <CirclePlus />
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

                        {isLoading ? (
                            <Flex direction="column" align="center" justify="center" gap="2">
                                <Spinner />
                                <Text>
                                    {progressUpdate}
                                </Text>
                            </Flex>
                        ) : (
                            <Tabs.Root defaultValue="templates">
                                <Tabs.List size="2" style={{ display: "flex", justifyContent: "center" }}>

                                    <Tabs.Trigger value="templates">Templates</Tabs.Trigger>
                                    <Tabs.Trigger value="custom">Custom</Tabs.Trigger>

                                </Tabs.List>

                                <Box pt="3">
                                    <Tabs.Content value="templates">
                                        <SectionFlow onTemplateClick={onTemplateClick} />
                                    </Tabs.Content>

                                    <Tabs.Content value="custom">
                                        <SectionCustom onClick={onContentClick} />
                                    </Tabs.Content>
                                </Box>
                            </Tabs.Root>
                        )}
                    </Dialog.Content>
                </Dialog.Root>
            </div>

            <Menu />
        </Helmet>
    )
}

export default RouteProjectPage
