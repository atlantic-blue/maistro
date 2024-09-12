import React from "react"
import { Avatar, Box, Button, Card, DropdownMenu, Flex, Text } from "@radix-ui/themes"
import EditorData, { EditorDataType } from "./EditorData";
import { SectionProductsBasicProps } from "../../Templates/Section/SectionProducts/SectionProductsBasic/SectionProductsBasic";
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
            projectId: projectId || "",
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
                        <Flex align="start" gap="3" direction="column">
                            {
                                Object.values(
                                    project.getProducts()
                                )
                                    .filter(p => !state.products.find(sp => sp.metadata.id === p.getId()))
                                    .map(product => {
                                        return (
                                            <DropdownMenu.Item

                                                key={product.getId()}
                                                onClick={() => {
                                                    setState(prev => {
                                                        prev.products?.push({
                                                            imgSrc: product.getImages()[0],
                                                            currency: product.getCurrency(),
                                                            cta: "Order Now!",
                                                            metadata: {
                                                                id: product.getId(),
                                                                name: product.getName(),
                                                                description: product.getDescription(),
                                                                images: product.getImages(),
                                                                updatedAt: new Date().toISOString(),
                                                                price: product.getPrice(),
                                                                stockQuantity: product.getStockQuantity(),
                                                                modifiers: product.getModifiers(),
                                                                currency: product.getCurrency(),
                                                            }
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
                                                        alt={product.getName()}
                                                        fallback={product.getName()}
                                                    />
                                                    <Text>{product.getName()}</Text>
                                                </Flex>
                                            </DropdownMenu.Item>
                                        )
                                    })
                            }
                        </Flex>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>

                <Box>
                    {
                        state.products?.map((product, index) => {
                            return (
                                <Card mb="2" key={product.metadata.id}>
                                    <EditorData
                                        disabled
                                        type={EditorDataType.TEXT}
                                        name="Title"
                                        value={product.metadata.name}
                                        onChange={data => { }}
                                    />

                                    <EditorData
                                        type={EditorDataType.TEXT}
                                        name="Button CTA"
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

                                    <Flex gap="2" align="center" wrap="wrap" justify="center">
                                        {project?.getProductById(product.metadata.id)?.getImages()?.map(image => {
                                            return (
                                                <Avatar
                                                    size={product.imgSrc === image ? "8" : "5"}
                                                    key={image}
                                                    src={image}
                                                    alt={product.cta}
                                                    fallback={"Not Available"}
                                                    onClick={() => {
                                                        setState(prev => {
                                                            prev.products[index] = {
                                                                ...prev.products[index],
                                                                imgSrc: image,
                                                            }

                                                            return {
                                                                ...prev,
                                                            }
                                                        })
                                                    }}
                                                />
                                            )
                                        })}
                                    </Flex>

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
