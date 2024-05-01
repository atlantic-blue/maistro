import React, { useState, useEffect } from 'react';

import { TemplateStruct, ContentCategory, TemplateComponentType } from '../../templateTypes';

import { HeaderProps } from '../HeaderTypes';

import Logo from "../../Components/Logo/Logo"

import Nav from "../../Components/Nav/Nav"
import * as LogoStyles from "../../Components/Logo/Logo.scss"
import * as NavStyles from "../../Components/Nav/Nav.scss"
import * as NavLinkStyles from "../../Components/NavLink/NavLink.scss"
import * as styles from "./HeaderSticky.scss"
import { Box, Flex, Section } from '@radix-ui/themes';

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
        <Section size="1" className={`${styles.headerSticky} ${isScrolled ? styles.scrolled : ''}`} data-hydration-id={props["data-hydration-id"]}>
            <Box ml='4' mr='4'>
                <Flex align="center" justify="between">
                    <Logo
                        imgUrl={logo.url}
                        slogan={logo.slogan}
                    />
                    <Nav
                        links={links}
                    />
                </Flex>
            </Box>
        </Section>
    );
};

export const HeaderStickyItem: TemplateStruct = {
    name: TemplateComponentType.HEADER_STICKY,
    Component: HeaderSticky,
    description: "Sticky navigation bar",
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
