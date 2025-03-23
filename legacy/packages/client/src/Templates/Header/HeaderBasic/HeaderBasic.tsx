import React from "react"

import Logo from "../../Components/Logo/Logo"

import * as LogoStyles from "../../Components/Logo/Logo.scss"
import * as NavigationStyles from "../../Components/Navigation/Navigation.scss"
import * as styles from "./HeaderBasic.scss"

import { HeaderProps } from "../HeaderTypes"

import Navigation from "../../Components/Navigation/Navigation"
import { Box, Flex } from "@radix-ui/themes"
import classNames from "classnames"

const HeaderBasic: React.FC<HeaderProps> = ({
    logo,
    links,
    ...props
}) => {
    return (
        <header className={classNames(styles.header)} data-hydration-id={props["data-hydration-id"]}>
            <Box ml="6" mr='6'>
                <Flex align="center" justify="between">
                    <Logo
                        href={logo.href}
                        imgUrl={logo.url}
                        slogan={logo.slogan}
                    />
                    <Navigation
                        items={links}
                    />
                </Flex>
            </Box>
        </header >
    )
}

export default HeaderBasic