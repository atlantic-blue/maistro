import StripeSDK from "stripe"

interface PaymentShippingOptions {
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

interface CheckoutsCreateStripeInput {
    checkoutUrl: string
    projectId: string
    returnUrl: string
    accountId: string
    shoppingCartId: string

    items: StripeSDK.Checkout.SessionCreateParams.LineItem[]
    enableShipping: boolean
    allowedCountries: StripeSDK.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[]
    shippingOptions: PaymentShippingOptions[]
    fulfilmentDate: string
    fulfilmentDateInterval: string
}

interface CheckoutsCreateStripeOutput {
    data?: { session: StripeSDK.Response<StripeSDK.Checkout.Session> },
    errors?: Array<{ description: string }>
}

export const checkoutsCreateStripe = async (input: CheckoutsCreateStripeInput): Promise<CheckoutsCreateStripeOutput> => {
    return await fetch(input.checkoutUrl, {
        method: "POST",
        body: JSON.stringify({
            project_id: input.projectId,
            account_id: input.accountId,
            return_url: input.returnUrl,
            shopping_cart_id: input.shoppingCartId,
            line_items: input.items,
            enable_shipping: input.enableShipping,
            shipping_options: input.shippingOptions,
            allowed_countries: input.allowedCountries,
            fulfilment_date: input.fulfilmentDate,
            fulfilment_date_interval: input.fulfilmentDateInterval,
        })
    })
        .then(response => response.json())
        .then((response: { session: StripeSDK.Response<StripeSDK.Checkout.Session> }) => {
            return {
                data: response
            }
        })
        .catch(e => {
            return {
                errors: [
                    {
                        description: "Unable to get products"
                    }
                ]
            }
        })
}
