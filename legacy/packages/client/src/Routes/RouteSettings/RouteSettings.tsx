import React from "react"

import { ProjectsContext } from "../../Projects"

import AuthLogoutButton from "../../Auth/AuthLogoutButton"

import Button from "../../Templates/Components/Button/Button"
import { PaymentPlan, PaymentsContext } from "../../Payments/PaymentsProvider"

import * as styles from "./RouteSettings.scss"
import { Avatar, Badge, Card, Flex, Heading, Text } from "@radix-ui/themes"
import { useNavigate } from "react-router-dom"
import { appRoutes } from "../router"
import HeaderBurger from "../../Templates/Header/HeaderBurger/HeaderBurger"
import PaymentPlanComponent from "../../Payments/PaymentPlan/PaymentPlan"
import { Crown } from "lucide-react"

const RoutesSettings: React.FC = () => {
    const { user } = React.useContext(ProjectsContext)
    const navigate = useNavigate();
    const { paymentPlan, isLoading, redirectToPaymentPlans } = React.useContext(PaymentsContext)

    return (
        <div className={styles.main}>
            <HeaderBurger
                {
                ...{
                    logo: {
                        url: "https://maistro.website/assets/logo.svg",
                        slogan: "Maistro",
                        href: appRoutes.getHomeRoute()
                    },
                    links: [
                        user.isAdmin() ? {
                            href: appRoutes.getAdminRoute(),
                            name: (
                                <Flex align="center" gap="2" justify="center">
                                    <Badge>
                                        <Crown />
                                    </Badge>
                                </Flex>
                            )
                        } : {},
                        {
                            href: appRoutes.getSettingsRoute(),
                            name: (
                                <Flex align="center" gap="2" justify="center">
                                    <PaymentPlanComponent />
                                    <Avatar
                                        size="1"
                                        src={user.getAvatar()}
                                        alt={user.getName()}
                                        fallback={user.getName().charAt(0)}
                                    />
                                    <Text>Settings</Text>
                                </Flex>
                            ),
                            description: "My settings"
                        },
                    ]
                }
                }
            />

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
                    <Flex gap="2">
                        <Button
                            size="3"
                            loading={isLoading}
                            onClick={() => {
                                if (paymentPlan !== PaymentPlan.FREE) {
                                    window.open("https://billing.stripe.com/p/login/00g4i29gM9GOgz6dQQ", "_blank")
                                } else {
                                    navigate(appRoutes.getPaymentsPricingRoute())
                                }
                            }}
                        >
                            {paymentPlan !== PaymentPlan.FREE ? "Subscription" : "Subscribe Today!"}
                        </Button>

                        <Button
                            size="3"
                            onClick={() => {
                                if (paymentPlan === PaymentPlan.FREE) {
                                    navigate(appRoutes.getPaymentsPricingRoute())
                                } else {
                                    navigate(appRoutes.getPaymentsAccountsRoute())
                                }
                            }}
                        >
                            Payments
                        </Button>
                    </Flex>

                </Card>

                <Card className={styles.section}>
                    <AuthLogoutButton />
                </Card>
            </div>
        </div >
    )
}

export default RoutesSettings
