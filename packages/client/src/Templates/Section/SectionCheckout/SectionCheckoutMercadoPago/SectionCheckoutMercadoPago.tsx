import React from 'react';
import {
    Payment,
    initMercadoPago,
    StatusScreen,
} from '@mercadopago/sdk-react';

import { TPaymentType } from '@mercadopago/sdk-react/bricks/payment/type';
import { TemplateCategory, TemplateComponentType, TemplateStruct } from '../../../templateTypes';
import { Avatar, Box, Button, Card, Flex, Text } from '@radix-ui/themes';

let started = false
const getMercadoPago = (key: string) => {
    if (started) {
        return
    }
    started = true
    initMercadoPago(key)
}

export interface SectionCheckoutMercadoPagoProps {
    "data-hydration-id"?: string
    projectId: string
    checkoutUrl: string
    paymentUrl: string

    publicKey: string
    accessToken: string
    statementDescriptor: string

    returnUrl: string
    enableShipping: boolean

    payer: {
        first_name: string
        last_name: string
        phone: {
            area_code: string
            number: string
        },
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
    shippingOptions: {
        receiver_address: {
            zip_code: string
            street_name: string
            city_name: string
        },
        cost: number,
    }
}

const calculateCost = (items: SectionCheckoutMercadoPagoProps["items"], shippingCost = 0) => {
    return items.reduce((prev, item) => {
        return (item.unit_price * item.quantity) + prev
    }, 0) + shippingCost
}

const SectionCheckoutMercadoPago: React.FC<SectionCheckoutMercadoPagoProps> = (props) => {
    getMercadoPago(props.publicKey)
    const [loading, setIsLoading] = React.useState(false)
    const [preferenceId, setPreferenceId] = React.useState("")
    const [paymentId, setPaymentId] = React.useState("")


    const initialization: TPaymentType["initialization"] = {
        amount: calculateCost(props.items, props.enableShipping ? props.shippingOptions.cost : 0),
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

    const onClick = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(props.checkoutUrl, {
                method: "POST",
                body: JSON.stringify({
                    token_id: props.accessToken,
                    project_id: props.projectId,
                    return_url: props.returnUrl,
                    line_items: props.items.map(item => {
                        return {
                            id: item.id,
                            title: item.title,
                            description: item.description,
                            picture_url: item.picture_url,
                            quantity: item.quantity,
                            unit_price: item.unit_price,
                            currency_id: item.currency_id,
                        }
                    }),
                    enable_shipping: props.enableShipping,
                    shipping_options: props.shippingOptions,
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
                line_items: props.items.map(item => {
                    return {
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        picture_url: item.picture_url,
                        quantity: item.quantity,
                        unit_price: item.unit_price,
                        category_id: item.category_id
                    }
                }),
                shipping_options: {
                    receiver_address: props.shippingOptions.receiver_address,
                },
                payer: {
                    first_name: props.payer.first_name,
                    last_name: props.payer.last_name,
                    phone: {
                        area_code: props.payer.phone.area_code,
                        number: props.payer.phone.number,
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
            <>
                <Payment
                    initialization={initialization}
                    customization={customization}
                    onSubmit={onSubmit}
                    onError={onError}
                />
            </>
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
            <Flex m="2" gap="2">
                {props.items?.map((item, key) => {
                    return (
                        <Card key={item.id}>
                            <Flex justify="between" gap="2">
                                <Avatar
                                    size="8"
                                    src={item.picture_url}
                                    fallback={item.title}
                                />
                                <Flex direction="column">
                                    <Text as="div" size="2" weight="bold">
                                        {item.title}
                                    </Text>
                                    <Box>
                                        <Flex>
                                            {/* <Text>{item.price_data.currency}</Text> */}
                                            <Text>$</Text>
                                            <Text>{item.unit_price}</Text>
                                        </Flex>
                                        <Text size="1">Quantity: {item.quantity}</Text>
                                    </Box>
                                </Flex>
                            </Flex>
                        </Card>
                    )
                })}
            </Flex>
            <Button onClick={onClick} loading={loading} variant='outline'>
                Order now
            </Button>
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
        payer: {
            first_name: "",
            last_name: "",
            phone: {
                area_code: "",
                number: "",
            },
        },
        items: [
            {
                id: new Date().toISOString(),
                quantity: 2,
                currency_id: "COP",
                title: "brownie",
                unit_price: 5000,
                description: "",
                picture_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1OTYxOTB8MHwxfHNlYXJjaHwxM3x8ZGVzc2VydHxlbnwwfHx8fDE3MjAzMTI5ODV8MA&ixlib=rb-4.0.3&q=85",
                category_id: "food",
            }
        ],
        enableShipping: false,
        shippingOptions: {
            receiver_address: {
                zip_code: "",
                street_name: "",
                city_name: "",
            },
            cost: 0,
        }
    }
}
