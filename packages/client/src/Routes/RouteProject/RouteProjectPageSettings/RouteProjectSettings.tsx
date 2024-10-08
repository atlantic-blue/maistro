import React from "react"
import { Button, Card, Flex, Heading, TextField, Text } from "@radix-ui/themes";
import { Navigate, useParams } from "react-router-dom"

import { ProjectsContext } from "../../../Projects";
import Helmet from "../Components/Helmet/Helmet";

import PageNavigationDropdown from "../RouteProjectPage/PageNavigationDropdown/PageNavigationDropdown";
import Menu from "../Components/Menu/Menu";
import Loading from "../../../Components/Loading/Loading";
import { appRoutes } from "../../router";
import { PageMessageType, PageStruct } from "../../../types";
import useObservable from "../../../Utils/Hooks/UseObservable";
import { filter } from "rxjs";
import { ApiContext } from "../../../Api/ApiProvider";
import * as styles from "./RouteProjectSettings.scss"

const PageSettings: React.FC = () => {
    const { api } = React.useContext(ApiContext)
    const { projects, user } = React.useContext(ProjectsContext)
    const { projectId, pageId } = useParams()
    const project = projects.getProjectById(projectId || "")
    const page = project.getPageById(pageId || "")
    const [loading, setIsLoading] = React.useState(false)

    const [state, setState] = React.useState<PageStruct>(page.getStruct())

    useObservable(page.event$.pipe(filter(event => {
        return event.type === PageMessageType.SET
    })))

    if (!page) {
        return null
    }

    const onUpdate = async () => {
        try {
            setIsLoading(true)
            await api.pages.updateById({
                token: user.getTokenId(),
                projectId: project.getId(),
                pageId: page.getId(),
                contentIds: page.getContentIds(),

                title: state.title,
                description: state.description,
                path: state.path,
                keywords: state.keywords,
            })

            page.event$.next({
                type: PageMessageType.SET,
                data: state
            })
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    const onDelete = async () => {

    }

    return (
        <Card>

            <Card size="1" mb="3">
                <div className={styles.seoViewer}>
                    <div className={styles.seoViewerTitle}>{state.title}</div>
                    <div className={styles.seoViewerUrl}>https://{project.getUrl()}/{state.path === "index" ? "" : state.path}</div>
                    <div className={styles.seoViewerDescription}>{state.description}</div>
                </div>
            </Card>

            <Card size="1" mb="3">
                <Flex align="center" justify="center">
                    <div className={styles.openGraph}>
                        <img src={project.getLogo()} alt={page.getTitle()} className={styles.openGraphSection} loading="lazy" />
                        <div className={styles.openGraphSection}>
                            <div className={styles.openGraphSectionTitle}>{state.title}</div>
                            <div className={styles.openGraphSectionDescription}>{state.description}</div>
                            <div className={styles.openGraphSectionUrl}>https://{project.getUrl()}/{state.path === "index" ? "" : state.path}</div>
                        </div>
                    </div>
                </Flex>
            </Card>

            <Flex direction="column" gap="2" mb="2">
                <Text weight="bold">
                    Title
                </Text>
                <TextField.Root
                    value={state.title}
                    onChange={e => {
                        setState(prev => {
                            return {
                                ...prev,
                                title: e.target.value
                            }
                        })
                    }}
                />
            </Flex>

            <Flex direction="column" gap="2" mb="2">
                <Text weight="bold">
                    URL
                </Text>
                <TextField.Root
                    value={state.path}
                    onChange={e => {
                        setState(prev => {
                            return {
                                ...prev,
                                path: e.target.value
                            }
                        })
                    }}
                />
            </Flex>

            <Flex direction="column" gap="2" mb="2">
                <Text weight="bold">
                    Description
                </Text>
                <TextField.Root
                    value={state.description}
                    onChange={e => {
                        setState(prev => {
                            return {
                                ...prev,
                                description: e.target.value
                            }
                        })
                    }}
                />
            </Flex>


            <Flex direction="column" gap="2" mb="2">
                <Text weight="bold">
                    Key words
                </Text>
                <TextField.Root
                    value={state.keywords}
                    onChange={e => {
                        setState(prev => {
                            return {
                                ...prev,
                                keywords: e.target.value
                            }
                        })
                    }}
                />
            </Flex>

            <Flex direction="column" m="auto" mt="2">
                <Button onClick={onUpdate} loading={loading}>
                    Update
                </Button>
            </Flex>
        </Card>
    )
}

const RouteProjectPageSettings: React.FC = () => {
    const { projects } = React.useContext(ProjectsContext)
    const { projectId, pageId } = useParams()
    const project = projects.getProjectById(projectId || "")

    if (!project) {
        return
    }

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

    return (
        <Helmet>
            <PageNavigationDropdown />

            <br />
            <Heading size="4" as="h3" align="center">
                Page Settings
            </Heading>
            <br />


            <Flex direction="column" maxWidth="800px" m="auto" mb="50px">
                <PageSettings />
            </Flex>

            <Menu />
        </Helmet>
    )
}

export default RouteProjectPageSettings
