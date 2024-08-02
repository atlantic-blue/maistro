import React from "react"
import { filter } from "rxjs"
import { useParams } from "react-router-dom"
import { Avatar, Box, Button, Card, Flex, Heading, Select, Text, TextField } from "@radix-ui/themes"
import * as uuid from "uuid"

import { ProjectsContext } from "../../../Projects"
import { Product } from "../../../Store/Product"
import EditorImage from "../../../Components/Editor/EditorImage"
import { EditorDataType } from "../../../Components/Editor/EditorData"
import { convertFileToBase64 } from "../../../Utils/toBase64"
import { ApiContext } from "../../../Api/ApiProvider"
import useObservable from "../../../Utils/Hooks/UseObservable"
import { ProjectMessageType } from "../../../types"
import { Project } from "../../../Store/Project"
import { Copy, PlusCircle, Trash2 } from "lucide-react"
import { DashIcon } from "@radix-ui/react-icons"
import { Currency, fromSmallestUnit, toSmallestUnit } from "../../../Utils/currency"
import Helmet from "../Components/Helmet/Helmet"

const ProductViewer: React.FC<{ product: Product, projectId: string, project: Project }> = (props) => {
    const [product, setProduct] = React.useState(props.product)
    const { user } = React.useContext(ProjectsContext)
    const { api } = React.useContext(ApiContext)
    const [show, setShow] = React.useState(false)
    const [loading, setIsLoading] = React.useState(false)

    const onSave = async () => {
        try {
            setIsLoading(true)
            const response = await api.products.updateById({
                token: user.getTokenId(),
                projectId: props.projectId,
                productId: product.getId(),
                ...product.getStruct(),
                currency: props.project.getCurrency(),
            })

            props.project.event$.next({
                type: ProjectMessageType.SET_PRODUCT,
                data: {
                    ...response,
                    id: product.getId(),
                }
            })
        } catch (error) {

        } finally {
            setIsLoading(false)
        }

    }

    const onCopy = async () => {
        try {
            setIsLoading(true)
            const response = await api.products.create({
                token: user.getTokenId(),
                projectId: props.projectId,
                ...product.getStruct(),
                name: `${product.getName()} (copy)`,
                currency: props.project.getCurrency(),
            })

            props.project.event$.next({
                type: ProjectMessageType.SET_PRODUCT,
                data: response
            })

        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true)
            await api.products.delete({
                token: user.getTokenId(),
                projectId: props.projectId,
                productId: product.getId(),
            })

            props.project.event$.next({
                type: ProjectMessageType.DELETE_PRODUCT,
                data: product.getId()
            })
        } catch (error) {

        } finally {
            setIsLoading(false)
        }

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
                <Flex direction="row" gap="3" mb="2">
                    <Button size="1" onClick={() => setShow(!show)} ml="auto" variant="surface" loading={loading}>
                        {show ? (
                            <DashIcon />
                        ) : <PlusCircle style={{ height: "25px", width: "15px" }} />}
                    </Button>
                    <Button size="1" onClick={onDelete} variant="ghost" loading={loading}>
                        <Flex gap="1" align="center">
                            <Trash2 />
                        </Flex>
                    </Button>
                    <Button size="1" onClick={onCopy} loading={loading} variant="ghost">
                        <Flex gap="1" align="center">
                            <Copy />
                            <Text as="span">Copy</Text>
                        </Flex>
                    </Button>
                    <Button size="1" onClick={onSave} loading={loading}>
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
                            <Text weight="bold">Price</Text>
                            <TextField.Root
                                value={
                                    fromSmallestUnit(
                                        product.getPrice(),
                                        product.getCurrency()
                                    )
                                }
                                type="number"
                                min={0}
                                onChange={event => {
                                    setProduct(new Product({
                                        ...product.getStruct(),
                                        price: Number(toSmallestUnit(Number(event.target.value), product.getCurrency()))
                                    }))
                                }}
                            />
                        </Flex>

                        <Flex gap="2" mb="2" justify="between">
                            <Text weight="bold">Quantity</Text>
                            <TextField.Root
                                value={product.getStockQuantity()}
                                type="number"
                                min={0}
                                onChange={event => {
                                    setProduct(new Product({
                                        ...product.getStruct(),
                                        stockQuantity: Number(event.target.value)
                                    }))
                                }}
                            />
                        </Flex>

                        <Flex direction="column" gap="2" mb="2">
                            <Text weight="bold">Images</Text>
                            <Flex direction="row" gap="2" mb="2" style={{ overflow: "scroll" }}>
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
                        </Flex>
                        <Flex direction="column">
                            <Flex gap="2" mb="2" justify="between">
                                <Text weight="bold">Modifiers</Text>

                                <Button
                                    size="1"
                                    onClick={() => {
                                        setProduct(new Product({
                                            ...product.getStruct(),
                                            modifiers: [
                                                {
                                                    id: uuid.v1(),
                                                    name: "Edit me!",
                                                    imgSrc: "",
                                                    price: 0,
                                                    description: "Edit me!"
                                                },
                                                ...product.getStruct().modifiers,
                                            ]
                                        }))
                                    }}
                                >
                                    Create Modifier
                                </Button>
                            </Flex>

                            <Flex direction="column" gap="2">
                                {
                                    product.getModifiers().map(m => {
                                        return (
                                            <Card key={m.id}>
                                                <Flex direction="column" gap="2">
                                                    <Text weight="bold" size="2">Name</Text>
                                                    <TextField.Root
                                                        value={m.name}
                                                        type="text"
                                                        onChange={event => {
                                                            setProduct(new Product({
                                                                ...product.getStruct(),
                                                                modifiers: product.getStruct().modifiers.map(mod => {
                                                                    if (m.id === mod.id) {
                                                                        return {
                                                                            ...mod,
                                                                            name: event.target.value
                                                                        }
                                                                    } else {
                                                                        return mod
                                                                    }
                                                                })
                                                            }))
                                                        }}
                                                    />

                                                    <Text weight="bold" size="2">Price</Text>
                                                    <TextField.Root
                                                        value={fromSmallestUnit(m.price, product.getCurrency())}
                                                        type="number"
                                                        onChange={event => {
                                                            setProduct(new Product({
                                                                ...product.getStruct(),
                                                                modifiers: product.getStruct().modifiers.map(mod => {
                                                                    if (m.id === mod.id) {
                                                                        return {
                                                                            ...mod,
                                                                            price: toSmallestUnit(Number(event.target.value), product.getCurrency())
                                                                        }
                                                                    } else {
                                                                        return mod
                                                                    }
                                                                })
                                                            }))
                                                        }}
                                                    />

                                                    <Text weight="bold" size="2">Description</Text>
                                                    <TextField.Root
                                                        value={m.description}
                                                        type="text"
                                                        onChange={event => {
                                                            setProduct(new Product({
                                                                ...product.getStruct(),
                                                                modifiers: product.getStruct().modifiers.map(mod => {
                                                                    if (m.id === mod.id) {
                                                                        return {
                                                                            ...mod,
                                                                            description: event.target.value
                                                                        }
                                                                    } else {
                                                                        return mod
                                                                    }
                                                                })
                                                            }))
                                                        }}
                                                    />

                                                    <Text weight="bold" size="2">Image</Text>
                                                    <Avatar
                                                        src={m.imgSrc}
                                                        size="5"
                                                        fallback={m.name}
                                                        alt="Preview"
                                                        m="auto"
                                                    />
                                                    <EditorImage
                                                        type={EditorDataType.IMAGE}
                                                        name="Image"
                                                        onUploadFile={onUploadFile}
                                                        onChange={value => {
                                                            setProduct(new Product({
                                                                ...product.getStruct(),
                                                                modifiers: product.getStruct().modifiers.map(mod => {
                                                                    if (m.id === mod.id) {
                                                                        return {
                                                                            ...mod,
                                                                            imgSrc: value
                                                                        }
                                                                    } else {
                                                                        return mod
                                                                    }
                                                                })
                                                            }))
                                                        }}
                                                    />

                                                    <Button
                                                        variant="outline"
                                                        size="1"
                                                        m="2"
                                                        onClick={() => {
                                                            setProduct(new Product({
                                                                ...product.getStruct(),
                                                                modifiers: product.getStruct().modifiers.filter(mod => mod.id === m.id)
                                                            }))
                                                        }}
                                                    >
                                                        Remove
                                                    </Button>
                                                </Flex>
                                            </Card>
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
    const [isLoading, setIsLoading] = React.useState(false)

    useObservable(project.event$.pipe(filter(event => (
        event.type === ProjectMessageType.SET_PRODUCT ||
        event.type === ProjectMessageType.DELETE_PRODUCT
    ))))

    if (!projectId) {
        return
    }

    const createProduct = async () => {
        const response = await api.products.create({
            token: user.getTokenId(),
            projectId,

            currency: project.getCurrency(),
            description: "Edit ME!",
            images: [],
            name: "Edit ME!",
            options: {},
            price: 0,
            stockQuantity: 0,
            modifiers: []
        })

        project.event$.next({
            type: ProjectMessageType.SET_PRODUCT,
            data: response
        })
    }

    // TODO ERROR HANDLING
    const onSetCurrency = async (currency: Currency) => {
        setIsLoading(true)
        api.projects.updateById({
            token: user.getTokenId(),
            projectId: project.getId(),
            name: project.getName(),
            url: project.getUrl(),
            theme: project.getTheme(),
            currency: currency,
        })
            .then(() => {
                project.event$.next({
                    type: ProjectMessageType.SET_CURRENCY,
                    data: currency
                })
            })
            .finally(() => {
                setIsLoading(false)

            })
    }

    return (
        <>
            <Helmet>
                <Box mt="5">
                    <Flex direction="column" gap="2" mb="2" justify="center" align="center">
                        <Flex gap="2" align="center" justify="center">
                            <Button onClick={createProduct} style={{ maxWidth: "300px" }} loading={isLoading}>
                                Add Product
                            </Button>
                            <Flex gap="2" mb="2" justify="between" align='center'>
                                <Text weight="bold">Currency</Text>
                                <Select.Root defaultValue={project.getCurrency()}
                                    onValueChange={onSetCurrency}
                                >
                                    <Select.Trigger />
                                    <Select.Content>
                                        <Select.Group>
                                            {
                                                Object
                                                    .values(Currency)
                                                    .map(currency => {
                                                        return (
                                                            <Select.Item
                                                                key={currency}
                                                                value={currency}
                                                            >
                                                                {currency}
                                                            </Select.Item>
                                                        )
                                                    })
                                            }
                                        </Select.Group>
                                    </Select.Content>
                                </Select.Root>
                            </Flex>
                        </Flex>

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
            </Helmet>
        </>
    )
}

export default RouteProjectSettingsProducts
