import React from "react"

import * as styles from "./NavLink.scss"

interface NavLinkProps {
    href?: string
    onClick?: () => void
    value: string | React.ReactNode
    description: string
}

const NavLink: React.FC<NavLinkProps> = (props) => {
    return (
        <li
            className={styles.navigationLink}
        >
            {props.onClick ? (
                <a onClick={props.onClick} aria-label={props.description}>
                    {props.value}
                </a>
            ) : (
                <a href={props.href} aria-label={props.description}>
                    {props.value}
                </a>
            )}
        </li>
    )
}

export default NavLink
