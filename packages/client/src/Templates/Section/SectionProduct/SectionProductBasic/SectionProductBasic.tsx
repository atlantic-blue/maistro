import React, { useEffect } from "react"
import { Avatar, Box, Button, Card, Checkbox, Dialog, Flex, Heading, ScrollArea, Spinner, Text } from "@radix-ui/themes"
import { TemplateCategory, TemplateComponentType, TemplateStruct } from "../../../templateTypes"
import { clientStorage } from "../../SectionShoppingCart/SectionShoppingCartBasic/SectionShoppingCartBasic"
import { MinusCircle, PlusCircle, Trash2, X } from "lucide-react"
import { shoppingCartCreate } from "../../../Api/ShoppingCart/shoppingCartCreate"
import { shoppingCartGet } from "../../../Api/ShoppingCart/ShoppingCartGet"
import { IShoppingCart, Modifier } from "../../../types"
import { shoppingCartPatch } from "../../../Api/ShoppingCart/ShoppingCartPatch"

interface Product {
    id: string

    title: string
    description: string
    imgSrc: string
    price: string
    currency: string
    cta: string
}

export enum MaistroEvent {
    PRODUCT_UPDATED = "__MAISTRO_SHOPPING_CART_UPDATED__",
    CART_UPDATED = "__MAISTRO_SHOPPING_CART_UPDATED__"
}

interface ProductQuantityProps {
    projectId: string
    productId: string
    quantity: number
    cta: string
}

const ProductQuantity: React.FC<ProductQuantityProps> = (props) => {
    const [loading, setLoading] = React.useState(false)
    const [quantity, setQuantity] = React.useState(props.quantity)

    const onItemIncrementQuantity = async () => {
        try {
            setLoading(true)
            const { shoppingCart } = clientStorage.get()
            let shoppingCartId = shoppingCart.id || ""
            if (!shoppingCartId) {
                const { data } = await shoppingCartCreate({
                    projectId: props.projectId,
                })

                clientStorage.set({
                    ...clientStorage.get(),
                    shoppingCart: {
                        id: shoppingCartId,
                        createdAt: data.createdAt || "",
                        items: data.items || []
                    }
                })

                if (data && data.id) {
                    shoppingCartId = data.id
                }
            }
            await shoppingCartPatch({
                productId: props.productId,
                shoppingCartId: shoppingCart.id,
                quantity: 1
            })
            setQuantity(quantity + 1)
            const event = new Event(MaistroEvent.PRODUCT_UPDATED)
            window.dispatchEvent(event);
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }


    const onItemSubtractQuantity = async () => {
        try {
            setLoading(true)
            const { shoppingCart } = clientStorage.get()
            if (!shoppingCart.id) {
                return
            }

            await shoppingCartPatch({
                productId: props.productId,
                shoppingCartId: shoppingCart.id,
                quantity: -1
            })
            const event = new Event(MaistroEvent.PRODUCT_UPDATED)
            window.dispatchEvent(event);
            setQuantity(quantity - 1)
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <Flex gap="3" justify="center" align="center" mt="2">
                <Spinner />
            </Flex>
        )
    }

    if (!quantity) {
        return (
            <Flex gap="3" justify="center" align="center" mt="2">
                <Button size="2" onClick={onItemIncrementQuantity}>
                    {props.cta}
                </Button>
            </Flex>
        )
    }

    return (
        <Flex gap="3" justify="center" align="center" mt="2">
            <Button
                size="2"
                variant="ghost"
                onClick={onItemSubtractQuantity}
            >
                {quantity === 1 ? (
                    <Trash2 />
                ) : (
                    <MinusCircle />
                )}
            </Button>
            <Text weight="bold" size="3" m="3">
                {quantity}
            </Text>
            <Button
                size="2"
                variant="ghost"
                onClick={onItemIncrementQuantity}
            >
                <PlusCircle />
            </Button>
        </Flex>
    )
}

const Product: React.FC<Product & {
    projectId: string,
    shoppingCart?: IShoppingCart,
    modifiers: Modifier[]
}> = (props) => {
    let quantity = 0
    if (props?.shoppingCart?.items) {
        quantity = props?.shoppingCart?.items.filter(i => i.productId === props.id)[0]?.quantity || 0
    }

    return (
        <Dialog.Root>
            <Card size="2" variant="surface">
                <Dialog.Trigger>
                    <Box width="300px">
                        <Flex mb="2" position="relative">
                            <img
                                src={props.imgSrc}
                                alt={props.title}
                                style={{
                                    display: 'block',
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: 200,
                                    backgroundColor: 'var(--gray-5)',
                                }}
                            />
                        </Flex>
                        <Flex mb="2" justify="between">
                            <Box>
                                <Heading size="4">
                                    {props.title}
                                </Heading>
                            </Box>
                            <Text size="6" weight="bold">
                                {props.currency}{props.price}
                            </Text>
                        </Flex>

                        <Flex mb="1">
                            <Text as="p" size="2" mb="10px">
                                {props.description}
                            </Text>
                        </Flex>

                    </Box>
                </Dialog.Trigger>
                <ProductQuantity
                    cta={props.cta}
                    productId={props.id}
                    projectId={props.projectId}
                    quantity={quantity}
                />
            </Card>

            <Dialog.Content maxWidth="600px">

                <Flex align="center" justify="end">
                    <Dialog.Close>
                        <Button
                            variant="ghost"
                        >
                            <X />
                        </Button>
                    </Dialog.Close>
                </Flex>

                <ScrollArea type="always" scrollbars="vertical" style={{ maxHeight: 600 }}>
                    <Flex direction="column" gap="1" justify="center">
                        <Avatar
                            src={props.imgSrc}
                            fallback={props.title}
                            size="9"
                            style={{ margin: "auto" }}
                        />

                        <Heading as="h3">
                            {props.title}
                        </Heading>

                        <Text as="div" mb="2">
                            {props.description}
                        </Text>

                        <Heading as="h6" mb="1" size="3">
                            Add Ons
                        </Heading>

                        {/* <Flex direction="column" gap="1">
                            {props.modifiers.map(modifier => {
                                return (
                                    <Button
                                        variant="ghost"
                                        style={{ width: "100%", padding: "10px 0" }}
                                        onClick={() => {
                                            if (item.modifierItems.find(mi => mi.modifier.id === modifier.id)) {
                                                setItem(prev => {
                                                    return {
                                                        ...prev,
                                                        modifierItems: prev.modifierItems.filter(i => i.modifier.id !== modifier.id)
                                                    }
                                                })
                                            } else {
                                                setItem(prev => {
                                                    return {
                                                        ...prev,
                                                        modifierItems: [
                                                            ...prev.modifierItems,
                                                            {
                                                                id: new Date().toISOString(),
                                                                quantity: 1,
                                                                modifier,
                                                            }
                                                        ]
                                                    }
                                                })
                                            }
                                        }}
                                    >
                                        <Flex direction="row" justify="between" align="center" gap="2" style={{ width: "90%" }}>
                                            <Checkbox
                                                checked={Boolean(item.modifierItems.find(mi => mi.modifier.id === modifier.id))}
                                            />
                                            <Avatar
                                                src={modifier.imgSrc}
                                                fallback={modifier.name.charAt(0)}
                                                size="3"
                                            />
                                            <Flex direction="column" style={{ marginRight: "auto", textAlign: "left" }}>
                                                <Text>{modifier.name}</Text>
                                                <Text>{modifier.description}</Text>
                                            </Flex>

                                            <Flex justify="center" align="center" gap="1">
                                                <Text>+</Text>
                                                <Text>{props.currencySymbol}</Text>
                                                <Text>{modifier.price}</Text>
                                            </Flex>

                                        </Flex>
                                    </Button>
                                )
                            })}
                        </Flex> */}
                    </Flex>
                </ScrollArea>

            </Dialog.Content>
        </Dialog.Root>
    )
}

export interface SectionProductsBasicProps {
    "data-hydration-id"?: string
    projectId: string
    products: Product[]
}

const SectionProductsBasic: React.FC<SectionProductsBasicProps> = (props) => {
    const [shoppingCart, setShoppingCart] = React.useState<IShoppingCart>()

    const shoppingCartUpdate = () => {
        const { shoppingCart } = clientStorage.get()
        if (!shoppingCart.id) {
            return
        }

        shoppingCartGet({
            shoppingCartId: shoppingCart.id,
        })
            .then(response => {
                if (!response.data) {
                    return
                }
                clientStorage.set({
                    ...clientStorage.get(),
                    shoppingCart: {
                        id: shoppingCart.id,
                        createdAt: response.data.createdAt || "",
                        items: response.data.items || []
                    }
                })
                setShoppingCart(response.data)
            })
    }

    useEffect(() => {
        shoppingCartUpdate()
    }, [])

    useEffect(() => {
        window.addEventListener(MaistroEvent.PRODUCT_UPDATED, shoppingCartUpdate);
        return () => {
            window.removeEventListener(MaistroEvent.PRODUCT_UPDATED, shoppingCartUpdate);
        }
    }, [])

    return (
        <Flex direction="column" justify='center' align="center" mb="2" data-hydration-id={props["data-hydration-id"]}>
            <Flex wrap="wrap" m="2" gap="3" align="stretch" justify="center">
                {props.products?.map(product => {
                    return (
                        <Product
                            key={`${product.title}-${Date.now()}`}
                            {...product}
                            projectId={props.projectId}
                            shoppingCart={shoppingCart}
                            modifiers={[]}
                        />
                    )
                })}
            </Flex>
        </Flex>
    )
}

export const SectionProductsBasicItem: TemplateStruct<SectionProductsBasicProps> = {
    name: TemplateComponentType.PRODUCTS_BASIC,
    Component: SectionProductsBasic,
    categories: [TemplateCategory.PRODUCT],
    description: "Product Basic",
    classNames: [
        // ...Object.values(styles),
        // ...Object.values(ButtonStyles),
    ],
    props: {
        projectId: "",
        products: [
            {
                id: "1",
                title: "Brownies",
                description: "The art and technique of arranging type to make written language legible, readable and appealing when displayed.",
                currency: "$",
                price: "123",
                imgSrc: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxM3x8ZGVzc2VydHxlbnwwfHx8fDE3MjAzMTI5ODV8MA&ixlib=rb-4.0.3&q=85",
                cta: "Add to cart"
            },
            {
                id: "2",
                title: "Macaroons",
                description: "The art and technique of arranging type to make written language legible, readable and appealing when displayed.",
                currency: "$",
                price: "123",
                imgSrc: "https://images.unsplash.com/photo-1558326567-98ae2405596b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxNXx8ZGVzc2VydHxlbnwwfHx8fDE3MjAzMTI5ODV8MA&ixlib=rb-4.0.3&q=85",
                cta: "Add to cart"
            },
            {
                id: "3",
                title: "Tart",
                description: "The art and technique of arranging type to make written language legible, readable and appealing when displayed.",
                currency: "$",
                price: "123",
                imgSrc: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxM3x8ZGVzc2VydHN8ZW58MHx8fHwxNzIwMzEzMjk5fDA&ixlib=rb-4.0.3&q=85",
                cta: "Add to cart"
            },
            {
                id: "4",
                title: "Pie",
                description: "The art and technique of arranging type to make written language legible, readable and appealing when displayed.",
                currency: "$",
                price: "123",
                imgSrc: "https://images.unsplash.com/photo-1560180474-e8563fd75bab?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxNHx8ZGVzc2VydHxlbnwwfHx8fDE3MjAzMTI5ODV8MA&ixlib=rb-4.0.3&q=85",
                cta: "Add to cart"
            }
        ],
    },
}

export default SectionProductsBasic