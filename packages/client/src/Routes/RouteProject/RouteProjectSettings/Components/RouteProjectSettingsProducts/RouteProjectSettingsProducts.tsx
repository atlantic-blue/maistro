import React from "react"
import { filter } from "rxjs"
import { useParams } from "react-router-dom"
import { Avatar, Box, Button, Card, Flex, Heading, Text, TextField } from "@radix-ui/themes"

import { ProjectsContext } from "../../../../../Projects"
import { Product } from "../../../../../Store/Product"
import EditorImage from "../../../../../Components/Editor/EditorImage"
import { EditorDataType } from "../../../../../Components/Editor/EditorData"
import { convertFileToBase64 } from "../../../../../Utils/toBase64"
import { ApiContext } from "../../../../../Api/ApiProvider"
import useObservable from "../../../../../Utils/Hooks/UseObservable"
import { ProjectMessageType } from "../../../../../types"
import { Project } from "../../../../../Store/Project"

const ProductViewer: React.FC<{ product: Product, projectId: string, project: Project }> = (props) => {
    const [product, setProduct] = React.useState(props.product)
    const { user } = React.useContext(ProjectsContext)
    const { api } = React.useContext(ApiContext)
    const [show, setShow] = React.useState(false)

    const onSave = async () => {
        const response = await api.products.updateById({
            token: user.getTokenId(),
            projectId: props.projectId,
            productId: product.getId(),
            ...product.getStruct(),
        })

        props.project.event$.next({
            type: ProjectMessageType.SET_PRODUCT,
            data: {
                ...response,
                id: product.getId(),
            }
        })
    }

    const onUploadFile = async (file: File): Promise<string> => {
        try {
            const maxSize = 5 * 1024 * 1024; // 5 MB limit
            if (file.size > maxSize) {
                // TODO app level error
                console.log(`File size should not exceed 5 MB.`)
                return ""
            }

            const fileBase64 = await convertFileToBase64(file)
            const { src } = await api.file.createFile({
                // token: user.getTokenId(),
                userId: user.getId(),
                projectId: props.projectId,
                fileContent: fileBase64,
                fileName: file.name,
                fileType: file.type,
            })

            return src
        } catch (error) {
            // TODO app level error
            console.log(error)
            return ""
        }
    }

    return (
        <Card>
            <Flex direction="row" gap="2" mb="2">
                <Button onClick={() => setShow(!show)} mr="auto" variant="outline">
                    {show ? "Less" : "More"}
                </Button>
                <Button onClick={onSave} ml="auto">
                    Save
                </Button>
            </Flex>

            <Flex direction="column" gap="2" mb="2">
                <Heading as="h3">Name</Heading>
                <TextField.Root
                    value={product.getName()}
                    onChange={event => {
                        setProduct(new Product({
                            ...product.getStruct(),
                            name: event.target.value
                        }))
                    }}
                />
            </Flex>

            {show ? <>
                <Flex direction="column" gap="2" mb="2">
                    <Heading as="h3">Description</Heading>
                    <TextField.Root
                        value={product.getDescription()}
                        onChange={event => {
                            setProduct(new Product({
                                ...product.getStruct(),
                                description: event.target.value
                            }))
                        }}
                    />
                </Flex>

                <Flex direction="column" gap="2" mb="2">
                    <Heading as="h3">Currency</Heading>
                    <TextField.Root
                        value={product.getCurrency()}
                        onChange={event => {
                            setProduct(new Product({
                                ...product.getStruct(),
                                currency: event.target.value
                            }))
                        }}
                    />
                </Flex>

                <Flex direction="column" gap="2" mb="2">
                    <Heading as="h3">Price</Heading>
                    <TextField.Root
                        value={product.getPrice()}
                        type="number"
                        onChange={event => {
                            setProduct(new Product({
                                ...product.getStruct(),
                                price: Number(event.target.value)
                            }))
                        }}
                    />
                </Flex>

                <Flex direction="column" gap="2" mb="2">
                    <Heading as="h3">Quantity</Heading>
                    <TextField.Root
                        value={product.getStockQuantity()}
                        type="number"
                        onChange={event => {
                            setProduct(new Product({
                                ...product.getStruct(),
                                stockQuantity: Number(event.target.value)
                            }))
                        }}
                    />
                </Flex>

                {/* <Flex direction="column" gap="2" mb="2">
                <Heading as="h3">Options</Heading>
                {
                    Object.values(product.getOptions()).map(option => {
                        return (
                            <Flex key={option}>
                                <Text>{option}</Text>
                            </Flex>
                        )
                    })
                }
            </Flex> */}

                <Flex direction="column" gap="2" mb="2">
                    <Heading as="h3">Images</Heading>

                    <EditorImage
                        type={EditorDataType.IMAGE}
                        name="Image"
                        onUploadFile={onUploadFile}
                        onChange={value => {
                            setProduct(new Product({
                                ...product.getStruct(),
                                images: [
                                    ...product.getImages(),
                                    value
                                ]
                            }))
                        }}
                    />

                    <Flex direction="row" gap="2" mb="2">
                        {
                            product.getImages().map(image => {
                                return (
                                    <Flex direction="column" justify="center">
                                        <Avatar
                                            key={image}
                                            size="9"
                                            src={image}
                                            fallback="Preview"
                                            alt="Preview"
                                            mb="2"
                                        />
                                        <Button variant="outline" size="1"
                                            onClick={() => {
                                                setProduct(new Product({
                                                    ...product.getStruct(),
                                                    images: [
                                                        ...product.getImages().filter(i => i !== image),
                                                    ]
                                                }))
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </Flex>
                                )
                            })
                        }
                    </Flex>

                </Flex>
            </> :
                null}
        </Card>
    )
}

const RouteProjectSettingsProducts: React.FC = () => {
    const { projects, user } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")
    const { api } = React.useContext(ApiContext)

    useObservable(project.event$.pipe(filter(event => event.type === ProjectMessageType.SET_PRODUCT)))

    if (!projectId) {
        return
    }

    const createProduct = async () => {
        const response = await api.products.create({
            token: user.getTokenId(),
            projectId,

            currency: "$",
            description: "Edit ME!",
            images: [],
            name: "Edit ME!",
            options: {},
            price: 0,
            stockQuantity: 0
        })

        project.event$.next({
            type: ProjectMessageType.SET_PRODUCT,
            data: response
        })
    }

    return (
        <>
            <Box>
                <Flex direction="column" gap="2" mb="2" justify="center">
                    <Button onClick={createProduct}>
                        Add Product
                    </Button>

                    {Object.values(project.getProducts())?.map(product => {
                        return (
                            <ProductViewer
                                key={product.getId()}
                                projectId={projectId}
                                product={product}
                                project={project}
                            />
                        )
                    })}
                </Flex>
            </Box>
        </>
    )
}

export default RouteProjectSettingsProducts
