import { Subject, Subscription } from "rxjs"
import {
    ProductEvent,
    ProductMessageType,
    ProductModifierStruct,
    ProductStruct
} from "../types"
import { Currency } from "../Utils/currency"

interface IProduct {
    setId(id: string): void
    getId(): string

    setName(name: string): void
    getName(): string

    setDescription(description: string): void
    getDescription(): string
}

export class Product implements IProduct {
    private id = ""
    private name = ""
    private description = ""
    private price = 0
    private stockQuantity = 0
    private currency: Currency = Currency.GBP
    private images: string[] = []
    private options: Record<string, string[]> = {}
    private modifiers: ProductModifierStruct[] = []

    private subscriptions: Subscription[] = []
    public event$ = new Subject<ProductEvent>()

    constructor(product: ProductStruct) {
        this.set(product)
        this.subscriptions = [this.createSubscriptions()]
    }

    private createSubscriptions() {
        return this.event$.subscribe(event => {
            if (event.type === ProductMessageType.SET) {
                this.set(event.data)
            }
        })
    }

    public unsubscribe(): void {
        this.subscriptions.map(s => s.unsubscribe())
    }

    public get() {
        return this
    }

    public set = (product: ProductStruct) => {
        this.setId(product.id)
        this.setPrice(product.price)
        this.setStockQuantity(product.stockQuantity)
        this.setOptions(product.options)
        this.setName(product.name)
        this.setImages(product.images)
        this.setDescription(product.description)
        this.setCurrency(product.currency)
        this.setModifiers(product.modifiers)
    }

    public getStruct(): ProductStruct {
        return {
            id: this.getId(),
            price: this.getPrice(),
            options: this.getOptions(),
            name: this.getName(),
            images: this.getImages(),
            description: this.getDescription(),
            currency: this.getCurrency(),
            stockQuantity: this.getStockQuantity(),
            modifiers: this.getModifiers(),
        }
    }

    public setId(id: string) {
        this.id = id
    }

    public getId() {
        return this.id
    }

    public setName(name: string) {
        this.name = name
    }

    public getName() {
        return this.name
    }

    public setDescription(description: string) {
        this.description = description
    }

    public getDescription() {
        return this.description
    }

    public setCurrency(currency: Currency) {
        this.currency = currency
    }

    public getCurrency() {
        return this.currency
    }

    public setPrice(price: number) {
        this.price = price
    }

    public getPrice(): number {
        return this.price
    }

    public setStockQuantity(stockQuantity: number) {
        this.stockQuantity = stockQuantity
    }

    public getStockQuantity(): number {
        return this.stockQuantity
    }

    public setOptions(options: Record<string, string[]>) {
        this.options = options
    }

    public getOptions() {
        return this.options
    }

    public setImages(images: string[]) {
        this.images = images
    }

    public setImage(image: string) {
        this.images = [
            ...this.images,
            image,
        ]
    }

    public getImages() {
        return this.images
    }

    public getModifiers() {
        return this.modifiers
    }

    public setModifiers(modifiers: ProductModifierStruct[]) {
        if (!modifiers) return

        this.modifiers = modifiers
    }
}