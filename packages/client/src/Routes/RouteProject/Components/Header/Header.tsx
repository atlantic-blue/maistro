import React from "react"

import HeaderBurger from "../../../../Templates/Header/HeaderBurger/HeaderBurger"
import { appRoutes } from "../../../router"
import { Avatar, Box, Text } from "@radix-ui/themes"
import { ProjectsContext } from "../../../../Projects"

import * as styles from "./Header.scss"

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
                        name: "My Settings",
                        description: "My settings"
                    }
                ]
            }
            }
        />
    )
}

export default RouteProjectHeader
