import React from "react";
import { CaretDownIcon } from '@radix-ui/react-icons';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import * as styles from "./Navigation.scss"

export interface NavigationItem {
    name: string | React.ReactNode
    href: string
    children?: NavigationItem[]
    description?: string
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
                            <NavigationMenu.Item key={`NavigationMenu-${item.name}`}>
                                <NavigationMenu.Trigger className={styles.navigationMenuTrigger}>
                                    {item.name} <CaretDownIcon className={styles.caretDown} aria-hidden />
                                </NavigationMenu.Trigger>
                                <NavigationMenu.Content className={styles.navigationMenuContent}>
                                    <ul className={styles.list}>
                                        {item.children?.map(childItem => {
                                            return (
                                                <NavigationMenu.Link asChild key={`NavigationMenu-${childItem.name}`}>
                                                    <a className={styles.listItemLink} href={childItem.href} target="_blank" rel="noopener noreferrer">
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
                        <NavigationMenu.Item key={`NavigationMenu-${item.name}`}>
                            <NavigationMenu.Link className={styles.navigationMenuLink} href={item.href} target="_blank" rel="noopener noreferrer">
                                {item.name}
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