import React from "react"

import * as styles from "./Nav.scss"
import NavLink from "../NavLink/NavLink"
import classNames from "classnames";

export interface Link {
    href: string;
    value: string
    links?: Record<string, Link>
}

interface NavProps {
    links: Record<string, Link>
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
                    Object.keys(props.links).map(link => {
                        return (
                            <NavLink
                                key={props.links[link].href}
                                href={props.links[link].href}
                                value={props.links[link].value}
                            />
                        )
                    })
                }
            </ul>
        </nav>
    )
}

export default Nav