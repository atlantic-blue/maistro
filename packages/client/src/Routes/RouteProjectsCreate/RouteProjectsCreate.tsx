import React from "react"
import { useNavigate } from "react-router-dom"
import * as Form from "@radix-ui/react-form"
import { Button, Flex, Section, TextArea, TextField, Text, Card } from "@radix-ui/themes"

import { ProjectsContext } from "../../Projects"
import RouteProjectHeader from "../RouteProject/Components/Header/Header"

import { PaymentsContext } from '../../Payments/PaymentsProvider';
import { ApiContext } from "../../Api/ApiProvider"
import { createUrl } from "../../Utils/url"
import { Project } from "../../Store/Project"
import { ProjectsMessageType } from "../../types"
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
        api.projects.create({
            token: user.getTokenId(),
            name: projectName,
            url: createUrl(projectName)
        }).then(({ id, name, url }) => {
            const newProject = Project.createEmptyProject(id, name, url)
            projects.event$.next({
                type: ProjectsMessageType.SET_PROJECT,
                data: newProject.getStruct()
            })

            navigate(appRoutes.getProjectRoute(id))
        }).finally(() => {
            setIsLoading(false)
        })
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
