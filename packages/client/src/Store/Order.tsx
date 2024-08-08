import { Subject, Subscription } from "rxjs"
import { OrderEvent, OrderMessageType, OrderStatus, OrderStruct } from "../types"

interface IOrder {
    setId(id: string): void
    getId(): string

    setShoppingCartId(id: string): void
    getShoppingCartId(): string

    setStatus(status: OrderStatus): void
    getStatus(): OrderStatus
}
export interface Item {
    price_data: {
        currency: string
        product_data: {
            name: string
            description: string
            images: string[]
        },
        unit_amount: string
    }
    quantity: number
}


export class Order implements IOrder {
    private id = ""
    private shoppingCartId = ""
    private status: OrderStatus = OrderStatus.CREATED
    private items: Item[] = []
    private fulfilmentSlot: string = ""

    private subscriptions: Subscription[] = []
    public event$ = new Subject<OrderEvent>()

    constructor(product: OrderStruct) {
        this.set(product)
        this.subscriptions = [this.createSubscriptions()]
    }

    private createSubscriptions() {
        return this.event$.subscribe(event => {
            if (event.type === OrderMessageType.SET) {
                this.set(event.data)
            }
        })
    }

    public unsubscribe(): void {
        this.subscriptions.map(s => s.unsubscribe())
    }

    public getStruct(): OrderStruct {
        return {
            id: this.getId(),
            shoppingCartId: this.getShoppingCartId(),
            status: this.getStatus(),
            items: this.getItems(),
            fulfilmentSlot: this.getFulfilmentSlot(),
        }
    }

    public get() {
        return this
    }

    public set = (order: OrderStruct) => {
        this.setId(order.id)
        this.setShoppingCartId(order.shoppingCartId)
        this.setStatus(order.status)
        this.setFulfilmentSlot(order.fulfilmentSlot)
        this.setItems(order.items)
    }

    public setId(id: string) {
        this.id = id
    }

    public getId() {
        return this.id
    }

    public setItems(items: Item[]) {
        this.items = items
    }

    public getItems() {
        return this.items
    }

    public setFulfilmentSlot(fulfilmentSlot: string) {
        this.fulfilmentSlot = fulfilmentSlot
    }

    public getFulfilmentSlot() {
        return this.fulfilmentSlot
    }

    public setShoppingCartId(id: string) {
        this.shoppingCartId = id
    }

    public getShoppingCartId() {
        return this.shoppingCartId
    }

    public getStatus(): OrderStatus {
        return this.status
    }

    public setStatus(status: OrderStatus): void {
        this.status = status
    }
}
