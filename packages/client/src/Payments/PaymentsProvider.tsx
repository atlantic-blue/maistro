import React from "react";
import { ApiContext } from "../Api/ApiProvider";
import { AuthContext } from "../Auth/AuthProvider";
import { Routes } from "../Routes/router";
import { ConnectedAccount } from "../Api/Payments/PaymentsAccountsRead";

export enum PaymentPlan {
    FREE = "FREE",
    BASIC = "BASIC",
    STANDARD = "STANDARD",
    PREMIUM = "PREMIUM",
    VIP = "VIP",

    ADMIN = "ADMIn"
}

interface PaymentsContextState {
    isLoading: boolean
    redirectToPaymentPlans: () => void
    paymentPlan: PaymentPlan
    connectedAccount: null | ConnectedAccount
    setConnectedAccount: (acc: ConnectedAccount) => void
}

export const PaymentsContext = React.createContext<PaymentsContextState>({
    isLoading: false,
    redirectToPaymentPlans: () => null,
    paymentPlan: PaymentPlan.FREE,
    connectedAccount: null,
    setConnectedAccount: (acc: ConnectedAccount) => null
})

interface PaymentsProviderProps {
    children: React.ReactNode
}

export const canUseFeature = {
    aiAssistant: {
        [PaymentPlan.FREE]: (tokens: number) => tokens < 500,
        [PaymentPlan.BASIC]: (tokens: number) => true,
        [PaymentPlan.STANDARD]: (tokens: number) => true,
        [PaymentPlan.PREMIUM]: (tokens: number) => true,
        [PaymentPlan.VIP]: (tokens: number) => true,
        [PaymentPlan.ADMIN]: (tokens: number) => true,
    },
    aiImage: {
        [PaymentPlan.FREE]: () => false,
        [PaymentPlan.BASIC]: () => true,
        [PaymentPlan.STANDARD]: () => true,
        [PaymentPlan.PREMIUM]: () => true,
        [PaymentPlan.VIP]: () => true,
        [PaymentPlan.ADMIN]: () => true,
    },
    aiText: {
        [PaymentPlan.FREE]: () => false,
        [PaymentPlan.BASIC]: () => true,
        [PaymentPlan.STANDARD]: () => true,
        [PaymentPlan.PREMIUM]: () => true,
        [PaymentPlan.VIP]: () => true,
        [PaymentPlan.ADMIN]: () => true,
    },
    connectedAccount: {
        [PaymentPlan.FREE]: () => false,
        [PaymentPlan.BASIC]: () => true,
        [PaymentPlan.STANDARD]: () => true,
        [PaymentPlan.PREMIUM]: () => true,
        [PaymentPlan.VIP]: () => true,
        [PaymentPlan.ADMIN]: () => true,
    },
    createPage: {
        [PaymentPlan.FREE]: (currentPages: number) => currentPages < 1,
        [PaymentPlan.BASIC]: (currentPages: number) => currentPages < 10,
        [PaymentPlan.STANDARD]: (currentPages: number) => currentPages < 20,
        [PaymentPlan.PREMIUM]: (currentPages: number) => true,
        [PaymentPlan.VIP]: (currentPages: number) => true,
        [PaymentPlan.ADMIN]: (currentPages: number) => true,
    },
    createProject: {
        [PaymentPlan.FREE]: (currentProjects: number) => currentProjects < 1,
        [PaymentPlan.BASIC]: (currentProjects: number) => currentProjects < 3,
        [PaymentPlan.STANDARD]: (currentProjects: number) => currentProjects < 3,
        [PaymentPlan.PREMIUM]: (currentProjects: number) => currentProjects < 9,
        [PaymentPlan.VIP]: (currentProjects: number) => currentProjects < 9,
        [PaymentPlan.ADMIN]: (currentProjects: number) => true,
    },
    deleteProject: {
        [PaymentPlan.FREE]: (currentProjects: number) => false,
        [PaymentPlan.BASIC]: (currentProjects: number) => true,
        [PaymentPlan.STANDARD]: (currentProjects: number) => true,
        [PaymentPlan.PREMIUM]: (currentProjects: number) => true,
        [PaymentPlan.VIP]: (currentProjects: number) => true,
        [PaymentPlan.ADMIN]: (currentProjects: number) => true,
    }
}

const PaymentsProvider: React.FC<PaymentsProviderProps> = (props) => {
    const { api } = React.useContext(ApiContext)
    const { user } = React.useContext(AuthContext)
    const [isLoading, setIsLoading] = React.useState(false)
    const [paymentPlan, setPaymentPlan] = React.useState(PaymentPlan.FREE)
    const [connectedAccount, setConnectedAccount] = React.useState<ConnectedAccount | null>(null)

    /**
     * Subscription plan
     */
    React.useEffect(() => {
        if (!user) {
            return
        }

        if (user.isAdmin()) {
            setPaymentPlan(PaymentPlan.ADMIN)
            return
        }

        setIsLoading(true)
        api
            .payments
            .subscriptions
            .read({ token: user.getTokenId() })
            .then(response => {
                if (response?.subscription?.plan?.product === "prod_PtvxX1MS7QZNfx") {
                    setPaymentPlan(PaymentPlan.BASIC)
                }

                if (response?.subscription?.plan?.product === "prod_Q9erVHJGpWNVeH") {
                    setPaymentPlan(PaymentPlan.STANDARD)
                }

                if (response?.subscription?.plan?.product === "prod_Q9f0Ov40sNk555") {
                    setPaymentPlan(PaymentPlan.PREMIUM)
                }

                if (response?.subscription?.plan?.product === "prod_Q9fd2lGxMkMYOa") {
                    setPaymentPlan(PaymentPlan.VIP)
                }
            })
            .finally(() => {
                setIsLoading(false)
            })

    }, [user])

    /**
     * Connected account
     * https://docs.stripe.com/connect/onboarding/quickstart
     */
    React.useEffect(() => {
        if (!user) {
            return
        }
        if (connectedAccount) {
            return
        }

        setIsLoading(true)
        api.payments.accounts
            .read({ token: user.getTokenId() })
            .then(response => {
                if (!response) {
                    return
                }

                if (response[0]) {
                    setConnectedAccount(response[0])
                }
            }).finally(() => {
                setIsLoading(false)
            })
    }, [user])

    const redirectToPaymentPlans = async () => {
        window.open(Routes.PAYMENTS_PRICING)
    }

    return (
        <>
            <PaymentsContext.Provider value={{
                paymentPlan,
                redirectToPaymentPlans,

                connectedAccount,
                setConnectedAccount,

                isLoading,
            }}>
                {props.children}
            </PaymentsContext.Provider>
        </>
    )
}


export default PaymentsProvider