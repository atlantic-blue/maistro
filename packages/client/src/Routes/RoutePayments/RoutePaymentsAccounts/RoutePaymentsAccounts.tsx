import React from "react"

import { ProjectsContext } from "../../../Projects"

import { Avatar, Blockquote, Button, Card, Code, Flex, Heading, Text } from "@radix-ui/themes"

import { ApiContext } from "../../../Api/ApiProvider"
import { PaymentsContext, canUseFeature } from "../../../Payments/PaymentsProvider"
import * as styles from "./RoutePaymentsAccounts.scss"
import { appRoutes } from "../../router"
import PaymentPlan from "../../../Payments/PaymentPlan/PaymentPlan"
import HeaderBurger from "../../../Templates/Header/HeaderBurger/HeaderBurger"

const RoutePaymentsAccounts: React.FC = () => {
    const { api } = React.useContext(ApiContext)
    const { user } = React.useContext(ProjectsContext)
    const {
        paymentPlan,
        redirectToPaymentPlans,
        setConnectedAccount,
        connectedAccount
    } = React.useContext(PaymentsContext)
    const [isLoading, setIsLoading] = React.useState(false)

    const onCreateConnectedAccount = async () => {
        setIsLoading(true)

        api.payments.accounts.create({
            token: user.getTokenId(),
        })
            .then((response) => {
                if (response.account) {
                    setConnectedAccount(response.account);
                }
            }).finally(() => {
                setIsLoading(false)
            })
    }

    const onCreateConnectedAccountLink = async () => {
        if (!connectedAccount) {
            return
        }

        setIsLoading(true);
        api.payments.accountsLink.create({
            token: user.getTokenId(),
            accountId: connectedAccount?.id,
        })
            .then((response) => {
                const { url } = response?.accountLink

                if (url) {
                    window.location.href = url;
                }
            }).finally(() => {
                setIsLoading(false)
            })
    }

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
                        {
                            href: appRoutes.getSettingsRoute(),
                            name: (
                                <Flex align="center" gap="2" justify="center">
                                    <PaymentPlan />
                                    <Avatar
                                        size="1"
                                        src={user.getAvatar()}
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
            <Heading size="4" as="h1" align="center">
                Payments Account
            </Heading>

            <Card m="4">
                <Flex direction="column" justify="center" align="center" gap="3">
                    {!connectedAccount && (
                        <Button
                            onClick={canUseFeature.connectedAccount[paymentPlan]() ? onCreateConnectedAccount : redirectToPaymentPlans}
                            loading={isLoading}
                        >
                            Upgrade to a payments account
                        </Button>
                    )}

                    {connectedAccount && (
                        <>
                            <Flex className="content" direction="column" justify="center" align="center">
                                <Heading size="2" as="h3" align="center">
                                    Add information to start accepting money
                                </Heading>

                                <Text>
                                    Grow with Maistro.
                                </Text>
                            </Flex>

                            <Blockquote className="dev-callout" size="3">
                                <p>Your connected account ID is: </p>
                                <Code className="bold">{connectedAccount?.id}</Code>
                            </Blockquote>
                            <Button
                                onClick={canUseFeature.connectedAccount[paymentPlan]() ? onCreateConnectedAccountLink : redirectToPaymentPlans}
                                loading={isLoading}
                            >
                                Add information
                            </Button>
                        </>
                    )}
                </Flex>

            </Card>
        </div >
    )
}

export default RoutePaymentsAccounts
