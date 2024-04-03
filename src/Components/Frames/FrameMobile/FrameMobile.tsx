import React from "react"

import * as styles from "./FrameMobile.scss"

interface FrameMobileProps {
    children: React.ReactNode
}

const FrameMobile: React.FC<FrameMobileProps> = (props) => {
    return (
        <div className={styles.main}>
            <div className={styles.content}>
                {props.children}
            </div>
        </div>
    )
}

export default FrameMobile
