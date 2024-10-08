import React from 'react';
import { Avatar, Box, Flex, Link, Text } from "@radix-ui/themes"

import { TemplateCategory, TemplateComponentType, TemplateStruct } from '../../templateTypes';
import { FooterBasicProps } from '../FooterTypes';

import * as styles from './FooterBasic.scss';
import AvatarMaistro from '../../../Components/AvatarMaistro/AvatarMaistro';
import IconLogo, { IconLogoSimple } from '../../../Components/Icons/Logo/Logo';

const FooterBasic: React.FC<FooterBasicProps> = (props) => (
    <footer className={styles.simpleFooter} data-hydration-id={props["data-hydration-id"]}>
        <Box ml='4' mr='4'>
            <Flex align="center" justify="center" direction="column" gap="3">
                <Flex justify="center" align="center" wrap="wrap" gap="4" m="2">
                    {
                        props?.links?.map(item => {
                            return (
                                <Link
                                    key={item.href}
                                    onClick={item.onClick}
                                    href={item.href}
                                    target={item.isExternal ? "_blank" : "_self"} rel="noopener noreferrer"
                                    aria-label={item.description}
                                >
                                    {item.imgSrc ?
                                        <Avatar
                                            size="2"
                                            src={item.imgSrc}
                                            alt={item.description}
                                            fallback={typeof item.name === "string" && item.name.charAt(0)}
                                        /> :
                                        item.name}
                                </Link>
                            )
                        })
                    }
                </Flex>

                <Flex justify="center" align="center" wrap="wrap" gap="2" m="2">
                    {
                        props?.mediaLinks?.map(item => {
                            return (
                                <Link
                                    key={item.href}
                                    onClick={item.onClick}
                                    href={item.href}
                                    target={item.isExternal ? "_blank" : "_self"} rel="noopener noreferrer"
                                    aria-label={item.description}
                                >
                                    {item.imgSrc ?
                                        <Avatar
                                            size="2"
                                            src={item.imgSrc}
                                            alt={item.description}
                                            fallback={typeof item.name === "string" && item.name.charAt(0)}
                                        /> :
                                        item.name}
                                </Link>
                            )
                        })
                    }
                </Flex>
            </Flex>
        </Box>
        <Text as="p">
            © {new Date().getFullYear()} {props.name}. All rights reserved.
        </Text>
        <a
            href='https://maistro.website'
            aria-label='maistro'
            target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "var(--accent-10)" }}
        >
            <Flex justify="center" align="center" m="2" gap="1">
                <Text as="p" size="1">
                    Powered by Maistro
                </Text>

                <IconLogoSimple style={{ width: "20px", height: "20px" }} />
            </Flex>
        </a>
    </footer>
);

export const FooterBasicItem: TemplateStruct<FooterBasicProps> = {
    name: TemplateComponentType.FOOTER_BASIC,
    description: "Footer Basic",
    Component: FooterBasic,
    categories: [TemplateCategory.FOOTER],
    classNames: [
        ...Object.values(styles),
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
