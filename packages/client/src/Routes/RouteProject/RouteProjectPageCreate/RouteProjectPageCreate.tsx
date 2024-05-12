import React from "react";
import { useNavigate, useParams } from 'react-router-dom'
import { filter } from "rxjs/operators";
import { Card, Flex, TextField, Text, Section, Button, Box } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form"

import Helmet from "../Components/Helmet/Helmet";
import { ProjectMessageType } from "../../../types";
import { ProjectsContext } from "../../../Projects";

import { appRoutes } from "../../router";
import { PaymentsContext } from "../../../Payments/PaymentsProvider";
import { ApiContext } from "../../../Api/ApiProvider";

import useObservable from "../../../Utils/Hooks/UseObservable";
import * as styles from "./RouteProjectPageCreate.scss"

const RouteProjectCreate: React.FC = () => {
    const navigate = useNavigate();
    const { api } = React.useContext(ApiContext)
    const { isSubscribed, redirectToCheckout } = React.useContext(PaymentsContext)

    const { projects, user } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState("")

    const [pagePath, setPagePath] = React.useState("")

    // Rerender every time a new page is set
    useObservable(project?.event$?.pipe(filter(e => {
        return (
            e.type === ProjectMessageType.SET_PAGE &&
            e.data.projectId === projectId
        )
    })))

    if (!project || !projectId) {
        return
    }

    const onCreateNewPage: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()

        if (!pagePath) {
            return setError("add a page url")
        }

        if (project.getPageByPathname(pagePath)) {
            return setError(`${pagePath} already exists`)
        }

        setIsLoading(true)

        const response = await api.pages.create({
            token: user.getTokenId(),
            title: pagePath,
            path: pagePath,
            description: "Edit me!",
            projectId: projectId,
            contentIds: [],
        })

        project.event$.next({
            type: ProjectMessageType.SET_PAGE,
            data: {
                id: response.id,
                title: response.title,
                path: response.path,
                projectId: response.projectId,
                description: response.description,
                contentIds: [],
            }
        })

        setIsLoading(false)
        navigate(
            appRoutes.getProjectPageRoute(project.getId(), response.id)
        )
    }

    const pagesList = Object.keys(project.getPages())
    const canCreateNewPages = pagesList.length < 2 || isSubscribed

    return (
        <Helmet>
            <Section size="1">
                <Card className={styles.card}>
                    <Flex direction="column" align="center" justify="center">
                        <Text
                            className={styles.title}
                        >
                            {project?.getUrl()}/{pagePath}
                        </Text>

                        {error && (
                            <Text
                                className={styles.errorMessage}
                            >
                                {error}
                            </Text>
                        )}

                        <Form.Root onSubmit={canCreateNewPages ? onCreateNewPage : redirectToCheckout}>
                            <Flex gap="3" direction="column">
                                <Form.Field name="projectName">
                                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                                        <Text
                                            className={styles.title}
                                        >
                                            Page Name
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
                                            value={pagePath}
                                            onChange={e => setPagePath(e.target.value)}
                                            className={styles.input}
                                            required
                                        />
                                    </Form.Control>
                                </Form.Field>
                                <Form.Submit asChild>
                                    <Button
                                        style={{ marginTop: 10 }}
                                        loading={isLoading}
                                    >
                                        Create Page
                                    </Button>
                                </Form.Submit>
                            </Flex>
                        </Form.Root>
                    </Flex>
                </Card>
            </Section>
        </Helmet >
    );
};

export default RouteProjectCreate
