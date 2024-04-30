import React, { useState } from 'react';

import { TemplateStruct, ContentCategory, TemplateComponentType } from '../../templateTypes';

import Logo from "../../Components/Logo/Logo"
import Nav from "../../Components/Nav/Nav"

import * as LogoStyles from "../../Components/Logo/Logo.scss"
import * as NavStyles from "../../Components/Nav/Nav.scss"
import * as NavLinkStyles from "../../Components/NavLink/NavLink.scss"
import * as styles from "./HeaderBurger.scss";

import { HeaderProps } from '../HeaderTypes';

import classNames from 'classnames';

const COMPONENT_NAME = TemplateComponentType.HEADER_BURGER
const HeaderBurger: React.FC<HeaderProps> = ({
    logo,
    links,
    ...props
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className={styles.headerBurger} data-hydration-id={props["data-hydration-id"]}>
            <div className={styles.headerBurgerContainer}>
                <Logo
                    imgUrl={logo.url}
                    slogan={logo.slogan}
                />
                <div className={`${styles.menuToggle} ${isMenuOpen ? styles.open : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <div className={styles.hamburger}></div>
                </div>
                <Nav
                    links={links}
                    classNames={{
                        navigation: classNames({
                            [styles.headerBurgerNavigation]: isMenuOpen
                        }),
                        navigationList: classNames({
                            [styles.open]: isMenuOpen
                        })
                    }}
                />
            </div>
        </nav>
    );
};

export const HeaderBurgerItem: TemplateStruct = {
    name: COMPONENT_NAME,
    Component: HeaderBurger,
    categories: [ContentCategory.HEADER],
    description: "Header Burger",
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
    },
}

export default HeaderBurger;
