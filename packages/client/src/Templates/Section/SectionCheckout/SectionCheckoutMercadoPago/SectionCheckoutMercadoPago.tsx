import React from 'react';
import {
    Payment,
    initMercadoPago,
    StatusScreen,
} from '@mercadopago/sdk-react';

import { TPaymentType } from '@mercadopago/sdk-react/bricks/payment/type';
import { TemplateCategory, TemplateComponentType, TemplateStruct } from '../../../templateTypes';
import { Avatar, Box, Button, Card, Flex, Heading, Separator, Text, TextField } from '@radix-ui/themes';
import { PARAMS_SHOPPING_CART_ID, calculateItemTotal, clientStorage } from '../../SectionShoppingCart/SectionShoppingCartBasic/SectionShoppingCartBasic';
import { Currency, CurrencySymbol, fromSmallestUnit } from '../../../../Utils/currency';
import { ProductStruct, ShoppingCartItem, ShoppingCartStruct } from '../../../types';
import { shoppingCartGet } from '../../../Api/ShoppingCart/ShoppingCartGet';
import { productsGet } from '../../../Api/Products/productsGet';

let started = false
const getMercadoPago = (key: string) => {
    if (started) {
        return
    }
    started = true
    initMercadoPago(key)
}

interface MercadoPagoData {
    payer: {
        first_name: string
        last_name: string
        phone: {
            area_code: string
            number: string
        },
    }
    shippingOptions: {
        receiver_address: {
            zip_code: string
            street_name: string
            city_name: string
        },
        cost: number,
    }
    items: Array<{
        id: string,
        unit_price: number,
        quantity: number,
        title: string,
        description: string,
        picture_url: string,
        currency_id: string,
        category_id: string,
    }>,
}

export interface SectionCheckoutMercadoPagoProps {
    "data-hydration-id"?: string
    projectId: string
    checkoutUrl: string

    returnUrl: string
    paymentUrl: string

    /**
     * Mercado Pago 
     */
    publicKey: string
    accessToken: string
    statementDescriptor: string

    enableShipping: boolean
}

const SectionCheckoutMercadoPago: React.FC<SectionCheckoutMercadoPagoProps> = (props) => {
    getMercadoPago(props.publicKey)
    const [loading, setIsLoading] = React.useState(false)
    const [preferenceId, setPreferenceId] = React.useState("")
    const [paymentId, setPaymentId] = React.useState("")

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
    const [mercadoPagoData, setMercadoPagoData] = React.useState<MercadoPagoData>({
        items: [],
        payer: {
            first_name: "",
            last_name: "",
            phone: {
                area_code: "",
                number: "",
            }
        },
        shippingOptions: {
            cost: 0,
            receiver_address: {
                city_name: "",
                street_name: "",
                zip_code: ""
            }
        }
    })

    const totalAmount = shoppingCartItems.reduce((prev, nextItem) => {
        const amount = prev + calculateItemTotal(nextItem)
        return amount
    }, 0)

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

    React.useEffect(() => {
        init()
    }, [shoppingCartId])


    React.useEffect(() => {
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

    React.useEffect(() => {
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

    const initialization: TPaymentType["initialization"] = {
        amount: totalAmount,
        preferenceId,
    };

    const customization: TPaymentType["customization"] = {
        paymentMethods: {
            creditCard: "all",
            debitCard: "all",
            // ticket: "all",
            // mercadoPago: "all"
        },
    };

    const onCreateOrder = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(props.checkoutUrl, {
                method: "POST",
                body: JSON.stringify({
                    token_id: props.accessToken,
                    project_id: props.projectId,
                    return_url: props.returnUrl,
                    shopping_cart_id: shoppingCart?.id,
                    line_items: shoppingCartItems.map(item => {
                        return {
                            id: item.product.id,
                            title: item.product.name,
                            description: item.product.description,
                            picture_url: item.product.images[0],
                            quantity: item.quantity,
                            unit_price: item.product.price,
                            currency_id: item.product.currency,
                        }
                    }),
                    enable_shipping: props.enableShipping,
                    // shipping_options: props.shippingOptions,
                })
            }).then(response => response.json())

            setPreferenceId(response.id)
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    const onError = async (error) => {
        // callback llamado para todos los casos de error de Brick
        console.log(error);
    };

    const onSubmit: TPaymentType["onSubmit"] = async (
        data,
        other,
    ) => {
        fetch(props.paymentUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                project_id: props.projectId,
                token_id: props.accessToken,
                form_data: data.formData,
                statement_descriptor: props.statementDescriptor,
                checkout_id: preferenceId,
                line_items: shoppingCartItems.map(item => {
                    return {
                        id: item.product.id,
                        title: item.product.name,
                        description: item.product.description,
                        picture_url: item.product.images[0],
                        quantity: item.quantity,
                        unit_price: item.product.price,
                        category_id: "maistro" // TODO do we need this?
                    }
                }),
                shipping_options: {
                    receiver_address: mercadoPagoData.shippingOptions.receiver_address,
                },
                payer: {
                    first_name: mercadoPagoData.payer.first_name,
                    last_name: mercadoPagoData.payer.last_name,
                    phone: {
                        area_code: mercadoPagoData.payer.phone.area_code,
                        number: mercadoPagoData.payer.phone.number,
                    },
                }
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    setPaymentId("ERROR")
                }

                return response.json()
            })
            .then((response) => {
                if (response.id) {
                    setPaymentId(response.id)
                }
            })
            .catch((error) => {
                setPaymentId("ERROR")
            });
    };

    if (paymentId) {
        return (
            <StatusScreen
                initialization={{
                    paymentId,
                }}
                customization={{
                    visual: {
                        showExternalReference: true,
                        hideStatusDetails: false,
                        hideTransactionDate: false,
                    }
                }}
            />
        )
    }

    if (preferenceId) {
        return (
            <Flex direction="column" gap="2" maxWidth="600px" style={{ margin: "auto" }}>
                <Card m="2">
                    <Flex direction="row" gap="2">
                        <Flex direction="column" gap="2">
                            <Text weight="bold" size="1">
                                First Name
                            </Text>
                            <TextField.Root
                                value={mercadoPagoData.payer.first_name}
                                required
                                onChange={e => {
                                    setMercadoPagoData(prev => {
                                        return {
                                            ...prev,
                                            payer: {
                                                ...prev.payer,
                                                first_name: e.target.value
                                            }
                                        }
                                    })
                                }}
                            />
                        </Flex>

                        <Flex direction="column" gap="2">
                            <Text weight="bold" size="1">
                                Last Name
                            </Text>
                            <TextField.Root
                                value={mercadoPagoData.payer.last_name}
                                required
                                onChange={e => {
                                    setMercadoPagoData(prev => {
                                        return {
                                            ...prev,
                                            payer: {
                                                ...prev.payer,
                                                last_name: e.target.value
                                            }
                                        }
                                    })
                                }}
                            />
                        </Flex>
                    </Flex>
                    <Flex direction="row" gap="2">
                        <Flex direction="column" gap="2">
                            <Text weight="bold" size="1">
                                Phone Area Code
                            </Text>
                            <TextField.Root
                                value={mercadoPagoData.payer.phone.area_code}
                                maxLength={5}
                                required
                                onChange={e => {
                                    setMercadoPagoData(prev => {
                                        return {
                                            ...prev,
                                            payer: {
                                                ...prev.payer,
                                                phone: {
                                                    ...prev.payer.phone,
                                                    area_code: e.target.value
                                                }
                                            }
                                        }
                                    })
                                }}
                            />
                        </Flex>
                        <Flex direction="column" gap="2">
                            <Text weight="bold" size="1">
                                Phone Number
                            </Text>
                            <TextField.Root
                                type="tel"
                                required
                                value={mercadoPagoData.payer.phone.number}
                                maxLength={5}
                                onChange={e => {
                                    setMercadoPagoData(prev => {
                                        return {
                                            ...prev,
                                            payer: {
                                                ...prev.payer,
                                                phone: {
                                                    ...prev.payer.phone,
                                                    number: e.target.value
                                                }
                                            }
                                        }
                                    })
                                }}
                            />
                        </Flex>
                    </Flex>

                    <Flex direction="column" gap="2" mt="2">
                        <Text weight="bold" size="1">
                            Address
                        </Text>
                        <Flex direction="column" gap="2">
                            <Text weight="bold" size="1">
                                Street name
                            </Text>
                            <TextField.Root
                                value={mercadoPagoData.shippingOptions.receiver_address.street_name}
                                required
                                onChange={e => {
                                    setMercadoPagoData(prev => {
                                        return {
                                            ...prev,
                                            shippingOptions: {
                                                ...prev.shippingOptions,
                                                receiver_address: {
                                                    ...prev.shippingOptions.receiver_address,
                                                    street_name: e.target.value
                                                }
                                            }
                                        }
                                    })
                                }}
                            />
                        </Flex>

                        <Flex direction="column" gap="2">
                            <Text weight="bold" size="1">
                                City
                            </Text>
                            <TextField.Root
                                value={mercadoPagoData.shippingOptions.receiver_address.city_name}
                                required
                                onChange={e => {
                                    setMercadoPagoData(prev => {
                                        return {
                                            ...prev,
                                            shippingOptions: {
                                                ...prev.shippingOptions,
                                                receiver_address: {
                                                    ...prev.shippingOptions.receiver_address,
                                                    city_name: e.target.value
                                                }
                                            }
                                        }
                                    })
                                }}
                            />
                        </Flex>
                        <Flex direction="column" gap="2">
                            <Text weight="bold" size="1">
                                Zip Code
                            </Text>
                            <TextField.Root
                                value={mercadoPagoData.shippingOptions.receiver_address.zip_code}
                                required
                                onChange={e => {
                                    setMercadoPagoData(prev => {
                                        return {
                                            ...prev,
                                            shippingOptions: {
                                                ...prev.shippingOptions,
                                                receiver_address: {
                                                    ...prev.shippingOptions.receiver_address,
                                                    zip_code: e.target.value
                                                }
                                            }
                                        }
                                    })
                                }}
                            />
                        </Flex>
                    </Flex>
                </Card>

                <Payment
                    initialization={initialization}
                    customization={customization}
                    onSubmit={onSubmit}
                    onError={onError}
                />
            </Flex>
        )
    }

    return (
        <Flex
            data-hydration-id={props["data-hydration-id"]}
            direction="column"
            justify='center'
            align="center"
            mb="2"
        >
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
                            loading={loading}
                        >
                            Confirm order & Authorize payment
                        </Button>
                    </Flex>

                </Flex>
            </Card>
        </Flex>
    )
}

export default SectionCheckoutMercadoPago

export const SectionCheckoutMercadoPagoItem: TemplateStruct<SectionCheckoutMercadoPagoProps> = {
    name: TemplateComponentType.CHECKOUT_MERCADO_PAGO,
    Component: SectionCheckoutMercadoPago,
    categories: [TemplateCategory.CHECKOUT],
    description: "Checkout Mercado Pago",
    classNames: [
        // ...Object.values(styles),
        // ...Object.values(ButtonStyles),
    ],
    props: {
        checkoutUrl: "",
        paymentUrl: "",
        accessToken: "",
        publicKey: "",
        projectId: "",
        returnUrl: "",
        statementDescriptor: "",
        enableShipping: false,
    }
}
