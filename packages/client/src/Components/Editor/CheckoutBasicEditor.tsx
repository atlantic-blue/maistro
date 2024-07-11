import React, { useEffect } from "react"
import { ProjectsContext } from "../../Projects"
import { SectionCheckoutBasicProps } from "../../Templates/Section/SectionCheckout/SectionCheckoutBasic/SectionCheckoutBasic"
import { useParams } from "react-router-dom"
import { Badge, Box, Button, Card, DropdownMenu, Flex, Switch, Text, TextField } from "@radix-ui/themes"
import EditorData, { EditorDataType } from "./EditorData"
import { PaymentsContext } from "../../Payments/PaymentsProvider"
import env from "../../env"
import * as uuid from "uuid"

interface EditorProps {
    onSaveData: (props: SectionCheckoutBasicProps) => void
    onUploadFile: (file: File) => Promise<string>
    children: React.ReactNode
}

const SectionCheckoutBasicEditor: React.FC<SectionCheckoutBasicProps & EditorProps> = (props) => {
    const { projects } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const { connectedAccount } = React.useContext(PaymentsContext)
    const project = projects.getProjectById(projectId || "")
    const [state, setState] = React.useState(props)

    const onSave = () => {
        props.onSaveData({
            accountId: state.accountId || connectedAccount?.id || "",
            projectId: projectId || "",
            checkoutUrl: env.api.payments.checkouts.create,
            returnUrl: state.returnUrl,
            // Shipping
            enableShipping: state.enableShipping || false,
            allowedCountries: state.allowedCountries || [],
            shippingOptions: state.shippingOptions || [],
            // Items
            items: [
                {
                    quantity: 10,
                    price_data: {
                        currency: "aud",
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
            ],
        })
    }

    return (
        <>
            <Flex gap="3" mt="4" justify="end" mb="2">
                <Button onClick={onSave}>Save</Button>
            </Flex>

            <Text as="div" size="1" weight="bold">
                Account ID
            </Text>

            <Badge
                color="green"
                mt="2"
                mb="2"
                size="2"
                onClick={() => {
                    setState(prev => {
                        return {
                            ...prev,
                            accountId: connectedAccount?.id || "",
                        }
                    })
                }}
            >
                {connectedAccount?.id}
            </Badge>



            <EditorData
                type={EditorDataType.TEXT}
                name=""
                value={state.accountId}
                onChange={data => {
                    setState(prev => {
                        return {
                            ...prev,
                            accountId: data,
                        }
                    })
                }}
            />

            <Text as="div" size="1" weight="bold">
                Project ID
            </Text>

            <Badge
                color="green"
                mt="2"
                mb="2"
                size="2"
                onClick={() => {
                    setState(prev => {
                        return {
                            ...prev,
                            projectId: projectId || "",
                        }
                    })
                }}
            >
                {projectId}
            </Badge>

            <Text as="div" size="1" weight="bold">
                Checkout URL
            </Text>
            <Badge
                color="green"
                mt="2"
                mb="2"
                size="2"
                onClick={() => {
                    setState(prev => {
                        return {
                            ...prev,
                            checkoutUrl: env.api.payments.checkouts.create,
                        }
                    })
                }}
            >
                {env.api.payments.checkouts.create}
            </Badge>

            <Text as="div" size="1" weight="bold">
                Return URL
            </Text>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <Button variant="soft" size="2" mb="2">
                        <Badge>{state.returnUrl}</Badge>
                        <DropdownMenu.TriggerIcon />
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    {project.getPagesMap().map(page => {
                        const url = `https://${project.getUrl()}/${page.getPath()}`
                        return (
                            <DropdownMenu.Item
                                key={page.getId()}
                                onClick={() => {
                                    setState(prev => {
                                        return {
                                            ...prev,
                                            returnUrl: url
                                        }
                                    })
                                }}
                            >
                                <Text>
                                    {url}
                                </Text>
                            </DropdownMenu.Item>
                        )
                    })}
                </DropdownMenu.Content>
            </DropdownMenu.Root>


            <Text as="div" size="1" weight="bold">Shipping</Text>
            <Switch
                mb="2"
                checked={state.enableShipping}
                onClick={() => {
                    setState(prev => {
                        return {
                            ...prev,
                            enableShipping: !prev.enableShipping
                        }
                    })
                }}
            />

            {state.enableShipping ? (
                <>
                    <EditorData
                        type={EditorDataType.TEXT}
                        name="Country"
                        value={state?.allowedCountries ? state?.allowedCountries[0] : ""}
                        onChange={data => {
                            setState(prev => {
                                return {
                                    ...prev,
                                    allowedCountries: [
                                        data
                                    ],
                                }
                            })
                        }}
                    />

                    {state?.shippingOptions?.map((option, index) => {
                        return (
                            <Card key={`${uuid.v1()}-${index}`}>
                                <Flex direction="column">
                                    <EditorData
                                        type={EditorDataType.TEXT}
                                        name="Name"
                                        value={option.shipping_rate_data.display_name}
                                        onChange={data => {
                                            setState(prev => {
                                                return {
                                                    ...prev,
                                                    shippingOptions: prev.shippingOptions.map((option, i) => {
                                                        return i === index ? ({
                                                            ...option,
                                                            shipping_rate_data: {
                                                                ...option.shipping_rate_data,
                                                                type: "fixed_amount",
                                                                display_name: data,
                                                            }
                                                        }) : option
                                                    })
                                                }
                                            })
                                        }}
                                    />

                                    <EditorData
                                        type={EditorDataType.TEXT}
                                        name="Currency"
                                        value={option.shipping_rate_data.fixed_amount.currency}
                                        onChange={data => {
                                            setState(prev => {
                                                return {
                                                    ...prev,
                                                    shippingOptions: prev.shippingOptions.map((option, i) => {
                                                        return i === index ? ({
                                                            ...option,
                                                            shipping_rate_data: {
                                                                ...option.shipping_rate_data,
                                                                type: "fixed_amount",
                                                                fixed_amount: {
                                                                    ...option.shipping_rate_data.fixed_amount,
                                                                    currency: data
                                                                }
                                                            }
                                                        }) : option
                                                    })
                                                }
                                            })
                                        }}
                                    />

                                    <Box mb="2">
                                        <Flex align="center" gap="2" justify="between" mb="2">
                                            <Text as="div" size="1" mb="1" weight="bold">
                                                Price
                                            </Text>
                                        </Flex>
                                        <TextField.Root
                                            type="number"
                                            size="2"
                                            variant="surface"
                                            value={option.shipping_rate_data.fixed_amount.amount}
                                            onChange={e => {
                                                setState(prev => {
                                                    return {
                                                        ...prev,
                                                        shippingOptions: prev.shippingOptions.map((option, i) => {
                                                            return i === index ? ({
                                                                ...option,
                                                                shipping_rate_data: {
                                                                    ...option.shipping_rate_data,
                                                                    type: "fixed_amount",
                                                                    fixed_amount: {
                                                                        ...option.shipping_rate_data.fixed_amount,
                                                                        amount: Number(e.target.value),
                                                                    }
                                                                }
                                                            }) : option
                                                        })
                                                    }
                                                })
                                            }}
                                        />
                                    </Box>
                                    <Button
                                        size="1"
                                        onClick={() => {
                                            setState(prev => {
                                                return {
                                                    ...prev,
                                                    shippingOptions: [
                                                        ...prev.shippingOptions.filter(o => o !== option),
                                                    ]
                                                }
                                            })
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </Flex>
                            </Card>
                        )
                    })}
                </>
            ) : null}

            {state.enableShipping && state.shippingOptions.length < 5 &&
                <Button
                    mt="2"
                    variant="outline"
                    onClick={() => {
                        setState(prev => {
                            return {
                                ...prev,
                                shippingOptions: [
                                    ...prev.shippingOptions,
                                    {
                                        shipping_rate_data: {
                                            display_name: "Edit Me!",
                                            type: "fixed_amount",
                                            fixed_amount: {
                                                amount: 500,
                                                currency: "gpb"
                                            },
                                        }
                                    }
                                ]
                            }
                        })
                    }}>
                    Add Shipping Options
                </Button>
            }
        </>
    )
}

export default SectionCheckoutBasicEditor
