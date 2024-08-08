import React from "react"
import { ProjectsContext } from "../../Projects"
import { useParams } from "react-router-dom"
import { Badge, Button, DropdownMenu, Flex, Text } from "@radix-ui/themes"
import EditorData, { EditorDataType } from "./EditorData"
import env from "../../env"
import { SectionCheckoutMercadoPagoProps } from "../../Templates/Section/SectionCheckout/SectionCheckoutMercadoPago/SectionCheckoutMercadoPago"

interface EditorProps {
    onSaveData: (props: SectionCheckoutMercadoPagoProps) => void
    onUploadFile: (file: File) => Promise<string>
    children: React.ReactNode
}

const SectionCheckoutMercadoPagoEditor: React.FC<SectionCheckoutMercadoPagoProps & EditorProps> = (props) => {
    const { projects } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")
    const [state, setState] = React.useState(props)

    const onSave = () => {
        props.onSaveData({
            projectId: projectId || "",
            checkoutUrl: env.api.payments.checkouts.create.mercadoPago,
            paymentUrl: env.api.payments.process.createLatam,

            publicKey: state.publicKey,
            accessToken: state.accessToken,
            returnUrl: state.returnUrl,
            statementDescriptor: state.statementDescriptor,

            // Shipping TODO
            // enableShipping: state.enableShipping || false,
            enableShipping: true,
            payer: {
                first_name: "Carlos",
                last_name: "Franco",
                phone: {
                    area_code: "+57",
                    number: "3223245732",
                },
            },
            shippingOptions: {
                receiver_address: {
                    zip_code: "110110",
                    street_name: "calle 86",
                    city_name: "Bogota",
                },
                cost: 3000,
            },
            // TODO checkout
            // Items
            items: [
                {
                    id: new Date().toISOString(),
                    quantity: 2,
                    title: "tart",
                    category_id: 'dessert',
                    unit_price: 3000,
                    currency_id: "COP",
                    description: "tarts for all!",
                    picture_url: "https://images.unsplash.com/photo-1468218620578-e8d78dcda7b1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxNnx8c3dlZXQlMkNzaW58ZW58MHx8fHwxNzE5OTYwMzg3fDA&ixlib=rb-4.0.3&q=85",
                }
            ],
        })
    }

    return (
        <>
            <Flex gap="3" mt="4" justify="end" mb="2">
                <Button onClick={onSave}>Save</Button>
            </Flex>

            <EditorData
                type={EditorDataType.TEXT}
                name="Public Key"
                value={state.publicKey}
                onChange={data => {
                    setState(prev => {
                        return {
                            ...prev,
                            publicKey: data
                        }
                    })
                }}
            />

            <EditorData
                type={EditorDataType.TEXT}
                name="Access Token"
                value={state.accessToken}
                onChange={data => {
                    setState(prev => {
                        return {
                            ...prev,
                            accessToken: data
                        }
                    })
                }}
            />

            <EditorData
                type={EditorDataType.TEXT}
                name="Statement Descriptor"
                value={state.statementDescriptor}
                onChange={data => {
                    setState(prev => {
                        return {
                            ...prev,
                            statementDescriptor: data
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
                            checkoutUrl: env.api.payments.checkouts.createLatam,
                        }
                    })
                }}
            >
                {env.api.payments.checkouts.createLatam}
            </Badge>

            <Text as="div" size="1" weight="bold">
                Payment URL
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
                            checkoutUrl: env.api.payments.process.createLatam,
                        }
                    })
                }}
            >
                {env.api.payments.process.createLatam}
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


            {/* <Text as="div" size="1" weight="bold">Shipping</Text>
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
            /> */}

        </>
    )
}

export default SectionCheckoutMercadoPagoEditor
