import React, { useEffect } from 'react';
import { Avatar, Box, Button, Card, Dialog, Flex, Heading, Text } from '@radix-ui/themes';

import { TemplateStruct, TemplateCategory, TemplateComponentType } from '../../../templateTypes';
import { ShoppingCart, } from 'lucide-react';
import { ShoppingItem } from './SectionShoppingCartBasicItem';
import * as styles from "./SectionShoppingCartBasic.scss"
import { MaistroEvent } from '../../SectionProduct/SectionProductBasic/SectionProductBasic';
import { ShoppingCartStruct, ShoppingCartItem, MaistroClientStorage, ProductStruct } from '../../../types';
import { shoppingCartGet } from '../../../Api/ShoppingCart/ShoppingCartGet';
import { productsGet } from '../../../Api/Products/productsGet';
import { Currency, CurrencySymbol, fromSmallestUnit } from '../../../../Utils/currency';

export const calculateItemTotal = (shoppingCartItem: ShoppingCartItem) => {
    const modifiersTotal = shoppingCartItem.modifiers.reduce((prev, nextModifier) => {
        const productModifier = shoppingCartItem.product.modifiers.find(pm => pm.id === nextModifier.id)
        const modifierPrice = productModifier?.price || 0
        const modifiersTotal = modifierPrice ? shoppingCartItem.quantity * modifierPrice : modifierPrice;
        const amount = prev + modifiersTotal
        return amount
    }, 0)

    const itemTotal = shoppingCartItem.quantity * shoppingCartItem.product.price
    return itemTotal + modifiersTotal
}

export interface SectionShoppingCartBasicProps {
    "data-hydration-id"?: string
    projectId: string
    currency: Currency
    checkoutUrl: string
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
    const [products, setProducts] = React.useState<ProductStruct[]>([])
    const [shoppingCart, setShoppingCart] = React.useState<ShoppingCartStruct>({
        id: "",
        createdAt: "",
        items: [],
    })
    const [shoppingCartItems, setShoppingCartItems] = React.useState<ShoppingCartItem[]>([])

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

    const shoppingCartUpdate = async (input: ShoppingCartStruct) => {
        await fetch(`https://api.maistro.website/payments/shopping-carts/${input.id}`, {
            method: "PUT",
            body: JSON.stringify({
                items: input.items
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

    useEffect(() => {
        const { shoppingCart } = clientStorage.get()
        if (shoppingCart && shoppingCart.id) {
            shoppingCartGet({
                shoppingCartId: shoppingCart.id
            }).then(response => {
                if (response && response?.data) {
                    setShoppingCart(response.data)
                }
            })
        } else {
            shoppingCartCreate()
        }
    }, [])

    useEffect(() => {
        productsGet({
            projectId: props.projectId
        }).then(response => {
            if (response?.data) {
                clientStorage.set({
                    ...clientStorage.get(),
                    products: response.data
                })
                setProducts(response.data)
            }
        })
    }, [])


    useEffect(() => {
        if (!shoppingCart?.id || products.length === 0) {
            return
        }
        const shoppingCartItems: ShoppingCartItem[] = [];
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
                        modifiers: p.modifiers,
                    },
                    modifiers: next.modifiers,
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
                shoppingCartGet({
                    shoppingCartId: shoppingCart.id
                }).then(response => {
                    if (response && response?.data) {
                        setShoppingCart(response.data)
                    }
                })
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
            shoppingCart={shoppingCart}
            shoppingCartItems={shoppingCartItems}
            shoppingCartUpdate={shoppingCartUpdate}
        />
    )
}

export const PARAMS_SHOPPING_CART_ID = "shoppingCartId"

const SectionShoppingCartBasic: React.FC<SectionShoppingCartBasicProps & {
    shoppingCartUpdate: (shoppingCart: ShoppingCartStruct) => Promise<void>
    shoppingCart: ShoppingCartStruct
    shoppingCartItems: ShoppingCartItem[]
}> = (props) => {
    const [items, setItems] = React.useState(props.shoppingCartItems)
    const [loading, setIsLoading] = React.useState(false)

    const totalItems = items.length
    const totalAmount = items.reduce((prev, nextItem) => {
        const amount = prev + calculateItemTotal(nextItem)
        return amount
    }, 0)

    const onGoToCheckout = () => {
        window.location.assign(`${props.checkoutUrl}?${PARAMS_SHOPPING_CART_ID}=${props.shoppingCart.id}`)
    }

    useEffect(() => {
        setItems(props.shoppingCartItems)
    }, [JSON.stringify(props.shoppingCartItems)])

    const onItemRemove = async (item: ShoppingCartItem) => {
        try {
            setIsLoading(true)
            await props.shoppingCartUpdate({
                id: props.shoppingCart.id,
                items: [{
                    productId: item.product.id,
                    quantity: 0,
                    modifiers: item.modifiers
                }],
                createdAt: props.shoppingCart.createdAt,
            })

            setItems(prev => {
                return prev.filter(i => i !== item)
            })
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    const onItemUpdate = async (item: ShoppingCartItem) => {
        try {
            setIsLoading(true)
            await props.shoppingCartUpdate({
                id: props.shoppingCart.id,
                items: [{
                    productId: item.product.id,
                    quantity: item.quantity,
                    modifiers: item.modifiers
                }],
                createdAt: props.shoppingCart.createdAt,
            })
            setItems(prev => {
                return prev.map(i => i.product.id === item.product.id ? item : i)
            })
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    if (totalItems < 1) {
        return (
            <Box data-hydration-id={props["data-hydration-id"]}></Box>
        )
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
                                {CurrencySymbol[props.currency]} {fromSmallestUnit(totalAmount, props.currency)}
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
                                        currency={props.currency}
                                        shoppingCart={props.shoppingCart}
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
                                                        {item.product.modifiers.filter(m => {
                                                            return item.modifiers.findIndex(im => im.id === m.id) >= 0
                                                        })
                                                            .map(m => m.name).join(", ")
                                                        }
                                                    </Text>
                                                </Flex>
                                                <Text>
                                                    {CurrencySymbol[props.currency]}{' '}
                                                    {fromSmallestUnit(calculateItemTotal(item), props.currency)}
                                                </Text>
                                            </Flex>
                                        </Button>
                                    </ShoppingItem>
                                )
                            })}
                        </Flex>

                        <Card mt="2">
                            <Flex direction='column' justify="between" align="stretch" gap="2">
                                <Flex direction="row" justify="between" align="center">
                                    <Text>SubTotal</Text>
                                    <Text>
                                        {CurrencySymbol[props.currency]} {' '}
                                        {fromSmallestUnit(totalAmount, props.currency)}
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
        currency: Currency.GBP,
        checkoutUrl: "/checkout"
    },
}

export default SectionShoppingCartBasic;
