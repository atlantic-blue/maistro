import React from "react"

import { TemplateStruct, ContentCategory } from "../../../../types"

import Logo from "../../Components/Logo/Logo"

import Nav from "../../Components/Nav/Nav"

import * as LogoStyles from "../../Components/Logo/Logo.scss"
import * as NavStyles from "../../Components/Nav/Nav.scss"
import * as NavLinkStyles from "../../Components/NavLink/NavLink.scss"
import * as styles from "./HeaderBasic.scss"

import { HeaderProps } from "../HeaderTypes"

import HeaderBasicEditor from "./HeaderBasicEditor"

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


export const HeaderBasicItem: TemplateStruct = {
    name: "HeaderBasic",
    description: "A simple, straightforward navigation bar with clear, bold links and a distinct logo area. Suitable for minimalist or traditional website designs",
    categories: [ContentCategory.HEADER],
    classNames: [
        ...Object.values(styles),
        ...Object.values(LogoStyles),
        ...Object.values(NavStyles),
        ...Object.values(NavLinkStyles),
    ],
    Component: HeaderBasic,
    ComponentEditor: HeaderBasicEditor,
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