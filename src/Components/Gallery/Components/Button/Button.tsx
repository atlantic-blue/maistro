import React from "react"

import * as styles from "./Button.scss"

interface ButtonProps {
    link: string
    text: string
}

const Button: React.FC<ButtonProps> = (props) => {
    return (
        <button className={styles.button}>
            <a href={props.link} className={styles.link}>
                {props.text}
            </a>
        </button>
    )
}

export default Button
