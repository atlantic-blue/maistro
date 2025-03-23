import { Currency } from '../Utils/currency'
import { SectionCheckoutBasicItem } from './Section/SectionCheckout/SectionCheckoutStripe/SectionCheckoutStripe'

export interface ShoppingCartItemModifierStruct {
    id: string
    quantity: number
}

export interface ShoppingCartItemStruct {
    quantity: number
    productId: string
    modifiers: ShoppingCartItemModifierStruct[]
}

export interface ShoppingCartStruct {
    id: string
    createdAt: string
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
    currency: Currency
    images: string[]
    stockQuantity: number
    updatedAt: string
    description: string
    specifications: string
    modifiers: ProductModifierStruct[]
}

export interface MaistroClientStorage {
    shoppingCart: ShoppingCartStruct
    products: ProductStruct[]
}

export interface ShoppingCartItem {
    quantity: number
    product: ProductStruct
    modifiers: ShoppingCartItemModifierStruct[]
}

export enum OrderStatus {
    CREATED = 'CREATED',
    CHECKOUT_COMPLETED = 'CHECKOUT_COMPLETED',
    PAYMENT_ACCEPTED = 'PAYMENT_ACCEPTED',

    ACKNOWLEDGED = 'ACKNOWLEDGED',
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    COMPLETED = 'COMPLETED',
}

export interface Order {
    id: string
    projectId: string
    fulfilment: {
        date: string
        interval: string
    }
    createdAt: string
    updatedAt: string
    shoppingCartId: string
    status: OrderStatus
    items: SectionCheckoutBasicItem[]
}

export interface Review {
    id: string
    targetId: string
    author: string
    rating: number
    comment: string
    date: string
}
