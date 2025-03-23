import Stripe from "stripe"

export interface Order {
    projectId: string,
    orderId: string,
    paymentIntent: string | Stripe.PaymentIntent,
    returnUrl: string,
    customerDetails: {
        address: {
            city: string,
            country: string,
            line1: string,
            line2: string,
            postalCode: string,
            state: string,
        },
        email: string,
        name: string,
        phone: string,
    }
    fulfilment: {
        date: string,
        interval: string,
    }
}

export const extractDataFromEvent = (
    event: Stripe.CheckoutSessionCompletedEvent, 
    fulfilment: {date?: string, interval?: string},
): Order => {
    return {
        projectId: event.data.object.metadata?.project_id || "",
        orderId: event.data.object.metadata?.order_id || "",
        paymentIntent: event.data.object.payment_intent || "",
        returnUrl: event.data.object.return_url || "",

        customerDetails: {
            address: {
                city: event.data.object.customer_details?.address?.city || "",
                country: event.data.object.customer_details?.address?.country || "",
                line1: event.data.object.customer_details?.address?.line1 || "",
                line2: event.data.object.customer_details?.address?.line2 || "",
                postalCode: event.data.object.customer_details?.address?.postal_code || "",
                state: event.data.object.customer_details?.address?.state || "",
            },
            email: event.data.object.customer_details?.email || "",
            name: event.data.object.customer_details?.name || "",
            phone: event.data.object.customer_details?.phone || "",
        },
        fulfilment: {
            date: fulfilment?.date || "",
            interval: fulfilment?.interval || "",
        }
    }
}

interface Attributes {
    fulfillment?: {
        M: {
            date: { S: string };
            interval: { S: string };
        }
    };
}

export const extractFulfillmentDetails = (attributes?: Attributes) => {
    const fulfillment = attributes?.fulfillment?.M;
    const date = fulfillment?.date?.S || "";
    const interval = fulfillment?.interval?.S || "";

    return { date, interval };
}
