import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Text, Button, Avatar, AspectRatio, Tabs, ScrollArea, Dialog, Spinner, Card, Checkbox } from '@radix-ui/themes';
import { ShoppingCartStruct, ProductStruct, ShoppingCartItemModifierStruct, ProductModifierStruct } from '../../../types';
import { Currency, CurrencySymbol, fromSmallestUnit } from '../../../../Utils/currency';
import { MinusCircle, PlusCircle, ShoppingCart, Star, Trash2, X } from 'lucide-react';
import { shoppingCartPatch } from '../../../Api/ShoppingCart/ShoppingCartPatch';
import { clientStorage } from '../../SectionShoppingCart/SectionShoppingCartBasic/SectionShoppingCartBasic';
import { TemplateCategory, TemplateComponentType, TemplateStruct } from '../../../templateTypes';
import { randImg } from '@ngneat/falso';
import { shoppingCartCreate } from '../../../Api/ShoppingCart/shoppingCartCreate';
import { shoppingCartGet } from '../../../Api/ShoppingCart/ShoppingCartGet';

export interface ProductReview {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt?: string;
    helpful?: number;
    notHelpful?: number;
    verifiedPurchase: boolean;
}

interface ProductDisplay {
    imgSrc: string;
    currency: Currency;
    cta: string;
    product: ProductStruct;
    reviews: ProductReview[]
}

export interface SectionProductsEnhancedProps {
    "data-hydration-id"?: string;
    projectId: string;
    products: ProductDisplay[];
}

export enum MaistroEvent {
    PRODUCT_UPDATED = "__MAISTRO_SHOPPING_CART_UPDATED__",
    CART_UPDATED = "__MAISTRO_SHOPPING_CART_UPDATED__"
}

const ProductQuantityControl: React.FC<{
    projectId: string;
    productId: string;
    quantity: number;
    cta: string;
    shoppingCart?: ShoppingCartStruct;
    onQuantityChange: (newQuantity: number) => void;
}> = ({ projectId, productId, quantity, cta, shoppingCart, onQuantityChange }) => {
    const [loading, setLoading] = useState(false);

    const updateQuantity = async (delta: number) => {
        setLoading(true);
        try {
            let shoppingCartId = shoppingCart?.id || "";
            if (!shoppingCartId) {
                const { data } = await shoppingCartCreate({ projectId });
                shoppingCartId = data.id || '';
                clientStorage.set({
                    ...clientStorage.get(),
                    shoppingCart: {
                        id: shoppingCartId,
                        createdAt: data.createdAt || "",
                        items: data.items || []
                    }
                });
            }

            await shoppingCartPatch({
                shoppingCartId,
                item: {
                    productId,
                    quantity: delta,
                    modifiers: shoppingCart?.items?.find(i => i.productId === productId)?.modifiers || [],
                }
            });

            onQuantityChange(quantity + delta);
            const event = new Event(MaistroEvent.PRODUCT_UPDATED);
            window.dispatchEvent(event);
        } catch (error) {
            console.error("Error updating quantity:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Spinner />;
    }

    if (quantity === 0) {
        return (
            <Button size="2" onClick={() => updateQuantity(1)}>{cta}</Button>
        );
    }

    return (
        <Flex gap="3" justify="center" align="center">
            <Button size="2" variant="ghost" onClick={() => updateQuantity(-1)}>
                {quantity === 1 ? <Trash2 /> : <MinusCircle />}
            </Button>
            <Text weight="bold" size="3">{quantity}</Text>
            <Button size="2" variant="ghost" onClick={() => updateQuantity(1)}>
                <PlusCircle />
            </Button>
        </Flex>
    );
};

const ProductModifiers: React.FC<{
    product: ProductStruct;
    shoppingCart?: ShoppingCartStruct;
    currency: Currency;
    onModifiersUpdate: (modifiers: ShoppingCartItemModifierStruct[]) => void;
}> = ({ product, shoppingCart, currency, onModifiersUpdate }) => {
    const shoppingCartItem = shoppingCart?.items?.find(i => i.productId === product.id);
    const itemModifiers = shoppingCartItem?.modifiers || [];
    const [nextModifiers, setNextModifiers] = useState<ShoppingCartItemModifierStruct[]>(itemModifiers);

    const checked = (modifier: ProductModifierStruct) => nextModifiers?.find(im => im.id === modifier.id);

    const onSelectModifier = (modifier: ProductModifierStruct) => {
        if (checked(modifier)) {
            setNextModifiers(prev => prev.filter(i => i.id !== modifier.id));
        } else {
            setNextModifiers(prev => [...prev, { id: modifier.id, quantity: 1 }]);
        }
    };

    useEffect(() => {
        onModifiersUpdate(nextModifiers);
    }, [nextModifiers]);

    return (
        <Flex direction="column" gap="1">
            {product.modifiers.map(modifier => (
                <Button
                    key={modifier.id}
                    variant="ghost"
                    style={{ width: "100%", padding: "10px 0" }}
                    onClick={() => onSelectModifier(modifier)}
                >
                    <Flex direction="row" justify="between" align="center" gap="2" style={{ width: "90%" }}>
                        <Checkbox checked={Boolean(checked(modifier))} />
                        <Avatar
                            src={modifier.imgSrc}
                            alt={modifier.name}
                            fallback={modifier.name.charAt(0)}
                            size="3"
                        />
                        <Flex direction="column" style={{ marginRight: "auto", textAlign: "left" }}>
                            <Text>{modifier.name}</Text>
                            <Text>{modifier.description}</Text>
                        </Flex>
                        <Flex justify="center" align="center" gap="1">
                            <Text>+</Text>
                            <Text>{CurrencySymbol[currency]}</Text>
                            <Text>{fromSmallestUnit(modifier.price, currency)}</Text>
                        </Flex>
                    </Flex>
                </Button>
            ))}
        </Flex>
    );
};

const ProductCard: React.FC<{
    productDisplay: ProductDisplay;
    projectId: string;
    shoppingCart?: ShoppingCartStruct;
    onQuantityChange: (productId: string, newQuantity: number, modifiers: ShoppingCartItemModifierStruct[]) => void;
}> = ({ productDisplay, projectId, shoppingCart, onQuantityChange }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedModifiers, setSelectedModifiers] = useState<ShoppingCartItemModifierStruct[]>([]);
    const quantity = shoppingCart?.items?.find(i => i.productId === productDisplay.product.id)?.quantity || 0;

    const averageRating = productDisplay.reviews?.length > 0
        ? productDisplay.reviews.reduce((acc, review) => acc + review.rating, 0) / productDisplay.reviews.length
        : 0;

    const handleQuantityChange = (delta: number) => {
        const newQuantity = Math.max(0, quantity + delta);
        onQuantityChange(productDisplay.product.id, newQuantity, selectedModifiers);
    };


    const handleModifiersUpdate = (modifiers: ShoppingCartItemModifierStruct[]) => {
        setSelectedModifiers(modifiers);
        if (quantity > 0) {
            onQuantityChange(productDisplay.product.id, quantity, modifiers);
        }
    };
    return (
        <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Trigger>
                <Card size="2" style={{ width: 300, cursor: 'pointer' }}>
                    <img
                        src={productDisplay.imgSrc}
                        alt={productDisplay.product.name}
                        style={{ width: '100%', height: 200, objectFit: 'cover' }}
                        loading="lazy"
                    />
                    <Heading size="3" mt="2">{productDisplay.product.name}</Heading>
                    <Text as="p" size="2" color="gray">{productDisplay.product.description}</Text>
                    <Flex justify="between" mt="4">
                        <Text weight="bold">
                            {CurrencySymbol[productDisplay.currency]}{fromSmallestUnit(productDisplay.product.price, productDisplay.currency)}
                        </Text>
                        <ProductQuantityControl
                            projectId={projectId}
                            productId={productDisplay.product.id}
                            quantity={quantity}
                            cta={productDisplay.cta}
                            shoppingCart={shoppingCart}
                            onQuantityChange={(newQuantity) => onQuantityChange(productDisplay.product.id, newQuantity, selectedModifiers)}
                        />
                    </Flex>
                </Card>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 800 }}>
                <Dialog.Close>
                    <Button variant="ghost" style={{ position: 'absolute', top: 8, right: 8 }}>
                        <X />
                    </Button>
                </Dialog.Close>

                <ScrollArea type="always" scrollbars="vertical" style={{ maxHeight: 800 }}>
                    <img
                        src={productDisplay.imgSrc}
                        alt={productDisplay.product.name}
                        style={{ width: '100%', height: 300, objectFit: 'cover' }}
                        loading="lazy"
                    />
                    <Heading size="6" mt="4">{productDisplay.product.name}</Heading>
                    <Flex align="center" gap="2">
                        <Star color={averageRating > 0 ? "gold" : "gray"} />
                        <Text>{averageRating.toFixed(1)}</Text>
                        <Text color="gray">({productDisplay.reviews.length} reviews)</Text>
                    </Flex>
                    <Text as="p" size="3" mt="2">{productDisplay.product.description}</Text>
                    <Flex justify="between" mt="4" align="center">
                        <Text size="5" weight="bold">
                            {CurrencySymbol[productDisplay.currency]}{fromSmallestUnit(productDisplay.product.price, productDisplay.currency)}
                        </Text>
                        <ProductQuantityControl
                            projectId={projectId}
                            productId={productDisplay.product.id}
                            quantity={quantity}
                            cta={productDisplay.cta}
                            shoppingCart={shoppingCart}
                            onQuantityChange={(newQuantity) => onQuantityChange(productDisplay.product.id, newQuantity, selectedModifiers)}
                        />
                    </Flex>

                    <Tabs.Root defaultValue="description">
                        <Tabs.List>
                            <Tabs.Trigger value="description">Description</Tabs.Trigger>
                            <Tabs.Trigger value="specifications">Specifications</Tabs.Trigger>
                            <Tabs.Trigger value="modifiers">Add-ons</Tabs.Trigger>
                            <Tabs.Trigger value="reviews">Reviews</Tabs.Trigger>
                        </Tabs.List>

                        <Box py="4">
                            <Tabs.Content value="description">
                                <Text as="p">{productDisplay.product.description}</Text>
                            </Tabs.Content>

                            <Tabs.Content value="specifications">
                                <Text as="p">{productDisplay.product.specifications || "No specifications available."}</Text>
                            </Tabs.Content>

                            <Tabs.Content value="modifiers">
                                <ProductModifiers
                                    product={productDisplay.product}
                                    shoppingCart={shoppingCart}
                                    currency={productDisplay.currency}
                                    onModifiersUpdate={handleModifiersUpdate}
                                />
                            </Tabs.Content>

                            <Tabs.Content value="reviews">
                                {productDisplay.reviews.length > 0 ? (
                                    productDisplay.reviews.map((review) => (
                                        <Box key={review.id} mb="4">
                                            <Flex align="center" gap="2">
                                                <Text weight="bold">{review.userName}</Text>
                                                {review.verifiedPurchase && <Text size="1" color="green">Verified Purchase</Text>}
                                                <Flex>
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} color={i < review.rating ? "gold" : "gray"} size={16} />
                                                    ))}
                                                </Flex>
                                                <Text size="2" color="gray">{new Date(review.createdAt).toLocaleDateString()}</Text>
                                            </Flex>
                                            <Text as="p" size="2">{review.comment}</Text>
                                            <Flex mt="2" gap="2">
                                                <Text size="1">Helpful ({review.helpful || 0})</Text>
                                                <Text size="1">Not Helpful ({review.notHelpful || 0})</Text>
                                            </Flex>
                                        </Box>
                                    ))
                                ) : (
                                    <Text>No reviews yet.</Text>
                                )}
                            </Tabs.Content>
                        </Box>
                    </Tabs.Root>
                </ScrollArea>

                <Flex justify="between" mt="4" align="center">
                    <Text size="5" weight="bold">
                        {CurrencySymbol[productDisplay.currency]}{fromSmallestUnit(productDisplay.product.price, productDisplay.currency)}
                    </Text>
                    <Flex gap="3" align="center">
                        <Button size="2" variant="ghost" onClick={() => handleQuantityChange(-1)} disabled={quantity === 0}>
                            {quantity === 1 ? <Trash2 /> : <MinusCircle />}
                        </Button>
                        <Text weight="bold" size="3">{quantity}</Text>
                        <Button size="2" variant="ghost" onClick={() => handleQuantityChange(1)}>
                            <PlusCircle />
                        </Button>
                    </Flex>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};

const SectionProductsEnhanced: React.FC<SectionProductsEnhancedProps> = (props) => {
    const [shoppingCart, setShoppingCart] = useState<ShoppingCartStruct>();

    const fetchShoppingCart = async () => {
        const { shoppingCart } = clientStorage.get();
        if (!shoppingCart || !shoppingCart.id) return;

        try {
            const response = await shoppingCartGet({ shoppingCartId: shoppingCart.id });
            if (response.data) {
                clientStorage.set({
                    ...clientStorage.get(),
                    shoppingCart: {
                        id: shoppingCart.id,
                        createdAt: response.data.createdAt || "",
                        items: response.data.items || []
                    }
                });
                setShoppingCart(response.data);
            }
        } catch (error) {
            console.error("Error fetching shopping cart:", error);
        }
    };

    useEffect(() => {
        fetchShoppingCart();
        window.addEventListener(MaistroEvent.PRODUCT_UPDATED, fetchShoppingCart);
        return () => {
            window.removeEventListener(MaistroEvent.PRODUCT_UPDATED, fetchShoppingCart);
        };
    }, []);

    const handleQuantityChange = async (productId: string, newQuantity: number, modifiers: ShoppingCartItemModifierStruct[]) => {
        if (!shoppingCart?.id) return;

        try {
            await shoppingCartPatch({
                shoppingCartId: shoppingCart.id,
                item: {
                    productId,
                    quantity: newQuantity,
                    modifiers,
                }
            });
            const event = new Event(MaistroEvent.PRODUCT_UPDATED);
            window.dispatchEvent(event);
        } catch (error) {
            console.error("Error updating shopping cart:", error);
        }
    };

    return (
        <Flex direction="row" wrap="wrap" gap="4" justify="center" data-hydration-id={props["data-hydration-id"]}>
            {props.products.map((productDisplay) => (
                <ProductCard
                    key={productDisplay?.product?.id}
                    productDisplay={productDisplay}
                    projectId={props.projectId}
                    shoppingCart={shoppingCart}
                    onQuantityChange={handleQuantityChange}
                />
            ))}
        </Flex>
    );
};

export const SectionProductsEnhancedItem: TemplateStruct<SectionProductsEnhancedProps> = {
    name: TemplateComponentType.PRODUCTS_ENHANCED,
    Component: SectionProductsEnhanced,
    categories: [TemplateCategory.PRODUCT],
    description: "Enhanced Product Display",
    classNames: [
        // Add any specific class names if needed
    ],
    props: {
        projectId: "",
        products: [
            {
                imgSrc: randImg(),
                currency: Currency.USD,
                cta: "Add to Cart",
                reviews: [],
                product: {
                    specifications: "",
                    id: "sample-product-1",
                    name: "Premium Widget",
                    description: "A high-quality widget with advanced features.",
                    price: 2999, // $29.99
                    currency: Currency.USD,
                    images: [randImg(), randImg(), randImg()],
                    stockQuantity: 100,
                    updatedAt: new Date().toISOString(),
                    modifiers: [
                        {
                            id: "mod-1",
                            name: "Extra Feature",
                            description: "Adds an extra feature to your widget",
                            price: 500, // $5.00
                            imgSrc: randImg()
                        }
                    ]
                }
            },
            {
                imgSrc: randImg(),
                currency: Currency.USD,
                cta: "Buy Now",
                reviews: [],
                product: {
                    specifications: "",
                    id: "sample-product-2",
                    name: "Deluxe Gadget",
                    description: "The ultimate gadget for tech enthusiasts.",
                    price: 4999, // $49.99
                    currency: Currency.USD,
                    images: [randImg(), randImg()],
                    stockQuantity: 50,
                    updatedAt: new Date().toISOString(),
                    modifiers: []
                }
            },
            // Add more sample products as needed
        ],
    },
};

export default SectionProductsEnhanced;