import React from "react"

import { ContentStruct, ContentCategory } from "../../../../types"

import Logo from "../../Components/Logo/Logo"
import * as LogoStyles from "../../Components/Logo/Logo.scss"

import Nav from "../../Components/Nav/Nav"
import * as NavStyles from "../../Components/Nav/Nav.scss"
import * as NavLinkStyles from "../../Components/NavLink/NavLink.scss"

import { HeaderProps } from "../HeaderTypes"

import * as styles from "./HeaderBasic.scss"

const HeaderBasic: React.FC<HeaderProps> = (props) => {
    return (
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                <Logo
                    imgUrl={props.logo.url}
                    slogan={props.logo.slogan}
                />
                <Nav
                    links={props.links}
                />
            </div>
        </header>
    )
}

export const HeaderBasicItem: ContentStruct = {
    id: "HeaderBasic",
    description: "A simple, straightforward navigation bar with clear, bold links and a distinct logo area. Suitable for minimalist or traditional website designs",
    categories: [ContentCategory.HEADER],
    Component: HeaderBasic,
    classNames: [
        ...Object.values(styles),
        ...Object.values(LogoStyles),
        ...Object.values(NavStyles),
        ...Object.values(NavLinkStyles),
    ],
    props: {
        logo: {
            url: "https://maistro.website/assets/pages/generic/logo.png",
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