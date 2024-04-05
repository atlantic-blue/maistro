import React from "react"
import { renderToString } from 'react-dom/server';

import { faker } from '@faker-js/faker';

import { ContentStruct, ContentCategory } from "../../../../types"

import Logo from "../../Components/Logo/Logo"
import Nav from "../../Components/Nav/Nav"

import { HeaderProps } from "../HeaderTypes"

import { onChange } from "../../utils"

import * as styles from "./HeaderBasic.scss"

const HeaderBasic: React.FC<HeaderProps> = (props) => {
    return (
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                <Logo
                    imgUrl={props.logo.url}
                    slogan={props.logo.slogan}
                    edit={props.edit}
                    onChange={onChange(props)}
                />
                <Nav
                    edit={props.edit}
                    links={props.links}
                    onChange={onChange(props)}
                />
            </div>
        </header>
    )
}

export const HeaderBasicItem: ContentStruct<HeaderProps> = {
    id: "HeaderBasic",
    description: "A simple, straightforward navigation bar with clear, bold links and a distinct logo area. Suitable for minimalist or traditional website designs",
    categories: [ContentCategory.HEADER],
    Component: HeaderBasic,
    props: {
        logo: {
            url: "/assets/pages/generic/logo.png",
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