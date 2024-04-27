import React from "react"

import HeaderBurger from "../../../../Components/Gallery/Header/HeaderBurger/HeaderBurger"
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
                },
                links: {
                    login: {
                        href: appRoutes.getSettingsRoute(),
                        value: (
                            <Box className={styles.headerLink}>
                                <Avatar
                                    size="2"
                                    src={user.getAvatar()}
                                    fallback={user.getName().charAt(0)}
                                />
                                <Text as="p" className={styles.headerText}>My Settings</Text>
                            </Box>
                        ),
                    }
                },
            }
            }
        />
    )
}

export default RouteProjectHeader
