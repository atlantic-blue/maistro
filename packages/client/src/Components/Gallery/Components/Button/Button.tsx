import React from "react"

import * as styles from "./Button.scss"
import classNames from "classnames"

interface ButtonProps {
    link?: string
    children: string | React.ReactNode
    onClick?: () => void
    className?: string
}

const Button: React.FC<ButtonProps> = (props) => {
    return (
        <button
            className={classNames(styles.button, props.className)}
            onClick={props.onClick}
        >
            {props.link ? (
                <a
                    href={props.link}
                    className={styles.link}
                >
                    {props.children}
                </a>
            ) : props.children
            }
        </button>
    )
}

export default Button
