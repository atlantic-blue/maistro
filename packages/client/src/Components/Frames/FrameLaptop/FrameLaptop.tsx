import React from "react"

import * as styles from "./FrameLaptop.scss"

interface FrameLaptopProps {
    children: React.ReactNode
}

const FrameLaptop: React.FC<FrameLaptopProps> = (props) => {
    return (
        <div className={styles.main}>
            <div className={styles.content}>
                {props.children}
            </div>
        </div>
    )
}

export default FrameLaptop
