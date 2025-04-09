import Stripe from "stripe"

export enum OrderStatus {
    CREATED = "CREATED",
    CHECKOUT_COMPLETED = "CHECKOUT_COMPLETED",
    PAYMENT_ACCEPTED = "PAYMENT_ACCEPTED",

    ACKNOWLEDGED = "ACKNOWLEDGED",
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    COMPLETED = "COMPLETED",
}

export interface OrderShippingOptions {
    shipping_rate: string
    shipping_rate_data: {
        display_name: string
        type: string
        fixed_amount: {
            amount: number
            currency: string
        }
    }
}

export interface Order {
    id: string
    platform: "STRIPE" | "MERCADO_PAGO"
    status: OrderStatus
    createdAt: string

    history: Array<{
        status: OrderStatus,
        timestamp: string
    }>

    projectId: string
    sessionId: string
    shoppingCartId: string

    items: Stripe.Checkout.SessionCreateParams.LineItem[]
    shippingOptions: OrderShippingOptions[]

    paymentIntent: string | Stripe.PaymentIntent
    returnUrl: string,
    customerDetails: {
        address: {
            city: string
            country: string
            line1: string
            line2: string
            postalCode: string
            state: string
        }
        email: string
        name: string
        phone: string
    }

    fulfilment: {
        date?: string
        interval?: string
    }
}
