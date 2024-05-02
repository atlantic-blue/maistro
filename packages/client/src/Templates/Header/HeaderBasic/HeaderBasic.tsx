import React from "react"

import Logo from "../../Components/Logo/Logo"

import * as LogoStyles from "../../Components/Logo/Logo.scss"
import * as NavigationStyles from "../../Components/Navigation/Navigation.scss"
import * as styles from "./HeaderBasic.scss"

import { HeaderProps } from "../HeaderTypes"

import { ContentCategory, TemplateComponentType, TemplateStruct } from "../../templateTypes"
import Navigation from "../../Components/Navigation/Navigation"
import { Box, Flex } from "@radix-ui/themes"

const HeaderBasic: React.FC<HeaderProps> = ({
    logo,
    links,
    ...props
}) => {
    return (
        <header className={styles.header} data-hydration-id={props["data-hydration-id"]}>
            <Box ml='4' mr='4'>
                <Flex align="center" justify="between">
                    <Logo
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


export const HeaderBasicItem: TemplateStruct = {
    name: TemplateComponentType.HEADER_BASIC,
    description: "Simple header",
    categories: [ContentCategory.HEADER],
    classNames: [
        ...Object.values(styles),
        ...Object.values(LogoStyles),
        ...Object.values(NavigationStyles),
    ],
    Component: HeaderBasic,
    props: {
        logo: {
            url: "https://maistro.website/assets/logo.svg",
            slogan: "Empowering Your Vision"
        },
        links: [
            {
                name: "Home",
                href: "/"
            },
            {
                name: "About",
                href: "/about",
            },
            {
                name: "Contact",
                href: "/contact"
            },
        ]
    }
}

export default HeaderBasic