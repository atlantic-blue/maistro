import { Avatar, Button, Checkbox, Dialog, Flex, Heading, ScrollArea, Text } from "@radix-ui/themes"
import { MinusCircle, PlusCircle, Trash2, X } from "lucide-react"
import React, { useState } from "react"
import { calculateItemTotal } from "./SectionShoppingCartBasic"
import { Item, Modifier, ProductProps } from "../../../types"

const ProductItem: React.FC<ProductProps> = (props) => {
    const [item, setItem] = useState(props.item)

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

    const onItemUpdate = () => {
        props.onUpdate(item)
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
                            src={item.product.images[0]}
                            fallback={item.product.name}
                            size="9"
                            style={{ margin: "auto" }}
                        />

                        <Heading as="h3">
                            {item.product.name}
                        </Heading>

                        <Text as="div" mb="2">
                            {item.product.description}
                        </Text>

                        <Heading as="h6" mb="1">
                            Add Ons
                        </Heading>


                        <Flex direction="column" gap="1">
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
                        </Flex>
                    </Flex>
                </ScrollArea>

                <Flex gap="3" justify="center" align="center" mt="2">
                    <Button
                        size="2"
                        variant="ghost"
                        disabled={item.quantity === 1}
                        onClick={onItemSubtractQuantity}
                    >
                        <MinusCircle />
                    </Button>
                    <Text weight="bold" size="3" m="3">
                        {item.quantity}
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
                                {props.currencySymbol} {' '}
                                {calculateItemTotal(item)}
                            </Text>
                        </Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}

interface ShoppingItemProps {
    item: Item
    modifiers: Modifier[]
    children: React.ReactNode
    onItemRemove: (item: Item) => void
    onItemUpdate: (item: Item) => Promise<void>
}

export const ShoppingItem: React.FC<ShoppingItemProps> = (props) => {
    const [item, setItem] = React.useState(props.item)
    const [isLoading, setIsLoading] = React.useState(false)
    const onItemUpdate = (item: Item) => {
        setItem(item)
    }

    const onItemRemove = () => {
        props.onItemRemove(item)
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
            props.onItemUpdate(item)
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
                            {item.product.name}
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

                <Flex direction="column" gap="1" justify="center">
                    {item.modifierItems.map(modifierItem => {
                        return (
                            <Text align="center">
                                {modifierItem.modifier.name}
                            </Text>
                        )
                    })}

                    {props.modifiers.length > 0 ? (
                        <ProductItem
                            item={item}
                            currencySymbol={"$"}
                            modifiers={props.modifiers}
                            onUpdate={onItemUpdate}
                        >
                            <Button
                                m="2"
                                variant="outline"
                                style={{ margin: "5% 20%" }}
                            >
                                Customise Item
                            </Button>
                        </ProductItem>
                    ) : null}

                </Flex>

                <Flex gap="3" justify="center" align="center">
                    <Button
                        size="2"
                        variant="ghost"
                        onClick={onItemSubtractQuantity}
                        disabled={item.quantity === 1}
                    >
                        <MinusCircle />
                    </Button>
                    <Text weight="bold" size="3" m="3">
                        {item.quantity}
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
        </Dialog.Root>
    )
}