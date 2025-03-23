import React from "react"
import { Button as RadixButton, ButtonProps as RadixButtonProps, Link } from '@radix-ui/themes'
import classNames from "classnames"

import * as styles from "./Button.scss"

interface ButtonProps {
    link?: string
    children: string | React.ReactNode
    onClick?: () => void
    className?: string
}

const Button: React.FC<ButtonProps & RadixButtonProps> = (props) => {
    return (
        <RadixButton
            size="3"
            className={classNames(styles.button, props.className)}
            onClick={props.onClick}
            {...props}
        >
            {props.link ? (
                <Link
                    href={props.link}
                    className={styles.link}
                >
                    {props.children}
                </Link>
            ) : props.children
            }
        </RadixButton>
    )
}

export default Button
