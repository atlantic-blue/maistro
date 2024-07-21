import React from "react"
import { ProjectsContext } from "../../Projects"
import { useParams } from "react-router-dom"
import { Badge, Box, Button, DropdownMenu, Flex, Text, TextField } from "@radix-ui/themes"
import EditorData, { EditorDataType } from "./EditorData"
import env from "../../env"
import { SectionShoppingCartBasicProps } from "../../Templates/Section/SectionShoppingCart/SectionShoppingCartBasic/SectionShoppingCartBasic"

interface EditorProps {
    onSaveData: (props: SectionShoppingCartBasicProps) => void
    onUploadFile: (file: File) => Promise<string>
    children: React.ReactNode
}

const SectionShoppingCartBasicEditor: React.FC<SectionShoppingCartBasicProps & EditorProps> = (props) => {
    const { projects } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")
    const [state, setState] = React.useState(props)

    const onSave = () => {
        props.onSaveData({
            projectId: projectId || "",
            currencySymbol: "$",
            deliveryFee: 500,
            serviceFee: 0.99,

            items: [],
            modifiers: [],
            // fees: [
            //     {
            //         name: "",
            //         price: 0,
            //         optional: true,
            //     }
            // ]
        })
    }

    return (
        <>
            <Flex gap="3" mt="4" justify="end" mb="2">
                <Button onClick={onSave}>Save</Button>
            </Flex>

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
            {/* 
            <EditorData
                type={EditorDataType.TEXT}
                name="Currency"
                value={state.currencySymbol}
                onChange={data => {
                    setState(prev => {
                        return {
                            ...prev,
                            currencySymbol: data
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
            </Box> */}
        </>
    )
}

export default SectionShoppingCartBasicEditor
