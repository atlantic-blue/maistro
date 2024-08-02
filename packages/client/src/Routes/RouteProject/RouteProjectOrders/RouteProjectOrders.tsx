import React from "react"
import { Badge, Box, Card, Flex } from "@radix-ui/themes"
import { ProjectsContext } from "../../../Projects"
import { useParams } from "react-router-dom"
import Helmet from "../Components/Helmet/Helmet"
import useObservable from "../../../Utils/Hooks/UseObservable"
import { ProjectMessageType } from "../../../types"
import { filter } from "rxjs/operators"

const RouteProjectSettingsOrders: React.FC = () => {
    const { projects } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")

    useObservable(project.event$.pipe(filter(event => (
        event.type === ProjectMessageType.SET_ORDER ||
        event.type === ProjectMessageType.DELETE_ORDER
    ))))

    return (
        <>
            <Helmet>
                <Box mt="5">
                    <Flex direction="column" gap="2" mb="2" justify="center" align="center">
                        {Object.values(project.getOrders()).map(order => {
                            return (
                                <Card key={order.getId()}>
                                    <Flex direction="column">
                                        {order.getId()}
                                        <Badge color="grass">
                                            {order.getStatus()}
                                        </Badge>
                                    </Flex>
                                </Card>
                            )
                        })}
                    </Flex>
                </Box>
            </Helmet>
        </>
    )
}

export default RouteProjectSettingsOrders
