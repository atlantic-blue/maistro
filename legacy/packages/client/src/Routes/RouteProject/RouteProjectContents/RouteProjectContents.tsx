import { useNavigate, useParams } from "react-router-dom"
import { ProjectsContext } from "../../../Projects"
import React from "react"
import { Badge, Box, Button, Card, Flex, Heading, Inset, Text } from "@radix-ui/themes"
import Thumbnail from "../../../Components/Thumbnail/Thumbnail"
import ProjectContent from "../../../Store/ProjectContent"
import { ApiContext } from "../../../Api/ApiProvider"
import { PageMessageType, ProjectMessageType } from "../../../types"
import useObservable from "../../../Utils/Hooks/UseObservable"
import { filter } from "rxjs"
import { appRoutes } from "../../router"
import Helmet from "../Components/Helmet/Helmet"
import ErrorBoundary from "../../../Errors/ErrorBoundary"

const RouteProjectSettingsContent: React.FC = () => {
    const navigate = useNavigate();
    const { api } = React.useContext(ApiContext)
    const { projects, user } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")
    const [isLoading, setIsLoading] = React.useState(false)

    useObservable(project.event$.pipe(filter(event => (
        event.type === ProjectMessageType.SET_CONTENT ||
        event.type === ProjectMessageType.DELETE_CONTENT
    ))))

    if (!projectId || !project) {
        return null
    }

    const onDelete = async (content: ProjectContent) => {
        try {
            setIsLoading(true)
            // Check if content exists in pages
            const id = content.getId()
            project.getPagesMap().map(async page => {
                if (page.getContentIds().includes(id)) {
                    await api.pages.updateById({
                        projectId,
                        pageId: page.getId(),
                        token: user.getTokenId(),
                        contentIds: [
                            ...page.getContentIds()
                                .filter(contentId => contentId !== id)
                        ]
                    })

                    page.event$.next({
                        type: PageMessageType.DELETE_CONTENT_IDS,
                        data: [id]
                    })
                }
            })

            // Delete content
            await api.content.deleteById({
                projectId,
                contentId: content.getId(),
                token: user.getTokenId(),
            })

            project.event$.next({
                type: ProjectMessageType.DELETE_CONTENT,
                data: content.getId()
            })
        } catch (error) {
            // TODO app level error
        } finally {
            setIsLoading(false)
        }
    }

    const sections = Object.values(project.getContent()).map(content => {
        return (
            <Card
                key={content.getId()}
            >
                <Flex direction="column" align="center" justify="center" height="100%">
                    <Thumbnail {...{
                        dimensions: {
                            width: `200px`,
                            height: `120px`,
                            scale: 0.2,
                        }
                    }}>
                        <ErrorBoundary>
                            <content.Component {...content.getData()} />
                        </ErrorBoundary>
                    </Thumbnail>
                    <Heading
                        as="h4"
                        size="2"
                    >
                        {content.getTemplate().toLocaleLowerCase().replaceAll("_", " ")}
                    </Heading>
                    <Text as="p" style={{ fontSize: "12px" }} mb="2" size="1">
                        Created on {new Date(content.getCreatedAt()).toLocaleString()}
                    </Text>

                    <Text weight="bold" size="1">
                        Pages
                    </Text>
                    <Flex wrap="wrap" justify="center" align="center" gap="2" m="2">
                        {
                            project.getPagesMap().map(page => {
                                if (page.getContentIds().includes(content.getId())) {
                                    return (
                                        <Badge
                                            size="1"
                                            color="green"
                                            key={page.getId()}
                                            onClick={() => {
                                                navigate(
                                                    appRoutes.getProjectPageRoute(projectId, page.getId())
                                                )
                                            }}
                                        >{page.getTitle()}</Badge>
                                    )
                                }

                                return null
                            })
                        }
                    </Flex>

                    <Button
                        style={{ width: "200px", marginTop: "auto" }}
                        variant="outline"
                        size="1"
                        onClick={() => onDelete(content)}
                        loading={isLoading}
                    >
                        Delete
                    </Button>
                </Flex>
            </Card>
        )
    })

    return (
        <Helmet>

            <Box mt="5" mb="9">
                <Flex wrap="wrap" gap="2" justify="center" align="stretch">
                    {sections}
                </Flex>
            </Box>

        </Helmet>
    )
}

export default RouteProjectSettingsContent
