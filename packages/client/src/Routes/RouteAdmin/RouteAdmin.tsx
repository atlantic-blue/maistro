import React from "react"
import { Navigate } from "react-router-dom"
import { Avatar, Badge, Flex, Text } from "@radix-ui/themes"

import { appRoutes } from "../router"
import { AuthContext } from "../../Auth/AuthProvider"
import HeaderBurger from "../../Templates/Header/HeaderBurger/HeaderBurger"
import PaymentPlan from "../../Payments/PaymentPlan/PaymentPlan"
import { Crown } from "lucide-react"
import RouteAdminUsersList from "./Components/RouteAdminUsersList"

const RouteAdmin: React.FC = () => {
    const { user } = React.useContext(AuthContext)

    if (!user) {
        return (
            <Navigate to={appRoutes.getLoginRoute()} />
        )
    }

    if (!user.isAdmin()) {
        return (
            <Navigate to={appRoutes.getProjectsRoute()} />
        )
    }

    return (
        <div>
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

            <RouteAdminUsersList />
        </div>
    )
}

export default RouteAdmin
