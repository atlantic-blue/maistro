import React from "react"

import * as styles from "./Logo.scss"

interface LogoProps {
    slogan?: string
    imgUrl: string
}

const Logo: React.FC<LogoProps> = (props) => {
    return (
        <div className={styles.logo}>
            <a href="/">
                <img src={props.imgUrl} className={styles.logoImg} />
            </a>
            {props.slogan && <span className={styles.logoSlogan}>{props.slogan}</span>}
        </div>
    )
}

export default Logo

