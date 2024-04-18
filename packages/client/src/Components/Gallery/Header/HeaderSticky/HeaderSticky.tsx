import React, { useState, useEffect } from 'react';

import { ContentStruct, ContentCategory } from '../../../../types';

import { HeaderProps } from '../HeaderTypes';

import Logo from "../../Components/Logo/Logo"
import * as LogoStyles from "../../Components/Logo/Logo.scss"

import Nav from "../../Components/Nav/Nav"
import * as NavStyles from "../../Components/Nav/Nav.scss"
import * as NavLinkStyles from "../../Components/NavLink/NavLink.scss"

import { set } from 'lodash';
import * as styles from "./HeaderSticky.scss"

const HeaderSticky: React.FC<HeaderProps> = (props) => {
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

    const onChange = (id: string, content: string) => {
        set({ ...props }, id, content)
    }

    return (
        <nav className={`${styles.headerSticky} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.headerStickyContainer}>
                <Logo
                    imgUrl={props.logo.url}
                    slogan={props.logo.slogan}
                />
                <Nav
                    links={props.links}
                />
            </div>
        </nav>
    );
};

export const HeaderStickyItem: ContentStruct = {
    id: "HeaderSticky",
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
