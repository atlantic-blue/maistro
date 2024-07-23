export interface ShoppingCartItemModifierStruct {
    id: string,
    quantity: number,
}

export interface ShoppingCartItemStruct {
    quantity: number,
    productId: string
    modifiers: ShoppingCartItemModifierStruct[]
}

export interface ShoppingCartStruct {
    id: string
    createdAt: string,
    items: ShoppingCartItemStruct[]
}

export interface ProductModifierStruct {
    id: string
    imgSrc: string
    name: string
    description: string
    price: number
}

export interface ProductStruct {
    id: string
    price: number
    name: string
    description: string
    images: string[]
    stockQuantity: number
    updatedAt: string
    modifiers: ProductModifierStruct[]
}

export interface MaistroClientStorage {
    shoppingCart: ShoppingCartStruct
    products: ProductStruct[]
}

export interface ShoppingCartItem {
    quantity: number,
    product: ProductStruct,
    modifiers: ShoppingCartItemModifierStruct[]
}
