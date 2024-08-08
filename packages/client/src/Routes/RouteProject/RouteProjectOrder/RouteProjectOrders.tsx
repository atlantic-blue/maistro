import React from "react"
import { Badge, Box, Card, Flex, Text, Avatar } from "@radix-ui/themes"
import { ProjectsContext } from "../../../Projects"
import { useParams } from "react-router-dom"
import Helmet from "../Components/Helmet/Helmet"
import useObservable from "../../../Utils/Hooks/UseObservable"
import { ProjectMessageType } from "../../../types"
import { filter } from "rxjs/operators"

const RouteProjectOrder: React.FC = () => {
    const { projects } = React.useContext(ProjectsContext)
    const { projectId, orderId } = useParams()
    const project = projects.getProjectById(projectId || "")


    useObservable(project.event$.pipe(filter(event => (
        event.type === ProjectMessageType.SET_ORDER ||
        event.type === ProjectMessageType.DELETE_ORDER
    ))))

    if (!orderId || !project.getOrderById(orderId)) {
        return
    }

    const order = project.getOrderById(orderId)
    return (
        <>
            <Helmet>
                <Box mt="5">
                    <Flex direction="column" gap="2" mb="2" justify="center" align="center">
                        <Text>
                            {order.getId()}
                        </Text>

                        <Text>
                            {order.getFulfilmentSlot()}
                        </Text>


                        <Text>
                            {order.getItems().map(item => {
                                return (
                                    <div>
                                        <div>{item.quantity}</div>
                                        <div>{item.price_data.unit_amount}</div>
                                        <div>{item.price_data.product_data.name}</div>
                                        <div>{item.price_data.product_data.description}</div>
                                        <Avatar
                                            src={item.price_data.product_data.images[0]}
                                            fallback={item.price_data.product_data.name}
                                        />
                                    </div>
                                )
                            })}
                        </Text>
                    </Flex>
                </Box>
            </Helmet>
        </>
    )
}

export default RouteProjectOrder
