import React from "react"

import NavLink from "../NavLink/NavLink"
import classNames from "classnames";

import * as styles from "./Nav.scss"
import { NavigationItem } from "../Navigation/Navigation";

export interface Link {
    href: string;
    value: string
    links?: NavigationItem[]
}

interface NavProps {
    links?: NavigationItem[]
    classNames?: {
        navigation: string
        navigationList: string
    }
}

const Nav: React.FC<NavProps> = (props) => {
    return (
        <nav className={classNames(styles.navigation, props.classNames?.navigation)}>
            <ul
                className={classNames(styles.navigationList, props.classNames?.navigationList)}
            >
                {
                    Array.isArray(props.links) && props.links?.map((link, key) => {
                        if (!props.links) {
                            return null
                        }

                        return (
                            <NavLink
                                key={props.links[key].href}
                                href={props.links[key].href}
                                value={props.links[key].name}
                            />
                        )
                    })
                }
            </ul>
        </nav>
    )
}

export default Nav