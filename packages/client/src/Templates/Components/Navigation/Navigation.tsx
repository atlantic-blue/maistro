import React from "react";
import { CaretDownIcon } from '@radix-ui/react-icons';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import * as styles from "./Navigation.scss"
import { Avatar } from "@radix-ui/themes";

export interface NavigationItem {
    name: string | React.ReactNode
    href?: string
    onClick?: () => void
    isExternal?: boolean
    imgSrc?: string
    children?: NavigationItem[]
    description: string
}

interface NavigationProps {
    items?: NavigationItem[]
}

const Navigation: React.FC<NavigationProps> = (props) => {
    return (
        <NavigationMenu.Root className={styles.navigationMenuRoot}>
            <NavigationMenu.List className={styles.navigationMenuList}>
                {Array.isArray(props.items) && props.items?.map((item, key) => {
                    if (item.children) {
                        return (
                            <NavigationMenu.Item key={`NavigationMenu-${key}`}>
                                <NavigationMenu.Trigger className={styles.navigationMenuTrigger}>
                                    {item.name} <CaretDownIcon className={styles.caretDown} aria-hidden />
                                </NavigationMenu.Trigger>
                                <NavigationMenu.Content className={styles.navigationMenuContent}>
                                    <ul className={styles.list}>
                                        {item.children?.map((childItem, childKey) => {
                                            return (
                                                <NavigationMenu.Link asChild key={`NavigationMenu-${childKey}`}>
                                                    <a className={styles.listItemLink} href={childItem.href} aria-label={childItem.description} target="_blank" rel="noopener noreferrer">
                                                        <div className={styles.listItemHeading}>{childItem.name}</div>
                                                        <p className={styles.listItemText}>{childItem.description}</p>
                                                    </a>
                                                </NavigationMenu.Link>
                                            )
                                        })}
                                    </ul>
                                </NavigationMenu.Content>
                            </NavigationMenu.Item>
                        )
                    }

                    return (
                        <NavigationMenu.Item key={`NavigationMenu-${key}`}>
                            <NavigationMenu.Link
                                onClick={item.onClick}
                                className={styles.navigationMenuLink}
                                href={item.href}
                                target={item.isExternal ? "_blank" : "_self"} rel="noopener noreferrer"
                                aria-label={item.description}
                            >
                                {item.imgSrc ?
                                    <Avatar
                                        size="2"
                                        src={item.imgSrc}
                                        fallback={typeof item.name === "string" && item.name.charAt(0)}
                                    /> :
                                    item.name}
                            </NavigationMenu.Link>
                        </NavigationMenu.Item>
                    )
                })}

                <NavigationMenu.Indicator className={styles.navigationMenuIndicator}>
                    <div className={styles.arrow} />
                </NavigationMenu.Indicator>
            </NavigationMenu.List>

            <div className={styles.viewportPosition}>
                <NavigationMenu.Viewport className={styles.navigationMenuViewport} />
            </div>
        </NavigationMenu.Root>
    );
};

export default Navigation;