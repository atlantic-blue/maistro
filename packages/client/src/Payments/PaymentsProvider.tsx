import React from "react";
import { ApiContext } from "../Api/ApiProvider";
import { AuthContext } from "../Auth/AuthProvider";
import env from "../env";
import { getStripe } from "./stripe";

interface PaymentsContextState {
    isSubscribed: boolean
    redirectToCheckout: () => void
}

export const PaymentsContext = React.createContext<PaymentsContextState>({
    isSubscribed: false,
    redirectToCheckout: () => null
})

interface PaymentsProviderProps {
    children: React.ReactNode
}

const PaymentsProvider: React.FC<PaymentsProviderProps> = (props) => {
    const { api } = React.useContext(ApiContext)
    const { user } = React.useContext(AuthContext)
    const [isSubscribed, setIsSubscribed] = React.useState(false)

    React.useEffect(() => {
        if (!user) {
            return
        }

        api
            .payments
            .subscriptions
            .read({ token: user.getTokenId() })
            .then(response => {
                if (response?.subscription?.status === 'active') {
                    setIsSubscribed(true)
                }
            })

    }, [user])

    const redirectToCheckout = async () => {
        if (!user) {
            // TODO APP LEVEL ERROR
            console.warn("USER NOT SET, CANNOT SET SUBSCRIPTION WITHOUT AN USER")
            return null
        }

        const stripe = await getStripe();
        if (!stripe) {
            // TODO APP LEVEL ERROR
            console.warn("STRIPE NOT SET INITIALISED")
            return
        }

        const { error } = await stripe.redirectToCheckout({
            mode: 'subscription',
            lineItems: [
                {
                    price: env.payments.stripe.subscriptionPriceId,
                    quantity: 1,
                },
            ],
            successUrl: env.payments.successUrl,
            cancelUrl: env.payments.cancelUrl,
            customerEmail: user.getEmail(),
            clientReferenceId: user.getId(),
        });

        // TODO APP LEVEL ERROR
        console.warn(error.message);
    }

    return (
        <>
            <PaymentsContext.Provider value={{ isSubscribed, redirectToCheckout }}>
                {props.children}
            </PaymentsContext.Provider>
        </>
    )
}


export default PaymentsProvider