import React from "react"

import { ProjectsContext } from "../../Projects"
import RouteProjectHeader from "../RouteProject/Components/Header/Header"

import AuthLogoutButton from "../../Auth/AuthLogoutButton"

import Button from "../../Templates/Components/Button/Button"
import { PaymentPlan, PaymentsContext } from "../../Payments/PaymentsProvider"

import * as styles from "./RouteSettings.scss"
import { Avatar, Card, Heading } from "@radix-ui/themes"
import { useNavigate } from "react-router-dom"
import { Routes } from "../router"

const RoutesSettings: React.FC = () => {
    const { user } = React.useContext(ProjectsContext)
    const navigate = useNavigate();
    const { paymentPlan, isLoading, redirectToPaymentPlans } = React.useContext(PaymentsContext)

    return (
        <div className={styles.main}>
            <RouteProjectHeader user={user} />

            <br />
            <Heading size="4" as="h3" align="center">
                Settings
            </Heading>

            <div className={styles.content}>

                <Card className={styles.section}>
                    <Avatar
                        size="7"
                        src={user.getAvatar()}
                        fallback={user.getName().charAt(0)}
                        alt={user.getName()}
                    />
                    <div>{user.getName()}</div>
                </Card>


                <Card className={styles.section}>
                    <Button
                        size="3"
                        loading={isLoading}
                        onClick={() => {
                            if (paymentPlan !== PaymentPlan.FREE) {
                                window.open("https://billing.stripe.com/p/login/00g4i29gM9GOgz6dQQ", "_blank")
                            } else {
                                navigate(Routes.PAYMENTS_PRICING)
                            }
                        }}
                    >
                        {paymentPlan !== PaymentPlan.FREE ? "Manage Subscription" : "Subscribe Today!"}
                    </Button>

                </Card>

                <Card className={styles.section}>
                    <AuthLogoutButton />
                </Card>
            </div>
        </div >
    )
}

export default RoutesSettings
