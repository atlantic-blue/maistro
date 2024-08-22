import React from "react"
import { Badge, Box, Card, Flex, Text, Avatar, Heading, Separator, Button } from "@radix-ui/themes"
import { ProjectsContext } from "../../../Projects"
import { useParams } from "react-router-dom"
import Helmet from "../Components/Helmet/Helmet"
import useObservable from "../../../Utils/Hooks/UseObservable"
import { ProjectMessageType } from "../../../types"
import { filter } from "rxjs/operators"
import { CurrencySymbol, fromSmallestUnit } from "../../../Utils/currency"

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
    const currency = project.getCurrency()
    const total = order.getItems().reduce((acc, next) => {
        return acc + (Number(next.price_data.unit_amount) * next.quantity)
    }, 0)

    return (
        <>
            <Helmet>
                <Card m="2">
                    <Flex direction="column" gap="2" mb="2" justify="center" align="center">
                        <Badge size="3" color="blue">
                            {order.getStatus().toLowerCase().replaceAll("_", " ")}
                        </Badge>

                        <Flex gap="2" direction="column" justify="center" align="center">
                            <Text size="1">
                                {new Date(order?.getFulfilment()?.date).toDateString()}
                            </Text>
                            <Text size="1">
                                {order?.getFulfilment()?.interval}
                            </Text>
                        </Flex>

                        <Flex direction="column" gap="2" justify="center" align="center" width="300px">
                            {
                                order.getItems().map(item => {
                                    const currency = item.price_data.currency.toUpperCase() as Currency
                                    return (
                                        <Flex key={item?.price_data?.product_data?.name} justify="between" align="center" gap="2" style={{ width: "100%" }}>
                                            <Text >{item?.quantity}x</Text>
                                            <Avatar
                                                src={item?.price_data?.product_data?.images[0]}
                                                fallback={item?.price_data?.product_data?.name.charAt(0)}
                                                size="2"
                                            />
                                            <Flex direction="column" style={{ flex: "1", marginRight: "auto", textAlign: "left" }}>
                                                <Heading as="h4" size="4">
                                                    {item?.price_data?.product_data?.name}
                                                </Heading>
                                            </Flex>
                                            <Text>
                                                {CurrencySymbol[currency]}{' '}
                                                {
                                                    fromSmallestUnit(Number(item.price_data.unit_amount),
                                                        currency
                                                    )
                                                }
                                            </Text>
                                        </Flex>
                                    )
                                })
                            }
                        </Flex>


                        <Text>
                            {CurrencySymbol[currency]}{' '}
                            {
                                fromSmallestUnit(Number(total),
                                    currency
                                )
                            }
                        </Text>

                        <Separator m="3" size="4" />

                        <Flex direction="column" gap="1" justify="center" align="start">
                            <Flex align="center" gap="2">
                                <Heading as="h3" size="2">Time: </Heading>
                                <Text size="1">{new Date(order.getUpdatedAt()).toUTCString()}</Text>
                            </Flex>

                            <Flex align="center" gap="2">
                                <Heading as="h3" size="2">Order:</Heading>
                                <Text size="1">{order.getId()}</Text>
                            </Flex>

                        </Flex>
                    </Flex>
                </Card>

                <Card>
                    <Flex gap="3" justify="center" align="center">
                        <Button
                            onClick={() => {
                                const url = `https://${project.getUrl()}/order?orderId=${order.getId()}`
                                window.open(url, '_blank');
                            }}
                        >
                            User Receipt
                        </Button>
                    </Flex>
                </Card>
            </Helmet>
        </>
    )
}

export default RouteProjectOrder
