import React from "react"

import Logo from "../../Components/Logo/Logo"

import * as LogoStyles from "../../Components/Logo/Logo.scss"
import * as NavigationStyles from "../../Components/Navigation/Navigation.scss"
import * as styles from "./HeaderBasic.scss"

import { HeaderProps } from "../HeaderTypes"

import { TemplateCategory, TemplateComponentType, TemplateStruct } from "../../templateTypes"
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


export const HeaderBasicItem: TemplateStruct = {
    name: TemplateComponentType.HEADER_BASIC,
    description: "Simple header",
    categories: [TemplateCategory.HEADER],
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
                href: "/",
                description: "Home page",
            },
            {
                name: "About",
                href: "/about",
                description: "About page",
            },
            {
                name: "Contact",
                href: "/contact",
                description: "contact page",
            },
        ]
    }
}

export default HeaderBasic