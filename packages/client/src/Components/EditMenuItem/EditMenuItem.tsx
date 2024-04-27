import React, { useEffect } from "react"

import * as styles from "./EditMenuItem.scss"
import IconClose from "../Icons/Close/Close"

interface EditMenuItemProps {
    show?: boolean
    title: string
    children: React.ReactNode
}

const EditMenuItem: React.FC<EditMenuItemProps> = (props) => {
    const [toggle, setToggle] = React.useState(props.show)

    useEffect(() => {
        setToggle(props.show)
    }, [props.show])
    const onClick = () => {
        setToggle(prev => !prev)
    }

    return (
        <div className={styles.menu}>
            <div className={styles.menuItem}>
                <div
                    className={styles.menuItemTitle}
                    onClick={onClick}>
                    <span>{props.title}</span>
                    {toggle && <span><IconClose className={styles.menuItemTitleIcon} /></span>}
                </div>
                {
                    toggle && (
                        <div className={styles.menuItemBody}>
                            {props.children}
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default EditMenuItem
