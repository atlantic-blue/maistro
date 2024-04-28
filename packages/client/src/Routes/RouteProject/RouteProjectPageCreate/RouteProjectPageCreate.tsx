import React from "react";
import { useNavigate, useParams } from 'react-router-dom'
import { filter } from "rxjs/operators";
import { Card, Flex, TextField, Text, Section } from "@radix-ui/themes";

import Helmet from "../Components/Helmet/Helmet";
import { PageStruct, ProjectMessageType, TemplateStruct } from "../../../types";
import { ProjectsContext } from "../../../Projects";

import { appRoutes } from "../../router";
import { PaymentsContext } from "../../../Payments/PaymentsProvider";
import { ApiContext } from "../../../Api/ApiProvider";

import useObservable from "../../../Utils/Hooks/UseObservable";
import { PageViews } from "../../../Pages";
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

    const onCreateNewPage = async (page: PageStruct, templates: TemplateStruct[]) => {
        if (!pagePath) {
            return setError("add a page url")
        }

        if (project.getPageByPathname(pagePath)) {
            return setError(`/${pagePath} already exists`)
        }
        setIsLoading(true)

        const promises = templates.map(async (template) => {
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
            return response.id
        })

        const responses = await Promise.all(promises)

        const contentIds = responses.filter(Boolean)

        const response = await api.pages.create({
            token: user.getTokenId(),
            title: page.title,
            path: pagePath,
            description: page.description,
            projectId: projectId,
            contentIds,
        })

        project.event$.next({
            type: ProjectMessageType.SET_PAGE,
            data: {
                id: response.id,
                title: response.title,
                path: response.path,
                projectId: response.projectId,
                description: response.description,
                contentIds,
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

                <Flex justify="center" align="center" direction="row" wrap="wrap">
                    <Text
                        className={styles.title}
                    >
                        {project?.getUrl()}/
                    </Text>
                    <TextField.Root
                        type="text"
                        size="2"
                        variant="surface"
                        value={pagePath}
                        onChange={e => { setError(""); setPagePath(e.target.value) }}
                        className={styles.input}
                        placeholder="home"
                        required
                    />
                </Flex>
                <Flex justify="center" align="center" direction="row" gap="2">
                    {isLoading && <div className={styles.messageLoading}>Creating page...</div>}
                    {error && <div className={styles.messageError}>{error}</div>}
                </Flex>

                <Section size="1" className={styles.section}>
                    <Card>
                        <PageViews
                            onClick={canCreateNewPages ? onCreateNewPage : redirectToCheckout}
                            className={styles.template}
                            thumbnail={{
                                dimensions: {
                                    height: "400px",
                                    width: "350px",
                                    scale: .5,
                                }
                            }}
                        />
                    </Card>
                </Section>
            </Section>
        </Helmet >
    );
};

export default RouteProjectCreate
