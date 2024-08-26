import React, { useEffect } from "react"
import { Avatar, Box, Button, Card, Checkbox, Dialog, Flex, Heading, ScrollArea, Spinner, Text } from "@radix-ui/themes"
import { TemplateCategory, TemplateComponentType, TemplateStruct } from "../../../templateTypes"
import { clientStorage } from "../../SectionShoppingCart/SectionShoppingCartBasic/SectionShoppingCartBasic"
import { MinusCircle, PlusCircle, Trash2, X } from "lucide-react"
import { shoppingCartCreate } from "../../../Api/ShoppingCart/shoppingCartCreate"
import { shoppingCartGet } from "../../../Api/ShoppingCart/ShoppingCartGet"
import { ShoppingCartStruct, ProductStruct, ShoppingCartItemModifierStruct, ProductModifierStruct } from "../../../types"
import { shoppingCartPatch } from "../../../Api/ShoppingCart/ShoppingCartPatch"
import { Currency, CurrencySymbol, fromSmallestUnit } from "../../../../Utils/currency"

interface Product {
    imgSrc: string
    currency: Currency
    cta: string

    metadata: ProductStruct
}

export enum MaistroEvent {
    PRODUCT_UPDATED = "__MAISTRO_SHOPPING_CART_UPDATED__",
    CART_UPDATED = "__MAISTRO_SHOPPING_CART_UPDATED__"
}

interface SectionProductBasicQuantityProps {
    projectId: string
    productId: string
    quantity: number
    cta: string
    shoppingCart?: ShoppingCartStruct,
}

const SectionProductBasicQuantity: React.FC<SectionProductBasicQuantityProps> = (props) => {
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
                shoppingCartId: shoppingCart.id,
                item: {
                    productId: props.productId,
                    quantity: 1,
                    modifiers: props.shoppingCart?.
                        items?.filter(i => i.productId === props.productId)
                        .map(i => i.modifiers).flat() || [],
                }
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
                shoppingCartId: shoppingCart.id,
                item: {
                    productId: props.productId,
                    quantity: -1,
                    modifiers: props.shoppingCart?.
                        items?.filter(i => i.productId === props.productId)
                        .map(i => i.modifiers).flat() || [],
                }
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

const SectionProductModifiersBasic: React.FC<{
    product: Product,
    shoppingCart?: ShoppingCartStruct,
}> = (props) => {
    const [isLoading, setIsLoading] = React.useState(false)
    const shoppingCartItem = props.shoppingCart?.items?.find(i => i.productId === props?.product?.metadata?.id)

    const itemModifiers = props.shoppingCart?.items
        ?.filter(i => i.productId === props?.product?.metadata?.id)
        ?.map(i => i.modifiers).flat() || []
    const [nextModifiers, setNextModifiers] = React.useState<ShoppingCartItemModifierStruct[]>(itemModifiers)

    const checked = (modifier: ProductModifierStruct) => nextModifiers?.find(im => im.id === modifier.id)

    const onSelectModifier = async (modifier: ProductModifierStruct) => {
        if (checked(modifier)) {
            setNextModifiers(prev => {
                return prev.filter(i => i.id !== modifier.id)
            })
        } else {
            setNextModifiers(prev => {
                return [
                    ...prev,
                    {
                        id: modifier.id,
                        quantity: 1,
                    }
                ]
            })
        }
    }

    const onUpdate = async () => {
        try {
            setIsLoading(true)
            await shoppingCartPatch({
                shoppingCartId: props.shoppingCart?.id || "",
                item: {
                    // add item if it doesn't exist
                    quantity: (shoppingCartItem?.quantity || 0) > 0 ? 0 : 1,
                    productId: props?.product?.metadata?.id,
                    modifiers: nextModifiers,
                }
            })
            const event = new Event(MaistroEvent.PRODUCT_UPDATED)
            window.dispatchEvent(event);
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    const onItemSubtractQuantity = async () => {
        try {
            setIsLoading(true)
            await shoppingCartPatch({
                shoppingCartId: props.shoppingCart?.id || "",
                item: {
                    quantity: -1,
                    productId: props?.product?.metadata?.id,
                    modifiers: nextModifiers,
                }
            })
            const event = new Event(MaistroEvent.PRODUCT_UPDATED)
            window.dispatchEvent(event);
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    const onItemIncrementQuantity = async () => {
        try {
            setIsLoading(true)
            await shoppingCartPatch({
                shoppingCartId: props.shoppingCart?.id || "",
                item: {
                    quantity: 1,
                    productId: props?.product?.metadata?.id,
                    modifiers: nextModifiers,
                }
            })
            const event = new Event(MaistroEvent.PRODUCT_UPDATED)
            window.dispatchEvent(event);
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Flex direction="column" gap="1">
            {props?.product?.metadata?.modifiers?.map(modifier => {
                return (
                    <Button
                        key={modifier.id}
                        variant="ghost"
                        style={{ width: "100%", padding: "10px 0" }}
                        onClick={() => onSelectModifier(modifier)}
                    >
                        <Flex direction="row" justify="between" align="center" gap="2" style={{ width: "90%" }}>
                            <Checkbox
                                checked={Boolean(checked(modifier))}
                            />
                            <Avatar
                                src={modifier?.imgSrc}
                                alt={modifier?.name}
                                fallback={modifier?.name?.charAt(0)}
                                size="3"
                            />
                            <Flex direction="column" style={{ marginRight: "auto", textAlign: "left" }}>
                                <Text>{modifier?.name}</Text>
                                <Text>{modifier?.description}</Text>
                            </Flex>

                            <Flex justify="center" align="center" gap="1">
                                <Text>+</Text>
                                <Text>{CurrencySymbol[props?.product?.currency]}</Text>
                                <Text>{fromSmallestUnit(modifier?.price, props?.product?.currency)}</Text>
                            </Flex>

                        </Flex>
                    </Button>
                )
            })}


            <Flex gap="3" justify="center" align="center">
                <Button
                    size="2"
                    variant="ghost"
                    onClick={onItemSubtractQuantity}
                    disabled={!shoppingCartItem?.quantity || (shoppingCartItem?.quantity < 1)}
                >
                    <MinusCircle />
                </Button>
                <Text weight="bold" size="3" m="3">
                    {shoppingCartItem?.quantity || 0}
                </Text>
                <Button
                    size="2"
                    variant="ghost"
                    onClick={onItemIncrementQuantity}
                >
                    <PlusCircle />
                </Button>
            </Flex>


            <Flex direction="column" gap="1" justify="center">
                <Button
                    size="2"
                    onClick={onUpdate}
                    loading={isLoading}
                >
                    Update
                </Button>
            </Flex>
        </Flex>
    )
}

const SectionProductBasic: React.FC<{
    projectId: string,
    shoppingCart?: ShoppingCartStruct,
    product: Product
}> = (props) => {
    const [currentImage, setCurrentImage] = React.useState(props.product.imgSrc)
    let quantity = 0
    if (props?.shoppingCart?.items) {
        quantity = props?.shoppingCart?.items.filter(i => i.productId === props.product?.metadata?.id)[0]?.quantity || 0
    }

    return (
        <Dialog.Root>
            <Card size="2" variant="surface">
                <Dialog.Trigger>
                    <Box width="300px">
                        <Flex mb="2" position="relative">
                            <img
                                src={props.product.imgSrc}
                                alt={props.product?.metadata?.name}
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
                                    {props.product?.metadata?.name}
                                </Heading>
                            </Box>
                            <Text size="6" weight="bold">
                                {CurrencySymbol[props?.product?.currency]}{fromSmallestUnit(props.product?.metadata?.price, props?.product?.currency)}
                            </Text>
                        </Flex>

                        <Flex mb="1">
                            <Text as="p" size="2" mb="10px">
                                {props?.product?.metadata?.description}
                            </Text>
                        </Flex>

                    </Box>
                </Dialog.Trigger>
                <SectionProductBasicQuantity
                    cta={props?.product?.cta}
                    productId={props?.product?.metadata?.id}
                    projectId={props?.projectId}
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
                        <img
                            src={currentImage}
                            alt={props.product?.metadata?.name}
                            style={{
                                display: 'block',
                                objectFit: 'cover',
                                width: '80%',
                                height: 200,
                                margin: "auto",
                                backgroundColor: 'var(--gray-5)',
                            }}
                        />

                        <Flex m="2" gap="2" justify="center">
                            {props?.product?.metadata?.images.map(i => {
                                return (
                                    <Avatar
                                        size="3"
                                        src={i}
                                        key={i}
                                        fallback={props?.product?.metadata?.name}
                                        alt={props?.product?.metadata?.name}
                                        onClick={() => {
                                            setCurrentImage(i)
                                        }}
                                    />
                                )
                            })}
                        </Flex>

                        <Heading as="h3">
                            {props?.product?.metadata?.name}
                        </Heading>

                        <Text as="div" mb="2">
                            {props?.product?.metadata?.description}
                        </Text>

                        {
                            props?.product?.metadata?.modifiers?.length ? (
                                <Heading as="h6" mb="1" size="3">
                                    Add Ons
                                </Heading>
                            ) : null
                        }

                        <SectionProductModifiersBasic
                            key={props.product?.metadata?.id}
                            product={props.product}
                            shoppingCart={props.shoppingCart}
                        />

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
    const [shoppingCart, setShoppingCart] = React.useState<ShoppingCartStruct>()

    const shoppingCartSet = () => {
        const { shoppingCart } = clientStorage.get()
        if (!shoppingCart || !shoppingCart?.id) {
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
        shoppingCartSet()
    }, [])

    useEffect(() => {
        window.addEventListener(MaistroEvent.PRODUCT_UPDATED, shoppingCartSet);
        return () => {
            window.removeEventListener(MaistroEvent.PRODUCT_UPDATED, shoppingCartSet);
        }
    }, [])

    return (
        <Flex direction="column" justify='center' align="center" mb="2" data-hydration-id={props["data-hydration-id"]}>
            <Flex wrap="wrap" m="2" gap="3" align="stretch" justify="center">
                {props.products?.map(product => {
                    return (
                        <SectionProductBasic
                            key={`${product.metadata?.id}-${Date.now()}`}
                            projectId={props.projectId}
                            shoppingCart={shoppingCart}
                            product={product}
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
                imgSrc: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxM3x8ZGVzc2VydHxlbnwwfHx8fDE3MjAzMTI5ODV8MA&ixlib=rb-4.0.3&q=85",
                cta: "Add to cart",
                currency: Currency.GBP,
                metadata: {
                    id: "1",
                    name: "Brownies",
                    description: "The art and technique of arranging type to make written language legible, readable and appealing when displayed.",
                    stockQuantity: 100,
                    price: 123,
                    images: [
                        "https://images.unsplash.com/photo-1558326567-98ae2405596b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxNXx8ZGVzc2VydHxlbnwwfHx8fDE3MjAzMTI5ODV8MA&ixlib=rb-4.0.3&q=85",
                    ],
                    modifiers: [],
                    updatedAt: new Date().toISOString(),
                },
            },
            {
                metadata: {
                    id: "2",
                    name: "Macaroons",
                    description: "The art and technique of arranging type to make written language legible, readable and appealing when displayed.",
                    images: [
                        "https://images.unsplash.com/photo-1558326567-98ae2405596b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxNXx8ZGVzc2VydHxlbnwwfHx8fDE3MjAzMTI5ODV8MA&ixlib=rb-4.0.3&q=85",
                    ],
                    modifiers: [{
                        id: "1",
                        description: "peach flavour",
                        imgSrc: "https://images.unsplash.com/photo-1558326567-98ae2405596b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxNXx8ZGVzc2VydHxlbnwwfHx8fDE3MjAzMTI5ODV8MA&ixlib=rb-4.0.3&q=85",
                        name: "peach",
                        price: 20
                    }],
                    stockQuantity: 11,
                    price: 123,
                    updatedAt: new Date().toISOString(),
                },
                currency: Currency.GBP,
                imgSrc: "https://images.unsplash.com/photo-1558326567-98ae2405596b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxNXx8ZGVzc2VydHxlbnwwfHx8fDE3MjAzMTI5ODV8MA&ixlib=rb-4.0.3&q=85",
                cta: "Add to cart",
            },
            {
                currency: Currency.GBP,
                imgSrc: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxM3x8ZGVzc2VydHN8ZW58MHx8fHwxNzIwMzEzMjk5fDA&ixlib=rb-4.0.3&q=85",
                cta: "Add to cart",
                metadata: {
                    id: "3",
                    stockQuantity: 11,
                    price: 123,
                    updatedAt: new Date().toISOString(),
                    name: "Tart",
                    description: "The art and technique of arranging type to make written language legible, readable and appealing when displayed.",
                    images: [
                        "https://images.unsplash.com/photo-1558326567-98ae2405596b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxNXx8ZGVzc2VydHxlbnwwfHx8fDE3MjAzMTI5ODV8MA&ixlib=rb-4.0.3&q=85",
                    ],
                    modifiers: [],
                }
            },
            {
                currency: Currency.GBP,
                imgSrc: "https://images.unsplash.com/photo-1560180474-e8563fd75bab?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxNHx8ZGVzc2VydHxlbnwwfHx8fDE3MjAzMTI5ODV8MA&ixlib=rb-4.0.3&q=85",
                cta: "Add to cart",
                metadata: {
                    id: "4",
                    name: "Pie",
                    images: [
                        "https://images.unsplash.com/photo-1558326567-98ae2405596b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxNXx8ZGVzc2VydHxlbnwwfHx8fDE3MjAzMTI5ODV8MA&ixlib=rb-4.0.3&q=85",
                    ],
                    description: "The art and technique of arranging type to make written language legible, readable and appealing when displayed.",
                    stockQuantity: 11,
                    price: 123,
                    updatedAt: new Date().toISOString(),
                    modifiers: []
                }
            }
        ],
    },
}

export default SectionProductsBasic