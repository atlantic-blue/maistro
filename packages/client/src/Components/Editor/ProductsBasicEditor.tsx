import React from "react"
import { Avatar, Box, Button, Card, DropdownMenu, Flex, Text } from "@radix-ui/themes"
import EditorData, { EditorDataType } from "./EditorData";
import { SectionProductsBasicProps } from "../../Templates/Section/SectionProduct/SectionProductBasic/SectionProductBasic";
import { ProjectsContext } from "../../Projects";
import { useParams } from "react-router-dom";

interface EditorProps {
    onSaveData: (props: SectionProductsBasicProps) => void
    onUploadFile: (file: File) => Promise<string>
    children: React.ReactNode
}

const SectionProductsEditor: React.FC<SectionProductsBasicProps & EditorProps> = (props) => {
    const { projects } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")

    const [state, setState] = React.useState(props)

    const onSave = () => {
        props.onSaveData({
            products: state.products,
        })
    }

    return (
        <>
            <Flex gap="3" mt="4" justify="end" mb="2">
                <Button onClick={onSave}>Save</Button>
            </Flex>
            <Flex direction="column" gap="3">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Button variant="soft">
                            Select Product
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        {
                            Object.values(
                                project.getProducts()
                            ).map(product => {
                                return (
                                    <DropdownMenu.Item
                                        key={product.getId()}
                                        onClick={() => {
                                            setState(prev => {
                                                prev.products?.push({
                                                    title: product.getName(),
                                                    price: String(product.getPrice()),
                                                    imgSrc: product.getImages()[0],
                                                    description: product.getDescription(),
                                                    currency: product.getCurrency(),
                                                    cta: "Order Now!",
                                                })

                                                return {
                                                    ...prev,
                                                }
                                            })
                                        }}
                                    >
                                        <Flex align="center" gap="1">
                                            <Avatar
                                                size="2"
                                                src={product.getImages()[0]}
                                                fallback={product.getName()}
                                            />
                                            <Text>{product.getName()}</Text>
                                        </Flex>
                                    </DropdownMenu.Item>
                                )
                            })
                        }
                    </DropdownMenu.Content>
                </DropdownMenu.Root>

                <Box>
                    {
                        props.products?.map((product, index) => {
                            return (
                                <Card key={index} mb="2">
                                    <Text as="div" size="1" mb="1" weight="bold">
                                        Product
                                    </Text>

                                    <EditorData
                                        type={EditorDataType.TEXT}
                                        name="Title"
                                        value={product.title}
                                        onChange={data => {
                                            setState(prev => {
                                                prev.products[index] = {
                                                    ...prev.products[index],
                                                    title: data,
                                                }

                                                return {
                                                    ...prev,
                                                }
                                            })
                                        }}
                                    />


                                    <EditorData
                                        type={EditorDataType.IMAGE}
                                        name="Image"
                                        value={product.imgSrc}
                                        onChange={data => {
                                            setState(prev => {
                                                prev.products[index] = {
                                                    ...prev.products[index],
                                                    imgSrc: data,
                                                }

                                                return {
                                                    ...prev,
                                                }
                                            })
                                        }}
                                        onUploadFile={props.onUploadFile}
                                    />

                                    <EditorData
                                        type={EditorDataType.TEXT}
                                        name="Description"
                                        value={product.description}
                                        onChange={data => {
                                            setState(prev => {
                                                prev.products[index] = {
                                                    ...prev.products[index],
                                                    description: data,
                                                }

                                                return {
                                                    ...prev,
                                                }
                                            })
                                        }}
                                    />

                                    <EditorData
                                        type={EditorDataType.TEXT}
                                        name="CTA"
                                        value={product.cta}
                                        onChange={data => {
                                            setState(prev => {
                                                prev.products[index] = {
                                                    ...prev.products[index],
                                                    cta: data,
                                                }

                                                return {
                                                    ...prev,
                                                }
                                            })
                                        }}
                                    />

                                    <EditorData
                                        type={EditorDataType.TEXT}
                                        name="Price"
                                        value={product.price}
                                        onChange={data => {
                                            setState(prev => {
                                                prev.products[index] = {
                                                    ...prev.products[index],
                                                    price: data,
                                                }

                                                return {
                                                    ...prev,
                                                }
                                            })
                                        }}
                                    />

                                    <Flex justify="end" m="2">
                                        <Button size="1" variant="ghost"
                                            onClick={() => {
                                                setState(prev => {

                                                    return {
                                                        ...prev,
                                                        products: prev.products.filter(i => i !== product)
                                                    }
                                                })
                                            }}
                                        >
                                            Remove Product
                                        </Button>
                                    </Flex>
                                </Card>
                            )
                        })
                    }
                </Box>
            </Flex>
            {props.children}

            <Flex gap="3" mt="4" justify="end">
                <Button onClick={onSave}>Save</Button>
            </Flex>
        </>
    )
}


export default SectionProductsEditor
