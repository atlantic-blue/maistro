import React from "react"

import EditableContent from "../../../Editable/EditableContent/EditableContent"

import * as styles from "./NavLink.scss"

interface NavLinkProps {
    edit?: boolean
    href: string
    value: string
    onChange: (content: string) => void
}

const NavLink: React.FC<NavLinkProps> = (props) => {
    if (props.edit) {
        return (
            <li
                className={styles.navigationLink}
            >
                <a href={props.href}>
                    <EditableContent
                        onContentChange={props.onChange}
                    >
                        {props.value}
                    </EditableContent>
                </a>
            </li>
        )
    }

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
