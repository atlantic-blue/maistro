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
import { PlusCircle } from "lucide-react"
import { DashIcon } from "@radix-ui/react-icons"

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
        <Box width="300px">
            <Card>
                <Flex direction="row" gap="2" mb="2">
                    <Button size="1" onClick={() => setShow(!show)} ml="auto" variant="surface">
                        {show ? (
                            <DashIcon />
                        ) : <PlusCircle style={{ height: "25px", width: "15px" }} />}
                    </Button>
                    <Button size="1" onClick={onSave}>
                        Save
                    </Button>
                </Flex>

                <Flex gap="2" mb="2" justify="between">
                    <Text weight="bold">Name</Text>
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

                {show ?
                    <Box>
                        <Flex gap="2" mb="2" justify="between">
                            <Text weight="bold">Description</Text>
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

                        <Flex gap="2" mb="2" justify="between">
                            <Text weight="bold">Currency</Text>
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

                        <Flex gap="2" mb="2" justify="between">
                            <Text weight="bold">Price</Text>
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

                        <Flex gap="2" mb="2" justify="between">
                            <Text weight="bold">Quantity</Text>
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
                <Text weight="bold">Options</Text>
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

                            <Flex direction="row" gap="2" mb="2" style={{overflow: "scroll"}}>
                                {
                                    product.getImages().map(image => {
                                        return (
                                            <Flex direction="column" justify="center" key={image}>
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
                    </Box> :
                    (
                        null
                    )
                }
            </Card>
        </Box>
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

                    <Flex wrap="wrap" justify='center' gap="2">
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
                </Flex>
            </Box>
        </>
    )
}

export default RouteProjectSettingsProducts
