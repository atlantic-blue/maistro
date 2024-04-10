import React from "react"

import * as styles from "./NavLink.scss"

interface NavLinkProps {
    href: string
    value: string | React.ReactNode
}

const NavLink: React.FC<NavLinkProps> = (props) => {
    return (
        <li
            className={styles.navigationLink}
        >
            <a href={props.href}>
                {props.value}
            </a>
        </li>
    )
}

export default NavLink
