import React, { useEffect, useState } from "react"

import { ProjectsContext } from "../../Projects"
import RouteProjectHeader from "../RouteProject/Components/Header/Header"

import { Blockquote, Button, Card, Code, Flex, Heading, Text } from "@radix-ui/themes"

import { ApiContext } from "../../Api/ApiProvider"
import { PaymentsContext } from "../../Payments/PaymentsProvider"
import * as styles from "./RoutePaymentsAccounts.scss"
import { useParams } from "react-router-dom"

const RoutePaymentsAccounts: React.FC = () => {
    const { api } = React.useContext(ApiContext)
    const { user } = React.useContext(ProjectsContext)
    const { isSubscribed, redirectToCheckout } = React.useContext(PaymentsContext)
    const [connectedAccount, setConnectedAccount] = useState<{ id: string }>();
    const [isLoading, setIsLoading] = React.useState(false)

    useEffect(() => {
        if (!connectedAccount) {
            return
        }

        api.payments.accounts.readById({
            accountId: connectedAccount?.id,
            token: user.getTokenId(),
        }).then(response => {
            console.log({ response })
        })
    }, [connectedAccount])

    useEffect(() => {
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
    }, [])

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
            <RouteProjectHeader user={user} />

            <br />
            <Heading size="4" as="h1" align="center">
                Payments Account
            </Heading>

            <Card m="4">
                <Flex direction="column" justify="center" align="center" gap="3">
                    {!connectedAccount && (
                        <Button
                            onClick={isSubscribed ? onCreateConnectedAccount : redirectToCheckout}
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
                        </>
                    )}

                    {connectedAccount && (
                        <Button
                            onClick={isSubscribed ? onCreateConnectedAccountLink : redirectToCheckout}
                            loading={isLoading}
                        >
                            Add information
                        </Button>
                    )}
                </Flex>

            </Card>
        </div >
    )
}

export default RoutePaymentsAccounts
