import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Card, Dialog, Flex, Heading, Text } from '@radix-ui/themes';

import { TemplateStruct, TemplateCategory, TemplateComponentType } from '../../../templateTypes';
import { ShoppingCart, } from 'lucide-react';
import { ShoppingItem } from './SectionShoppingCartBasicItem';
import * as styles from "./SectionShoppingCartBasic.scss"
import { MaistroEvent } from '../../SectionProduct/SectionProductBasic/SectionProductBasic';
import { IShoppingCart, Item, MaistroClientStorage, Modifier, Product } from '../../../types';

export const calculateItemTotal = (item: Item) => {
    const modifiersTotal = item.modifierItems.reduce((prev, nextModifier) => {
        const modifiersTotal = item.quantity * nextModifier.modifier.price
        const amount = prev + modifiersTotal
        return amount
    }, 0)

    const itemTotal = item.quantity * item.product.price
    return itemTotal + modifiersTotal
}

export interface SectionShoppingCartBasicProps {
    "data-hydration-id"?: string
    projectId: string

    items: Item[]
    // TODO: this needs to be fetched later from the product modifiers
    modifiers: Modifier[]
    currencySymbol: string
    deliveryFee: number
    serviceFee: number
}

class CartStorage {
    private key: string
    private storage: Storage

    constructor(key: string, storage: Storage = localStorage) {
        this.key = key
        this.storage = storage
    }

    get(): MaistroClientStorage {
        return JSON.parse(
            this.storage.getItem(this.key) || '{}'
        )
    }

    set(value: MaistroClientStorage) {
        const data = JSON.stringify(value)
        // IDEMPOTENT
        this.storage.removeItem(this.key)
        this.storage.setItem(this.key, data);
    }
}

const STORAGE_KEY = "MAISTRO_CLIENT"
export const clientStorage = new CartStorage(STORAGE_KEY)

enum ShoppingCartErrors {
    UNABLE_TO_CREATE = "UNABLE TO CREATE SHOPPING CART",
    UNABLE_TO_GET = "UNABLE TO GET SHOPPING CART",
    PRODUCTS_UNABLE_TO_GET = "UNABLE TO GET PRODUCTS",
}

const SectionShoppingCartBasicContainer: React.FC<SectionShoppingCartBasicProps> = (props) => {
    const [error, setError] = React.useState("")
    const [products, setProducts] = React.useState<Product[]>([])
    const [shoppingCart, setShoppingCart] = React.useState<IShoppingCart>({
        id: "",
        createdAt: "",
        items: [],
    })
    const [shoppingCartItems, setShoppingCartItems] = React.useState<Item[]>([])

    const shoppingCartCreate = async () => {
        await fetch("https://api.maistro.website/payments/shopping-carts", {
            method: "POST",
            body: JSON.stringify({
                projectId: props.projectId,
            })
        })
            .then(response => response.json())
            .then(response => {
                if (response && response.id) {
                    setShoppingCart({
                        id: response.id,
                        createdAt: response.createdAt,
                        items: response.items || []
                    })
                    clientStorage.set({
                        ...clientStorage.get(),
                        shoppingCart: {
                            id: response.id,
                            createdAt: response.createdAt,
                            items: response.items || []
                        }
                    })
                    return
                }
                setError(ShoppingCartErrors.UNABLE_TO_CREATE)
            })
            .catch(e => {
                setError(ShoppingCartErrors.UNABLE_TO_CREATE)
            })
    }

    const shoppingCartGet = async (shoppingCartId: string) => {
        await fetch(`https://api.maistro.website/payments/shopping-carts/${shoppingCartId}`, {
            method: "GET",
        })
            .then(response => response.json())
            .then((response: IShoppingCart[]) => {
                if (!response) {
                    return setError(ShoppingCartErrors.UNABLE_TO_GET)
                }

                setShoppingCart({
                    ...response.filter(r => r.id === shoppingCartId)[0],
                })
            })
            .catch(e => {
                setError(ShoppingCartErrors.UNABLE_TO_GET)
            })
    }

    const shoppingCartUpdate = async (
        shoppingCartId: string,
        items: Array<{
            quantity: number,
            productId: string
        }>
    ) => {
        await fetch(`https://api.maistro.website/payments/shopping-carts/${shoppingCartId}`, {
            method: "PUT",
            body: JSON.stringify({
                items
            })
        })
            .then(response => response.json())
            .then(response => {
                if (response && response.id) {
                    setShoppingCart({
                        ...response,
                    })
                    clientStorage.set({
                        ...clientStorage.get(),
                        shoppingCart: {
                            id: response.id,
                            createdAt: response.createdAt,
                            items: response.items || []
                        }
                    })
                    const event = new Event(MaistroEvent.PRODUCT_UPDATED)
                    window.dispatchEvent(event)
                    return
                }
                setError(ShoppingCartErrors.UNABLE_TO_GET)
            })
            .catch(e => {
                setError(ShoppingCartErrors.UNABLE_TO_GET)
            })
    }

    const productsGet = async (projectId: string) => {
        await fetch(`https://api.maistro.website/v1/projects/${projectId}/products`, {
            method: "GET",
        })
            .then(response => response.json())
            .then((response: Product[]) => {
                if (response && Array.isArray(response)) {
                    clientStorage.set({
                        ...clientStorage.get(),
                        products: response
                    })
                    setProducts(response)
                    return
                }
                setError(ShoppingCartErrors.PRODUCTS_UNABLE_TO_GET)
            })
            .catch(e => {
                setError(ShoppingCartErrors.PRODUCTS_UNABLE_TO_GET)
            })
    }

    useEffect(() => {
        const { shoppingCart } = clientStorage.get()
        if (shoppingCart && shoppingCart.id) {
            shoppingCartGet(shoppingCart.id)
        } else {
            shoppingCartCreate()
        }
    }, [])

    useEffect(() => {
        productsGet(props.projectId)
    }, [])


    useEffect(() => {
        if (!shoppingCart?.id || products.length === 0) {
            return
        }
        const shoppingCartItems: Item[] = [];
        shoppingCart?.items?.reduce((prev, next) => {
            const p = products.find(p => p.id === next.productId)
            if (p) {
                prev.push({
                    quantity: next.quantity,
                    product: {
                        id: p.id,
                        description: p.description,
                        name: p.name,
                        price: p.price,
                        images: p.images,
                        stockQuantity: p.stockQuantity,
                        updatedAt: p.updatedAt,
                    },
                    // TODO
                    modifierItems: []
                })
                return prev
            }
            return prev
        }, shoppingCartItems)

        setShoppingCartItems(shoppingCartItems)
    }, [shoppingCart?.id, products.length > 0, JSON.stringify(shoppingCart.items)])

    useEffect(() => {
        const setListener = () => {
            const { shoppingCart } = clientStorage.get()
            if (shoppingCart && shoppingCart.id) {
                shoppingCartGet(shoppingCart.id)
            }
        }
        window.addEventListener(MaistroEvent.PRODUCT_UPDATED, setListener);
        return () => {
            window.removeEventListener(MaistroEvent.PRODUCT_UPDATED, setListener);
        }
    }, [])

    return (
        <SectionShoppingCartBasic
            {...props}
            items={shoppingCartItems}
            shoppingCart={shoppingCart}
            shoppingCartUpdate={shoppingCartUpdate}
        />
    )
}

const SectionShoppingCartBasic: React.FC<SectionShoppingCartBasicProps & {
    shoppingCartUpdate: (
        shoppingCartId: string,
        items: Array<{
            quantity: number;
            productId: string;
        }>) => Promise<void>
    shoppingCart: IShoppingCart
}> = (props) => {
    const [items, setItems] = React.useState(props.items)
    const [loading, setIsLoading] = React.useState(false)
    const currencySymbol = props.currencySymbol


    // TODO toggle fees
    const totalItems = items.length
    const totalAmount = items.reduce((prev, nextItem) => {
        const amount = prev + calculateItemTotal(nextItem)
        return amount
    }, 0) + props.deliveryFee + props.serviceFee

    const onGoToCheckout = () => {
        // TODO redirect to checkout
        alert("checkout")
    }

    useEffect(() => {
        setItems(props.items)
    }, [JSON.stringify(props.items)])

    const onItemRemove = async (item: Item) => {
        try {
            setIsLoading(true)
            await props.shoppingCartUpdate(props.shoppingCart.id, [{
                productId: item.product.id,
                quantity: 0,
            }])
            setItems(prev => {
                return prev.filter(i => i !== item)
            })
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    const onItemUpdate = async (item: Item) => {
        try {
            setIsLoading(true)
            await props.shoppingCartUpdate(
                props.shoppingCart.id, [{
                    productId: item.product.id,
                    quantity: item.quantity,
                }]
            )
            setItems(prev => {
                return prev.map(i => i.product.id === item.product.id ? item : i)
            })
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Box data-hydration-id={props["data-hydration-id"]}>
            <Dialog.Root>
                <Dialog.Trigger>
                    <Button
                        className={styles.button}
                        size="3"
                        style={{
                            width: "90%",
                            position: 'fixed',
                            bottom: "15px",
                            zIndex: "30",
                            left: "5%",
                        }}
                    >
                        <Flex justify="between" align="center" gap="2" style={{ width: "100%" }}>
                            <Flex align="center" gap="2">
                                <ShoppingCart />
                                <Text weight="bold">
                                    Cart ({totalItems})
                                </Text>
                            </Flex>
                            <Text weight="bold">
                                {currencySymbol} {totalAmount.toFixed(2)}
                            </Text>
                        </Flex>
                    </Button>
                </Dialog.Trigger>

                <Dialog.Content maxWidth="600px">
                    <Dialog.Title>
                        <Flex justify='center'>
                            <Text weight="bold">
                                Your Order
                            </Text>
                        </Flex>
                    </Dialog.Title>

                    <Flex gap="3" direction='column'>
                        <Flex gap="1" direction='column'>
                            {items.map(item => {
                                return (
                                    <ShoppingItem
                                        key={item.product.id}
                                        item={item}
                                        modifiers={props.modifiers}
                                        onItemRemove={onItemRemove}
                                        onItemUpdate={onItemUpdate}
                                    >
                                        <Button
                                            size="3"
                                            variant="ghost"
                                            loading={loading}
                                        >
                                            <Flex justify="between" align="center" gap="2" style={{ width: "100%" }}>
                                                <Text >{item.quantity}x</Text>
                                                <Avatar
                                                    src={item.product.images[0]}
                                                    fallback={item.product.name.charAt(0)}
                                                    size="2"
                                                />
                                                <Flex direction="column" style={{ flex: "1", marginRight: "auto", textAlign: "left" }}>
                                                    <Heading as="h4" size="4">
                                                        {item.product.name}
                                                    </Heading>
                                                    <Text as="span" size="2">
                                                        {item.modifierItems.map(mi => mi.modifier.name).join(", ")}
                                                    </Text>
                                                </Flex>
                                                <Text>
                                                    {currencySymbol} {' '}
                                                    {calculateItemTotal(item)}
                                                </Text>
                                            </Flex>
                                        </Button>
                                    </ShoppingItem>
                                )
                            })}
                        </Flex>

                        <Flex gap="3" direction='column'>
                            <Heading as="h6">
                                Fees
                            </Heading>
                            <Card>
                                <Flex direction='column' justify="between" align="stretch" gap="2">
                                    <Flex direction="row" justify="between" align="center">
                                        <Text>Delivery Fee</Text>
                                        <Text>
                                            {currencySymbol} {' '}
                                            {props.deliveryFee}
                                        </Text>
                                    </Flex>
                                    <Flex direction="row" justify="between" align="center">
                                        <Text>Service Fee</Text>
                                        <Text>
                                            {currencySymbol} {' '}
                                            {props.serviceFee}
                                        </Text>
                                    </Flex>
                                </Flex>
                            </Card>
                        </Flex>


                        <Card mt="2">
                            <Flex direction='column' justify="between" align="stretch" gap="2">
                                <Flex direction="row" justify="between" align="center">
                                    <Text>Order Total</Text>
                                    <Text>
                                        {currencySymbol} {' '}
                                        {totalAmount.toFixed(2)}
                                    </Text>
                                </Flex>

                                <Dialog.Close>
                                    <Button
                                        onClick={onGoToCheckout}
                                    >
                                        Go to Checkout
                                    </Button>
                                </Dialog.Close>
                            </Flex>
                        </Card>

                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
        </Box>
    );
};

export const SectionShoppingCartsBasicItem: TemplateStruct<SectionShoppingCartBasicProps> = {
    name: TemplateComponentType.SHOPPING_CART_BASIC,
    Component: SectionShoppingCartBasicContainer,
    categories: [TemplateCategory.SHOPPING_CART],
    description: "Shopping Cart basic",
    classNames: [

    ],
    props: {
        projectId: "",
        currencySymbol: "$",
        deliveryFee: 5,
        serviceFee: 0.99,
        modifiers: [
            {
                id: "12345",
                imgSrc: "https://images.unsplash.com/photo-1505253892657-6fcc8796949c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxNXx8c3dlZXQlMkNzaW58ZW58MHx8fHwxNzE5OTYwMzg3fDA&ixlib=rb-4.0.3&q=85",
                name: "sauce",
                description: "best sauce in town",
                price: 0.20
            },
            {
                id: "123456",
                imgSrc: "https://images.unsplash.com/photo-1485745655111-3272a37e76a5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxNHx8c3dlZXQlMkNzaW58ZW58MHx8fHwxNzE5OTYwMzg3fDA&ixlib=rb-4.0.3&q=85",
                name: "cheese",
                description: "best cheese in town",
                price: 1
            }
        ],
        items: [
            {
                quantity: 2,
                product: {
                    id: "1",
                    images: [
                        "https://images.unsplash.com/photo-1468218620578-e8d78dcda7b1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxNnx8c3dlZXQlMkNzaW58ZW58MHx8fHwxNzE5OTYwMzg3fDA&ixlib=rb-4.0.3&q=85",
                    ],
                    name: "tart",
                    description: "best tarts in town",
                    price: 20,
                    updatedAt: "",
                    stockQuantity: 1
                },
                modifierItems: [
                    {
                        id: new Date().toISOString(),
                        quantity: 1,
                        modifier: {
                            id: "12345",
                            imgSrc: "https://images.unsplash.com/photo-1505253892657-6fcc8796949c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxNXx8c3dlZXQlMkNzaW58ZW58MHx8fHwxNzE5OTYwMzg3fDA&ixlib=rb-4.0.3&q=85",
                            name: "sauce",
                            description: "best sauce in town",
                            price: 0.20
                        }
                    }
                ]
            }
        ]
    },
}

export default SectionShoppingCartBasic;
