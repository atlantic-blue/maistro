import React, { useState, useEffect } from 'react';

import { TemplateStruct, ContentCategory } from '../../templateTypes';

import { HeaderProps } from '../HeaderTypes';

import Logo from "../../Components/Logo/Logo"

import Nav from "../../Components/Nav/Nav"
import * as LogoStyles from "../../Components/Logo/Logo.scss"
import * as NavStyles from "../../Components/Nav/Nav.scss"
import * as NavLinkStyles from "../../Components/NavLink/NavLink.scss"
import * as styles from "./HeaderSticky.scss"

const COMPONENT_NAME = "HeaderSticky"
const HeaderSticky: React.FC<HeaderProps> = ({
    logo,
    links,
    ...props
}) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`${styles.headerSticky} ${isScrolled ? styles.scrolled : ''}`} data-hydration-id={props["data-hydration-id"]}>
            <div className={styles.headerStickyContainer}>
                <Logo
                    imgUrl={logo.url}
                    slogan={logo.slogan}
                />
                <Nav
                    links={links}
                />
            </div>
        </nav>
    );
};

export const HeaderStickyItem: TemplateStruct = {
    name: COMPONENT_NAME,
    Component: HeaderSticky,
    description: "A sticky navigation bar that changes its background from transparent to solid on scroll, providing a dynamic user experience. This style is versatile, fitting for almost any website looking to enhance usability without sacrificing aesthetics.",
    categories: [ContentCategory.HEADER],
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

export default HeaderSticky;
