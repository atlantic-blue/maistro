export interface IShoppingCart {
    id: string
    createdAt: string,
    items: Array<{
        quantity: number,
        productId: string
    }>
}

export interface Product {
    id: string
    price: number
    name: string
    description: string
    images: string[]
    stockQuantity: number
    updatedAt: string
}

export interface Modifier {
    id: string
    imgSrc: string
    name: string
    description: string
    price: number
}

export interface Item {
    quantity: number,
    product: Product,
    modifierItems: Array<{
        id: string
        quantity: number
        modifier: Modifier
    }>
}


export interface ProductProps {
    children: React.ReactNode
    item: Item
    currencySymbol: "$"
    onUpdate: (item: Item) => void
    modifiers: Modifier[]
}

export interface MaistroClientStorage {
    shoppingCart: {
        id: string
        createdAt: string
        items: Array<{
            productId: string
            quantity: number
        }>
    }
    products: Array<{
        id: string
        name: string
        description: string
    }>
}
