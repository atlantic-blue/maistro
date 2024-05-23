import React from "react";
import { ApiContext } from "../Api/ApiProvider";
import { AuthContext } from "../Auth/AuthProvider";
import { Routes } from "../Routes/router";

export enum PaymentPlan {
    FREE = "FREE",
    BASIC = "BASIC",
    STANDARD = "STANDARD",
    PREMIUM = "PREMIUM",
    VIP = "VIP"
}

interface PaymentsContextState {
    isLoading: boolean
    redirectToPaymentPlans: () => void
    paymentPlan: PaymentPlan
}

export const PaymentsContext = React.createContext<PaymentsContextState>({
    isLoading: false,
    redirectToPaymentPlans: () => null,
    paymentPlan: PaymentPlan.FREE,
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
    },
    aiImage: {
        [PaymentPlan.FREE]: () => false,
        [PaymentPlan.BASIC]: () => true,
        [PaymentPlan.STANDARD]: () => true,
        [PaymentPlan.PREMIUM]: () => true,
        [PaymentPlan.VIP]: () => true,
    },
    aiText: {
        [PaymentPlan.FREE]: () => false,
        [PaymentPlan.BASIC]: () => true,
        [PaymentPlan.STANDARD]: () => true,
        [PaymentPlan.PREMIUM]: () => true,
        [PaymentPlan.VIP]: () => true,
    },
    connectedAccount: {
        [PaymentPlan.FREE]: () => false,
        [PaymentPlan.BASIC]: () => true,
        [PaymentPlan.STANDARD]: () => true,
        [PaymentPlan.PREMIUM]: () => true,
        [PaymentPlan.VIP]: () => true,
    },
    createPage: {
        [PaymentPlan.FREE]: (currentPages: number) => false,
        [PaymentPlan.BASIC]: (currentPages: number) => currentPages < 2,
        [PaymentPlan.STANDARD]: (currentPages: number) => currentPages < 10,
        [PaymentPlan.PREMIUM]: (currentPages: number) => true,
        [PaymentPlan.VIP]: (currentPages: number) => true,
    },
    createProject: {
        [PaymentPlan.FREE]: (currentProjects: number) => false,
        [PaymentPlan.BASIC]: (currentProjects: number) => false,
        [PaymentPlan.STANDARD]: (currentProjects: number) => currentProjects < 2,
        [PaymentPlan.PREMIUM]: (currentProjects: number) => currentProjects < 9,
        [PaymentPlan.VIP]: (currentProjects: number) => currentProjects < 9,
    },
    deleteProject: {
        [PaymentPlan.FREE]: (currentProjects: number) => false,
        [PaymentPlan.BASIC]: (currentProjects: number) => true,
        [PaymentPlan.STANDARD]: (currentProjects: number) => true,
        [PaymentPlan.PREMIUM]: (currentProjects: number) => true,
        [PaymentPlan.VIP]: (currentProjects: number) => true,
    }
}

const PaymentsProvider: React.FC<PaymentsProviderProps> = (props) => {
    const { api } = React.useContext(ApiContext)
    const { user } = React.useContext(AuthContext)
    const [isLoading, setIsLoading] = React.useState(false)
    const [paymentPlan, setPaymentPlan] = React.useState(PaymentPlan.FREE)

    React.useEffect(() => {
        if (!user) {
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

    const redirectToPaymentPlans = async () => {
        window.open(Routes.PAYMENTS_PRICING)
    }

    return (
        <>
            <PaymentsContext.Provider value={{ paymentPlan, redirectToPaymentPlans, isLoading }}>
                {props.children}
            </PaymentsContext.Provider>
        </>
    )
}


export default PaymentsProvider