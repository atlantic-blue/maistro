import React from "react"
import { useNavigate } from "react-router-dom"

import { ProjectsContext } from "../../../../../Projects"
import { ProjectsMessageType } from "../../../../../types"
import { appRoutes } from "../../../../router"
import { Project } from "../../../../../Store/Project"

import IconBin from "../../../../../Components/Icons/Bin/Bin"

import * as styles from "../../RouteProjectSettings.scss"
import { ApiContext } from "../../../../../Api/ApiProvider"
import { Box, Button, Heading, Text, Card, Callout, Flex } from "@radix-ui/themes"
import { PaymentsContext, canUseFeature } from "../../../../../Payments/PaymentsProvider"

interface RouteProjectSettingsDeleteProps {
    project: Project
}

const RouteProjectSettingsDelete: React.FC<RouteProjectSettingsDeleteProps> = (props) => {
    const navigate = useNavigate();
    const { api } = React.useContext(ApiContext)
    const { projects, user } = React.useContext(ProjectsContext)
    const [isLoading, setIsLoading] = React.useState(false)
    const { paymentPlan, redirectToPaymentPlans } = React.useContext(PaymentsContext)

    const onProjectDelete = (project: Project) => {
        // TODO offline mode
        // projects.event$.next({
        //     type: ProjectsMessageType.DELETE_PROJECT,
        //     data: project.getId()
        // })

        // navigate(appRoutes.getProjectsRoute())

        // TODO states with react query
        setIsLoading(true)
        api.projects
            .delete({ token: user.getTokenId(), id: project.getId() })
            .then(() => {
                projects.event$.next({
                    type: ProjectsMessageType.DELETE_PROJECT,
                    data: project.getId()
                })

                navigate(appRoutes.getProjectsRoute())
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <Callout.Root
            data-accent-color="ruby"
            m="3"
            style={{ display: "flex" }}
        >
            <Flex direction="column" align="center" justify="center" m="auto" wrap="wrap">
                <Heading as="h3" className={styles.title}>
                    Danger Zone
                </Heading>

                <Flex align="center" justify="center">
                    <Text>
                        Once you delete a project, there is no going back.
                        Please be certain.
                    </Text>
                    <Button
                        className={styles.buttonDanger}
                        onClick={canUseFeature.deleteProject[paymentPlan]() ? () => onProjectDelete(props.project) : redirectToPaymentPlans}
                        loading={isLoading}
                    >
                        <IconBin className={styles.buttonDangerIcon} />
                    </Button>
                </Flex>
            </Flex>
        </Callout.Root>
    )
}

export default RouteProjectSettingsDelete