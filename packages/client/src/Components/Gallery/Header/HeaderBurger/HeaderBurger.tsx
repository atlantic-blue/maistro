import React, { useState } from 'react';

import { ContentStruct, ContentCategory } from '../../../../types';

import Logo from "../../Components/Logo/Logo"
import * as LogoStyles from "../../Components/Logo/Logo.scss"

import Nav from "../../Components/Nav/Nav"
import * as NavStyles from "../../Components/Nav/Nav.scss"
import * as NavLinkStyles from "../../Components/NavLink/NavLink.scss"

import { HeaderProps } from '../HeaderTypes';

import * as styles from "./HeaderBurger.scss";
import classNames from 'classnames';

const HeaderBurger: React.FC<HeaderProps> = (props) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className={styles.headerBurger}>
            <div className={styles.headerBurgerContainer}>
                <Logo
                    imgUrl={props.logo.url}
                    slogan={props.logo.slogan}
                />
                <div className={`${styles.menuToggle} ${isMenuOpen ? styles.open : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <div className={styles.hamburger}></div>
                </div>
                <Nav
                    links={props.links}
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

export const HeaderBurgerItem: ContentStruct = {
    id: "HeaderBurgerItem",
    Component: HeaderBurger,
    categories: [ContentCategory.HEADER],
    description: "With a transparent background that blends into the website's hero section or background image, this navigation style offers a seamless integration. Best used on visually rich websites where the navigation should complement the background imagery",
    classNames: [
        ...Object.values(styles),
        ...Object.values(LogoStyles),
        ...Object.values(NavStyles),
        ...Object.values(NavLinkStyles),
    ],
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
    },
}

export default HeaderBurger;
