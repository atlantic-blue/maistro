import { Avatar, Badge, Button, Checkbox, Dialog, Flex, Heading, ScrollArea, Text } from "@radix-ui/themes"
import { MinusCircle, PlusCircle, Trash2, X } from "lucide-react"
import React, { useState } from "react"
import { calculateItemTotal } from "./SectionShoppingCartBasic"
import { ShoppingCartStruct, ShoppingCartItem } from "../../../types"
import { Currency, CurrencySymbol, fromSmallestUnit } from "../../../../Utils/currency"

interface ShoppingItemModifiersProps {
    shoppingCartItem: ShoppingCartItem
    currency: Currency
    onUpdate: (item: ShoppingCartItem) => void
    children: React.ReactNode
}

export const ShoppingItemModifiers: React.FC<ShoppingItemModifiersProps> = (props) => {
    const [shoppingCartItem, setShoppingCartItem] = useState(props.shoppingCartItem)

    const onItemSubtractQuantity = () => {
        setShoppingCartItem(prev => {
            return {
                ...prev,
                quantity: prev.quantity - 1
            }
        })
    }

    const onItemIncrementQuantity = () => {
        setShoppingCartItem(prev => {
            return {
                ...prev,
                quantity: prev.quantity + 1
            }
        })
    }

    const onItemUpdate = () => {
        props.onUpdate(shoppingCartItem)
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                {props.children}
            </Dialog.Trigger>

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
                            src={shoppingCartItem.product.images[0]}
                            fallback={shoppingCartItem.product.name}
                            size="9"
                            style={{ margin: "auto" }}
                        />

                        <Heading as="h3">
                            {shoppingCartItem.product.name}
                        </Heading>

                        <Text as="div" mb="2">
                            {shoppingCartItem.product.description}
                        </Text>

                        <Heading as="h6" mb="1">
                            Add Ons
                        </Heading>


                        <Flex direction="column" gap="1">
                            {shoppingCartItem.product.modifiers.map(modifier => {
                                return (
                                    <Button
                                        key={modifier.id}
                                        variant="ghost"
                                        style={{ width: "100%", padding: "10px 0" }}
                                        onClick={() => {
                                            if (shoppingCartItem.modifiers.find(im => im.id === modifier.id)) {
                                                setShoppingCartItem(prev => {
                                                    return {
                                                        ...prev,
                                                        modifiers: prev.modifiers.filter(i => i.id !== modifier.id)
                                                    }
                                                })
                                            } else {
                                                setShoppingCartItem(prev => {
                                                    return {
                                                        ...prev,
                                                        modifiers: [
                                                            ...prev.modifiers,
                                                            {
                                                                id: modifier.id,
                                                                quantity: 1,
                                                            }
                                                        ]
                                                    }
                                                })
                                            }
                                        }}
                                    >
                                        <Flex direction="row" justify="between" align="center" gap="2" style={{ width: "90%" }}>
                                            <Checkbox
                                                checked={Boolean(shoppingCartItem?.modifiers?.find(im => im.id === modifier.id))}
                                            />
                                            <Avatar
                                                src={modifier?.imgSrc}
                                                fallback={modifier?.name?.charAt(0)}
                                                size="3"
                                            />
                                            <Flex direction="column" style={{ marginRight: "auto", textAlign: "left" }}>
                                                <Text>{modifier?.name}</Text>
                                                <Text>{modifier?.description}</Text>
                                            </Flex>

                                            <Flex justify="center" align="center" gap="1">
                                                <Text>+</Text>
                                                <Text>{CurrencySymbol[props?.currency]}</Text>
                                                <Text>{fromSmallestUnit(modifier?.price, props?.currency)}</Text>
                                            </Flex>

                                        </Flex>
                                    </Button>
                                )
                            })}
                        </Flex>
                    </Flex>
                </ScrollArea>

                <Flex gap="3" justify="center" align="center" mt="2">
                    <Button
                        size="2"
                        variant="ghost"
                        disabled={shoppingCartItem?.quantity === 1}
                        onClick={onItemSubtractQuantity}
                    >
                        <MinusCircle />
                    </Button>
                    <Text weight="bold" size="3" m="3">
                        {shoppingCartItem?.quantity}
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
                    <Dialog.Close>
                        <Button
                            size="2"
                            onClick={onItemUpdate}
                        >
                            <Text>
                                Add for
                            </Text>
                            <Text>
                                {CurrencySymbol[props.currency]} {' '}
                                {
                                    fromSmallestUnit(
                                        calculateItemTotal(shoppingCartItem),
                                        props.currency)
                                }
                            </Text>
                        </Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}

interface ShoppingItemProps {
    item: ShoppingCartItem
    currency: Currency
    shoppingCart: ShoppingCartStruct
    children: React.ReactNode
    onItemRemove: (item: ShoppingCartItem) => void
    onItemUpdate: (item: ShoppingCartItem) => Promise<void>
}

export const ShoppingItem: React.FC<ShoppingItemProps> = (props) => {
    const [shoppingCartItem, setItem] = React.useState(props.item)
    const [isLoading, setIsLoading] = React.useState(false)
    const onItemUpdate = (item: ShoppingCartItem) => {
        setItem(item)
    }

    const onItemRemove = () => {
        props.onItemRemove(shoppingCartItem)
    }

    const onItemSubtractQuantity = () => {
        setItem(prev => {
            return {
                ...prev,
                quantity: prev.quantity - 1
            }
        })
    }

    const onItemIncrementQuantity = () => {
        setItem(prev => {
            return {
                ...prev,
                quantity: prev.quantity + 1
            }
        })
    }

    const onUpdate = async () => {
        try {
            setIsLoading(true)
            props.onItemUpdate(shoppingCartItem)
        } catch (error) {

        } finally {
            setIsLoading(false)
        }

    }

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                {props.children}
            </Dialog.Trigger>

            <Dialog.Content maxWidth="600px">
                <Dialog.Title>
                    <Flex align="center" justify="between">
                        <Button
                            variant="ghost"
                            onClick={onItemRemove}
                        >
                            <Trash2 />
                        </Button>
                        <Text>
                            {shoppingCartItem.product.name}
                        </Text>
                        <Dialog.Close>
                            <Button
                                variant="ghost"
                            >
                                <X />
                            </Button>
                        </Dialog.Close>
                    </Flex>
                </Dialog.Title>

                <Flex direction="row" gap="1" justify="center">
                    {shoppingCartItem.modifiers.map(modifier => {
                        const productModifier = shoppingCartItem.product.modifiers.find(m => m.id === modifier.id)
                        return (
                            <Badge key={modifier.id} color="green">
                                {productModifier?.name}
                            </Badge>
                        )
                    })}
                </Flex>

                <Flex direction="row" gap="1" justify="center">
                    {props.item.product.modifiers.length > 0 ? (
                        <ShoppingItemModifiers
                            shoppingCartItem={shoppingCartItem}
                            currency={props.currency}
                            onUpdate={onItemUpdate}
                        >
                            <Button
                                m="2"
                                variant="outline"
                                style={{ margin: "5% 20%" }}
                            >
                                Customise Item
                            </Button>
                        </ShoppingItemModifiers>
                    ) : null}
                </Flex>

                <Flex gap="3" justify="center" align="center">
                    <Button
                        size="2"
                        variant="ghost"
                        onClick={onItemSubtractQuantity}
                        disabled={shoppingCartItem.quantity === 1}
                    >
                        <MinusCircle />
                    </Button>
                    <Text weight="bold" size="3" m="3">
                        {shoppingCartItem.quantity}
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
                    <Dialog.Close>
                        <Button
                            size="2"
                            onClick={onUpdate}
                            loading={isLoading}
                        >
                            Update
                        </Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root >
    )
}