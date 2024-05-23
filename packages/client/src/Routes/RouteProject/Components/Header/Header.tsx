import React from "react"

import HeaderBurger from "../../../../Templates/Header/HeaderBurger/HeaderBurger"
import { appRoutes } from "../../../router"
import { Avatar, Box, Flex, Text } from "@radix-ui/themes"
import { ProjectsContext } from "../../../../Projects"

import * as styles from "./Header.scss"
import PaymentPlan from "../../../../Payments/PaymentPlan/PaymentPlan"

interface RouteProjectHeaderProps {

}

const RouteProjectHeader: React.FC<RouteProjectHeaderProps> = (props) => {
    const { user } = React.useContext(ProjectsContext)
    return (
        <HeaderBurger
            {
            ...{
                logo: {
                    url: "https://maistro.website/assets/logo.svg",
                    slogan: "Maistro",
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
                            </Flex>
                        ),
                        description: "My settings"
                    }
                ]
            }
            }
        />
    )
}

export default RouteProjectHeader
