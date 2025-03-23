import React from "react"
import { Badge, Box, Card, Flex, Text } from "@radix-ui/themes"
import { ProjectsContext } from "../../../Projects"
import { useNavigate, useParams } from "react-router-dom"
import Helmet from "../Components/Helmet/Helmet"
import useObservable from "../../../Utils/Hooks/UseObservable"
import { OrderStatus, ProjectMessageType } from "../../../types"
import { filter } from "rxjs/operators"
import { appRoutes } from "../../router"
import { Order } from "../../../Store/Order"

const RouteProjectOrders: React.FC = () => {
    const navigate = useNavigate()
    const { projects } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")

    useObservable(project.event$.pipe(filter(event => (
        event.type === ProjectMessageType.SET_ORDER ||
        event.type === ProjectMessageType.DELETE_ORDER
    ))))

    const onClick = (order: Order) => {
        navigate(appRoutes.getProjectOrderRoute(project.getId(), order.getId()))
    }

    return (
        <>
            <Helmet>
                <Box mt="5">
                    <Flex direction="column" gap="2" mb="2" justify="center" align="center">
                        {Object.values(project.getOrders())
                            .filter(order => order.getStatus() === OrderStatus.CHECKOUT_COMPLETED)
                            .map(order => {
                                return (
                                    <Card key={order.getId()} onClick={() => onClick(order)}>
                                        <Flex direction="column" align="center">
                                            <Badge color="grass">
                                                {order.getStatus()}
                                            </Badge>

                                            <Flex direction="column" justify="center" align="center" mt="1">
                                                <Text size="1">
                                                    {new Date(order?.getFulfilment()?.date).toDateString()}
                                                </Text>
                                                <Text size="1">
                                                    {order?.getFulfilment()?.interval}
                                                </Text>
                                            </Flex>

                                            <Text size="1" m="1">
                                                ref: {order.getId().split("-")[0]}
                                            </Text>
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

export default RouteProjectOrders
