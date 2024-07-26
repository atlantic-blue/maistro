import React, { useEffect } from "react"
import { Avatar, Button, Card, Flex, Heading, Separator, Text } from "@radix-ui/themes"
import { TemplateCategory, TemplateComponentType, TemplateStruct } from "../../../templateTypes"
import env from "../../../../env";

import { Stripe, loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { shoppingCartGet } from "../../../Api/ShoppingCart/ShoppingCartGet";
import { ProductStruct, ShoppingCartItem, ShoppingCartStruct } from "../../../types";
import { productsGet } from "../../../Api/Products/productsGet";
import { PARAMS_SHOPPING_CART_ID, calculateItemTotal, clientStorage } from "../../SectionShoppingCart/SectionShoppingCartBasic/SectionShoppingCartBasic";
import { Currency, CurrencySymbol, fromSmallestUnit } from "../../../../Utils/currency";

let stripePromise: Promise<Stripe | null> | null = null
const getStripePromise = (accountId: string) => {
    if (stripePromise) {
        return stripePromise
    }

    stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || "", {
        stripeAccount: accountId,
    })
}

export interface SectionCheckoutBasicItem {
    quantity: number,
    price_data: {
        currency: string,
        unit_amount: string,
        product_data: {
            name: string,
            description: string,
            images: string[]
        }
    },
}

export interface SectionCheckoutStripeProps {
    "data-hydration-id"?: string
    projectId: string
    checkoutUrl: string

    returnUrl: string
    accountId: string

    enableShipping: boolean
    allowedCountries: string[]
    shippingOptions: Array<{
        shipping_rate_data: {
            display_name: string
            type: string
            fixed_amount: {
                amount: number
                currency: string
            }
        }
    }>
}

interface SectionCheckoutItemsProps {
    projectId: string
    onCreateOrder: (
        items: SectionCheckoutBasicItem[],
    ) => Promise<void>
    isLoading: boolean
}

const SectionCheckoutItems: React.FC<SectionCheckoutItemsProps> = (props) => {
    const params = new URLSearchParams(window.location.search)
    const shoppingCartId = params.get(PARAMS_SHOPPING_CART_ID)
    const [products, setProducts] = React.useState<ProductStruct[]>([])
    const [shoppingCart, setShoppingCart] = React.useState<ShoppingCartStruct>({
        id: "",
        createdAt: "",
        items: [],
    })
    const [shoppingCartItems, setShoppingCartItems] = React.useState<ShoppingCartItem[]>([])
    const [currency, setCurrency] = React.useState<Currency>(Currency.GBP)

    const init = async () => {
        if (!shoppingCartId) {
            return
        }

        const response = await shoppingCartGet({
            shoppingCartId,
        })

        if (response && response?.data) {
            setShoppingCart(response.data)
        } else {
            // TODO could not find shopping cart ID
        }
    }

    useEffect(() => {
        init()
    }, [shoppingCartId])

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

        const shoppingCartItems: ShoppingCartItem[] = []
        shoppingCart?.items?.reduce((prev, next) => {
            const p = products.find(p => p.id === next.productId)
            if (p) {
                prev.push({
                    quantity: next.quantity,
                    product: {
                        currency: p.currency,
                        description: p.description,
                        id: p.id,
                        images: p.images,
                        name: p.name,
                        price: p.price,
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
        setCurrency(shoppingCartItems[0].product.currency)
    }, [shoppingCart?.id, products.length > 0, JSON.stringify(shoppingCart.items)])

    const totalAmount = shoppingCartItems.reduce((prev, nextItem) => {
        const amount = prev + calculateItemTotal(nextItem)
        return amount
    }, 0)

    const onCreateOrder = () => {
        const checkoutItems: SectionCheckoutBasicItem[] = []
        shoppingCart?.items?.reduce((prev, next) => {
            const p = products.find(p => p.id === next.productId)
            if (p) {
                prev.push({
                    quantity: next.quantity,
                    price_data: {
                        currency: p.currency,
                        product_data: {
                            description: p.description,
                            name: p.name,
                            images: p.images
                        },
                        unit_amount: String(p.price),
                    }
                })

                next.modifiers.map((m) => {
                    const productModifier = p.modifiers.find(mod => mod.id === m.id)
                    if (!productModifier) {
                        return
                    }

                    prev.push({
                        quantity: m.quantity,
                        price_data: {
                            currency: p.currency,
                            product_data: {
                                description: productModifier?.description,
                                name: productModifier?.name,
                                images: [productModifier?.imgSrc]
                            },
                            unit_amount: String(productModifier.price),
                        }
                    })
                })
                return prev
            }

            return prev
        }, checkoutItems)

        props.onCreateOrder(checkoutItems)
    }

    return (
        <Card m="3" size="3">
            <Flex direction="column" gap="2">
                <Flex direction="column" gap="2">
                    {shoppingCartItems.map(shoppingCartItem => {
                        return (
                            <Flex key={shoppingCartItem?.product?.id} justify="between" align="center" gap="2" style={{ width: "100%" }}>
                                <Text >{shoppingCartItem?.quantity}x</Text>
                                <Avatar
                                    src={shoppingCartItem?.product?.images[0]}
                                    fallback={shoppingCartItem.product.name.charAt(0)}
                                    size="2"
                                />
                                <Flex direction="column" style={{ flex: "1", marginRight: "auto", textAlign: "left" }}>
                                    <Heading as="h4" size="4">
                                        {shoppingCartItem.product.name}
                                    </Heading>
                                    <Text as="span" size="2">
                                        {shoppingCartItem.product.modifiers.filter(m => {
                                            return shoppingCartItem.modifiers.findIndex(im => im.id === m.id) >= 0
                                        })
                                            .map(m => m.name).join(", ")
                                        }
                                    </Text>
                                </Flex>
                                <Text>
                                    {CurrencySymbol[shoppingCartItem.product.currency]}{' '}
                                    {
                                        fromSmallestUnit(calculateItemTotal(shoppingCartItem),
                                            shoppingCartItem.product.currency
                                        )
                                    }
                                </Text>
                            </Flex>
                        )
                    })}
                </Flex>
                <Separator my="3" size="4" />

                <Flex direction='column' justify="between" align="stretch" gap="2">
                    <Flex direction="row" justify="between" align="center">
                        <Text>SubTotal</Text>
                        <Text>
                            {CurrencySymbol[currency]} {' '}
                            {
                                fromSmallestUnit(
                                    totalAmount,
                                    currency
                                )
                            }
                        </Text>
                    </Flex>

                    <Button
                        onClick={onCreateOrder}
                        size="2"
                        loading={props.isLoading}
                    >
                        Confirm order & Authorize payment
                    </Button>
                </Flex>

            </Flex>
        </Card>
    )
}

const SectionCheckoutStripe: React.FC<SectionCheckoutStripeProps> = (props) => {
    const {
        accountId,
        projectId,
        returnUrl,
        checkoutUrl,
        enableShipping,
        shippingOptions,
        allowedCountries,
    } = props

    const [clientSecret, setClientSecret] = React.useState("")
    const stripePromise = getStripePromise(accountId)
    const [loading, setIsLoading] = React.useState(false)

    const onCreateOrder = async (items: SectionCheckoutBasicItem[]) => {
        setIsLoading(true)
        try {
            const response = await fetch(checkoutUrl, {
                method: "POST",
                body: JSON.stringify({
                    project_id: projectId,
                    account_id: accountId,
                    return_url: returnUrl,
                    line_items: items,
                    enable_shipping: enableShipping,
                    shipping_options: shippingOptions,
                    allowed_countries: allowedCountries,
                })
            }).then(response => response.json())

            setClientSecret(response.session.client_secret)
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    if (clientSecret && stripePromise) {
        return (
            <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ clientSecret }}
            >
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        )
    }

    return (
        <Flex
            direction="column" justify='center' align="center" mb="2"
            data-hydration-id={props["data-hydration-id"]}
        >
            <SectionCheckoutItems
                projectId={props.projectId}
                onCreateOrder={onCreateOrder}
                isLoading={loading}
            />
        </Flex>
    )
}

export const SectionCheckoutStripeItem: TemplateStruct<SectionCheckoutStripeProps> = {
    name: TemplateComponentType.CHECKOUT_STRIPE,
    Component: SectionCheckoutStripe,
    categories: [TemplateCategory.CHECKOUT],
    description: "Checkout Stripe",
    classNames: [
        // ...Object.values(styles),
        // ...Object.values(ButtonStyles),
    ],
    props: {
        accountId: "",
        projectId: "",
        returnUrl: "",
        checkoutUrl: env.api.payments.checkouts.create,
        enableShipping: true,
        allowedCountries: ["GB"],
        shippingOptions: [
            {
                shipping_rate_data: {
                    display_name: "Store Pickup",
                    type: "fixed_amount",
                    fixed_amount: {
                        amount: 0,
                        currency: "gbp"
                    }
                }
            },
            {
                shipping_rate_data: {
                    display_name: "Local Delivery",
                    type: "fixed_amount",
                    fixed_amount: {
                        amount: 500,
                        currency: "gbp"
                    }
                }
            }
        ]
    },
}

export default SectionCheckoutStripe