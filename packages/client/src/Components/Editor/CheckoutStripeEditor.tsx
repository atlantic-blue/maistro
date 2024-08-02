import React, { useEffect } from "react"
import { ProjectsContext } from "../../Projects"
import { SectionCheckoutStripeProps } from "../../Templates/Section/SectionCheckout/SectionCheckoutStripe/SectionCheckoutStripe"
import { useParams } from "react-router-dom"
import { Badge, Box, Button, Card, DropdownMenu, Flex, Switch, Text, TextField } from "@radix-ui/themes"
import EditorData, { EditorDataType } from "./EditorData"
import { PaymentsContext } from "../../Payments/PaymentsProvider"
import env from "../../env"
import * as uuid from "uuid"
import { Currency, fromSmallestUnit, toSmallestUnit } from "../../Utils/currency"

interface EditorProps {
    onSaveData: (props: SectionCheckoutStripeProps) => void
    onUploadFile: (file: File) => Promise<string>
    children: React.ReactNode
}

const SectionCheckoutStripeEditor: React.FC<SectionCheckoutStripeProps & EditorProps> = (props) => {
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
            orderUrl: env.api.orders.create,

            returnUrl: state.returnUrl,
            // Shipping
            enableShipping: state.enableShipping || false,
            allowedCountries: state.allowedCountries || [],
            shippingOptions: state.shippingOptions || []
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

                    <Flex gap="2" direction="column">
                        {
                            state?.shippingOptions?.map((option, index) => {
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
                                                    value={fromSmallestUnit(option.shipping_rate_data.fixed_amount.amount, project.getCurrency())}
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
                                                                                amount: toSmallestUnit(Number(e.target.value), project.getCurrency()),
                                                                                currency: project.getCurrency()
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
                            })
                        }
                    </Flex>
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
                                                amount: fromSmallestUnit(500, project.getCurrency()),
                                                currency: project.getCurrency()
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

export default SectionCheckoutStripeEditor
