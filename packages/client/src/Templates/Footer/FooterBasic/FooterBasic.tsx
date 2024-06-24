import React from 'react';
import { Box, Flex, Text } from "@radix-ui/themes"

import Navigation from '../../Components/Navigation/Navigation';
import { TemplateCategory, TemplateComponentType, TemplateStruct } from '../../templateTypes';
import { FooterBasicProps } from '../FooterTypes';

import * as styles from './FooterBasic.scss';
import * as NavigationStyles from "../../Components/Navigation/Navigation.scss"


const FooterBasic: React.FC<FooterBasicProps> = (props) => (
    <footer className={styles.simpleFooter} data-hydration-id={props["data-hydration-id"]}>
        <Box ml='4' mr='4'>
            <Flex align="center" justify="center" direction="column" gap="3">
                <Navigation
                    items={props.links}
                />
                <Navigation
                    items={props.mediaLinks}
                />
            </Flex>
        </Box>
        <Text as="p">
            © {new Date().getFullYear()} {props.name}. All rights reserved.
        </Text>
    </footer>
);

export const FooterBasicItem: TemplateStruct<FooterBasicProps> = {
    name: TemplateComponentType.FOOTER_BASIC,
    description: "Footer Basic",
    Component: FooterBasic,
    categories: [TemplateCategory.FOOTER],
    classNames: [
        ...Object.values(styles),
        ...Object.values(NavigationStyles),
    ],
    props: {
        name: "Maistro",
        links: [
            {
                name: "Home",
                href: "/",
                isExternal: false,
                description: "Home page",
            },
            {
                name: "About",
                href: "/about",
                isExternal: false,
                description: "About page",
            },
            {
                name: "Contact",
                href: "/contact",
                isExternal: false,
                description: "contact page",
            },
        ],
        mediaLinks: [
            {
                name: "Facebook",
                imgSrc: "",
                href: "/",
                isExternal: true,
                description: "Facebook",
            },
            {
                name: "Instagram",
                imgSrc: "",
                href: "/",
                isExternal: true,
                description: "Instagram",
            },
            {
                name: "TikTok",
                imgSrc: "",
                href: "/",
                isExternal: true,
                description: "TikTok",
            },
        ]
    },
};

export default FooterBasic;
