import React from "react"
import { useNavigate } from "react-router-dom"
import * as Form from "@radix-ui/react-form"
import { Button, Flex, TextArea, TextField, Text, Card } from "@radix-ui/themes"

import { ProjectsContext } from "../../Projects"
import RouteProjectHeader from "../RouteProject/Components/Header/Header"

import { PaymentsContext } from '../../Payments/PaymentsProvider';
import { ApiContext } from "../../Api/ApiProvider"
import { createUrl } from "../../Utils/url"
import { Project } from "../../Store/Project"
import { ProjectMessageType, ProjectsMessageType } from "../../types"
import { appRoutes } from "../router"
import * as styles from "./RouteProjectsCreate.scss"

const RouteProjectsCreate: React.FC = () => {
    const navigate = useNavigate();
    const { api } = React.useContext(ApiContext)
    const { projects, user } = React.useContext(ProjectsContext)
    const { isSubscribed, redirectToCheckout } = React.useContext(PaymentsContext)
    const [projectName, setProjectName] = React.useState("")
    const [projectDescription, setProjectDescription] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)

    const onNewProjectSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        if (!isSubscribed) {
            return redirectToCheckout()
        }

        setIsLoading(true)
        const projectResponse = await api.projects.create({
            token: user.getTokenId(),
            name: projectName,
            url: createUrl(projectName)
        })

        const newProject = Project.createEmptyProject(
            projectResponse.id,
            projectResponse.name,
            projectResponse.url
        )

        projects.event$.next({
            type: ProjectsMessageType.SET_PROJECT,
            data: newProject.getStruct()
        })

        const project = projects.getProjectById(projectResponse.id)

        const promises = () => [
            api.pages.create({
                token: user.getTokenId(),
                title: projectName,
                path: 'index',
                description: projectDescription,
                projectId: projectResponse.id,
                contentIds: [],
            }).then(pageResponse => {
                project.event$.next({
                    type: ProjectMessageType.SET_PAGE,
                    data: {
                        id: pageResponse.id,
                        projectId: pageResponse.projectId,
                        path: pageResponse.path,
                        title: pageResponse.title,
                        description: pageResponse.description,
                        contentIds: [],
                        // TODO
                        colourScheme: {},
                        fontScheme: {}
                    },
                })
                return pageResponse
            }),
            api.pages.create({
                token: user.getTokenId(),
                title: projectName,
                path: 'success',
                description: projectDescription,
                projectId: projectResponse.id,
                contentIds: [],
            }).then(pageResponse => {
                project.event$.next({
                    type: ProjectMessageType.SET_PAGE,
                    data: {
                        id: pageResponse.id,
                        projectId: pageResponse.projectId,
                        path: pageResponse.path,
                        title: pageResponse.title,
                        description: pageResponse.description,
                        contentIds: [],
                        // TODO
                        colourScheme: {},
                        fontScheme: {}
                    },
                })
                return pageResponse
            }),

            api.email.lists.create({
                token: user.getTokenId(),
                title: projectName,
                description: projectDescription,
                projectId: projectResponse.id,
            }).then(emailListResponse => {
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
                return emailListResponse
            })
        ]

        const [indexPageResponse] = await Promise.all(promises())

        navigate(appRoutes.getProjectPageRoute(projectResponse.id, indexPageResponse.id))
        setIsLoading(false)
    }

    return (
        <div className={styles.main}>
            <RouteProjectHeader />
            <Card className={styles.card}>
                <Form.Root onSubmit={onNewProjectSubmit}>
                    <Flex gap="3" direction="column">
                        <Form.Field name="projectName">
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                                <Text
                                    className={styles.title}
                                >
                                    Project Name
                                </Text>
                                <Form.Message match="valueMissing" className={styles.errorMessage}>
                                    Please provide a name
                                </Form.Message>
                            </div>
                            <Form.Control asChild>
                                <TextField.Root
                                    type="text"
                                    size="2"
                                    variant="surface"
                                    value={projectName}
                                    onChange={e => setProjectName(e.target.value)}
                                    className={styles.input}
                                    required
                                />
                            </Form.Control>
                        </Form.Field>
                        <Form.Field name="description">
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                                <Form.Message match="valueMissing" className={styles.errorMessage}>
                                    Please provide a project description
                                </Form.Message>
                            </div>
                            <Form.Control asChild>
                                <TextArea
                                    value={projectDescription}
                                    onChange={e => setProjectDescription(e.target.value)}
                                    placeholder="What is this project about?"
                                    className={styles.textarea}
                                    required
                                />
                            </Form.Control>
                        </Form.Field>
                        <Form.Submit asChild>
                            <Button
                                style={{ marginTop: 10 }}
                                loading={isLoading}
                            >
                                Create Project
                            </Button>
                        </Form.Submit>
                    </Flex>
                </Form.Root>
            </Card>
        </div>
    )
}

export default RouteProjectsCreate
