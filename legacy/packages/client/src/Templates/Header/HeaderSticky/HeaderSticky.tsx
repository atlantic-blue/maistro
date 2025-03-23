import React, { useState, useEffect } from 'react';

import { HeaderProps } from '../HeaderTypes';

import Logo from "../../Components/Logo/Logo"

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
            <Box ml='6' mr='6'>
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

export default HeaderSticky;
