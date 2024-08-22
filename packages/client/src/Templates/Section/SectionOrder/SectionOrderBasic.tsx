import React, { useEffect, useState } from "react"
import { TemplateCategory, TemplateComponentType, TemplateStruct } from "../../templateTypes"
import { ordersGetById } from "../../Api/Orders/ordersGetById"
import { Order, OrderStatus } from "../../types"
import { Avatar, Badge, Card, Flex, Heading, Separator, Text } from "@radix-ui/themes"
import { CurrencySymbol, fromSmallestUnit } from "../../../Utils/currency"

export const PARAMS_ORDER_ID = "orderId"

interface SectionOrderBasicProps {
    "data-hydration-id"?: string
}

const SectionOrderBasic: React.FC = (props) => {
    const params = new URLSearchParams(window.location.search)
    const orderId = params.get(PARAMS_ORDER_ID)
    const [order, setOrder] = useState<Order | null>(null)

    useEffect(() => {
        if (!orderId) {
            return
        }

        ordersGetById({ orderId })
            .then(o => {
                if (!o?.data) {
                    return
                }

                setOrder(o.data)
            })
    }, [orderId])


    if (!order) {
        return (
            <Card data-hydration-id={props["data-hydration-id"]}>
                <Text size="4">
                    No Order has been found!
                </Text>
            </Card>
        )
    }

    const currency = order?.items[0].price_data.currency as Currency
    const total = order?.items?.reduce((acc, next) => {
        return acc + (Number(next.price_data.unit_amount) * next.quantity)
    }, 0)

    return (
        <Card data-hydration-id={props["data-hydration-id"]}>
            <Flex direction="column" justify="center" gap="2" align="center">

                <Flex direction="column" gap="2" justify="center" align="center">
                    <Badge color={order.status === OrderStatus.CHECKOUT_COMPLETED ? "green" : "gray"} size="3">
                        {order.status.replaceAll("_", " ").toLocaleLowerCase()}
                    </Badge>


                    <Flex gap="2" direction="column" justify="center" align="center">
                        <Text size="1">
                            {new Date(order?.fulfilment?.date).toDateString()}
                        </Text>
                        <Text size="1">
                            {order?.fulfilment?.interval}
                        </Text>
                    </Flex>
                </Flex>

                <Flex direction="column" gap="2" justify="center" align="center" width="300px">
                    {
                        order.items.map(item => {
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
                        <Text size="1">{new Date(order.updatedAt).toUTCString()}</Text>
                    </Flex>

                    <Flex align="center" gap="2">
                        <Heading as="h3" size="2">Order:</Heading>
                        <Text size="1">{order.id}</Text>
                    </Flex>

                </Flex>
            </Flex>
        </Card>
    )
}

export default SectionOrderBasic

export const SectionOrderBasicItem: TemplateStruct<SectionOrderBasicProps> = {
    name: TemplateComponentType.ORDER_BASIC,
    Component: SectionOrderBasic,
    categories: [TemplateCategory.ORDER],
    description: "Product Basic",
    classNames: [
        // ...Object.values(styles),
        // ...Object.values(ButtonStyles),
    ],
    props: {

    }
}

