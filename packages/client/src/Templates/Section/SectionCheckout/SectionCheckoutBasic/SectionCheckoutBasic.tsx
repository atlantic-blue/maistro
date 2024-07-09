import React from "react"
import { Stripe, loadStripe } from '@stripe/stripe-js';

import { Avatar, Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes"
import { TemplateCategory, TemplateComponentType, TemplateStruct } from "../../../templateTypes"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import env from "../../../../env";

let stripePromise: Promise<Stripe | null> | null = null
const getStripePromise = (accountId: string) => {
    if (stripePromise) {
        return stripePromise
    }

    stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || "", {
        stripeAccount: accountId,
    })
}

export interface SectionCheckoutBasicItem {
    quantity: number,
    price_data: {
        currency: string,
        unit_amount: string,
        product_data: {
            name: string,
            description: string,
            images: string[]
        }
    },
}

export interface SectionCheckoutBasicProps {
    "data-hydration-id"?: string
    projectId: string
    accountId: string
    returnUrl: string
    checkoutUrl: string
    items: SectionCheckoutBasicItem[]
}

const SectionCheckoutBasic: React.FC<SectionCheckoutBasicProps> = (props) => {
    const { accountId, projectId, returnUrl, items, checkoutUrl } = props

    const [clientSecret, setClientSecret] = React.useState("")
    const stripePromise = getStripePromise(accountId)
    const [loading, setIsLoading] = React.useState(false)

    const onClick = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(checkoutUrl, {
                method: "POST",
                body: JSON.stringify({
                    project_id: projectId,
                    account_id: accountId,
                    return_url: returnUrl,
                    line_items: items,
                })
            }).then(response => response.json())

            console.log({ response })
            setClientSecret(response.client_secret)
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    if (clientSecret && stripePromise) {
        return (
            <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ clientSecret }}
            >
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        )
    }

    return (
        <Flex
            direction="column" justify='center' align="center" mb="2"
            data-hydration-id={props["data-hydration-id"]}
        >
            <Box>
                {items?.map(item => {
                    return (
                        <Card key={`${item.price_data?.product_data.name}-${Date.now()}`}>
                            <Flex justify="between" gap="2" >
                                <Avatar
                                    size="9"
                                    src={item.price_data?.product_data?.images[0]}
                                    fallback={item.price_data?.product_data?.name}
                                />
                                <Flex direction="column">
                                    <Heading>{item.price_data?.product_data?.name}</Heading>
                                    <Box>
                                        <Flex>
                                            <Text>{item.price_data.currency}</Text>
                                            <Text>{item.price_data.unit_amount}</Text>
                                        </Flex>
                                    </Box>
                                </Flex>
                                <Text m="auto">{item.quantity}</Text>
                            </Flex>
                        </Card>
                    )
                })}
            </Box>
            <Button onClick={onClick} loading={loading}>
                Order now!
            </Button>
        </Flex>
    )
}

export const SectionCheckoutBasicItem: TemplateStruct<SectionCheckoutBasicProps> = {
    name: TemplateComponentType.CHECKOUT_BASIC,
    Component: SectionCheckoutBasic,
    categories: [TemplateCategory.CHECKOUT],
    description: "Checkout Basic",
    classNames: [
        // ...Object.values(styles),
        // ...Object.values(ButtonStyles),
    ],
    props: {
        accountId: "",
        projectId: "",
        returnUrl: "",
        checkoutUrl: env.api.payments.checkouts.create,
        items: [
            {
                quantity: 1,
                price_data: {
                    currency: "gbp",
                    unit_amount: "10",
                    product_data: {
                        name: "brownie",
                        description: "best brownie in the world",
                        images: [
                            "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxM3x8ZGVzc2VydHxlbnwwfHx8fDE3MjAzMTI5ODV8MA&ixlib=rb-4.0.3&q=85"
                        ]
                    }
                },
            }
        ]
    },
}

export default SectionCheckoutBasic