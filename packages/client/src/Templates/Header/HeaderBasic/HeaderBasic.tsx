import React from "react"

import Logo from "../../Components/Logo/Logo"

import Nav from "../../Components/Nav/Nav"

import * as LogoStyles from "../../Components/Logo/Logo.scss"
import * as NavStyles from "../../Components/Nav/Nav.scss"
import * as NavLinkStyles from "../../Components/NavLink/NavLink.scss"
import * as styles from "./HeaderBasic.scss"

import { HeaderProps } from "../HeaderTypes"

import { ContentCategory, TemplateComponentType, TemplateStruct } from "../../templateTypes"

const COMPONENT_NAME = TemplateComponentType.HEADER_BASIC
const HeaderBasic: React.FC<HeaderProps> = ({
    logo,
    links,
    ...props
}) => {
    return (
        <header className={styles.header} data-hydration-id={props["data-hydration-id"]}>
            <div className={styles.headerContainer}>
                <Logo
                    imgUrl={logo.url}
                    slogan={logo.slogan}
                />
                <Nav
                    links={links}
                />
            </div>
        </header>
    )
}


export const HeaderBasicItem: TemplateStruct = {
    name: COMPONENT_NAME,
    description: "Simple header",
    categories: [ContentCategory.HEADER],
    classNames: [
        ...Object.values(styles),
        ...Object.values(LogoStyles),
        ...Object.values(NavStyles),
        ...Object.values(NavLinkStyles),
    ],
    Component: HeaderBasic,
    props: {
        logo: {
            url: "https://maistro.website/assets/logo.svg",
            slogan: "Empowering Your Vision"
        },
        links: {
            home: {
                href: "#home",
                value: "Home",
            },
            about: {
                href: "#about",
                value: "About",
            },
            services: {
                href: "#services",
                value: "Services",
            },
            contact: {
                href: "#contact",
                value: "Contact",
            }
        },
    }
}

export default HeaderBasic