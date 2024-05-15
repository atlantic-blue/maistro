import React, { useState, useEffect } from 'react';

import { TemplateStruct, TemplateCategory, TemplateComponentType } from '../../templateTypes';

import { HeaderProps } from '../HeaderTypes';

import Logo from "../../Components/Logo/Logo"

import * as LogoStyles from "../../Components/Logo/Logo.scss"
import * as NavigationStyles from "../../Components/Navigation/Navigation.scss"
import * as styles from "./HeaderSticky.scss"
import { Box, Flex, Section } from '@radix-ui/themes';
import Navigation from '../../Components/Navigation/Navigation';

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
                    <Navigation
                        items={links}
                    />
                </Flex>
            </Box>
        </Section>
    );
};

export const HeaderStickyItem: TemplateStruct<HeaderProps> = {
    name: TemplateComponentType.HEADER_STICKY,
    Component: HeaderSticky,
    description: "Sticky navigation bar",
    categories: [TemplateCategory.HEADER],
    classNames: [
        ...Object.values(styles),
        ...Object.values(LogoStyles),
        ...Object.values(NavigationStyles),
    ],
    props: {
        logo: {
            url: "https://maistro.website/assets/pages/generic/logo.png",
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

export default HeaderSticky;
