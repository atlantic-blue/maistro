import React from "react"

import ProjectFlow from "./Components/CreateProjectFlow/CreateProjectFlow"

import * as styles from "./RouteProjectsCreate.scss"
import HeaderBurger from "../../Templates/Header/HeaderBurger/HeaderBurger"
import { appRoutes } from "../router"
import { Avatar, Flex, Text } from "@radix-ui/themes"
import PaymentPlan from "../../Payments/PaymentPlan/PaymentPlan"
import { ProjectsContext } from "../../Projects"

const RouteProjectsCreate: React.FC = () => {
    const { user } = React.useContext(ProjectsContext)

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
            <ProjectFlow />
        </div>
    )
}

export default RouteProjectsCreate
