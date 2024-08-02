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

export class Order implements IOrder {
    private id = ""
    private shoppingCartId = ""
    private status: OrderStatus = OrderStatus.CREATED

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
        }
    }

    public get() {
        return this
    }

    public set = (order: OrderStruct) => {
        this.setId(order.id)
        this.setShoppingCartId(order.shoppingCartId)
        this.setStatus(order.status)
    }

    public setId(id: string) {
        this.id = id
    }

    public getId() {
        return this.id
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
