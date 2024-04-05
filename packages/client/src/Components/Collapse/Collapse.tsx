import React from "react"

import * as styles from "./Collapse.scss"

interface CollapseProps {
    head: React.ReactNode
    children: React.ReactNode
}

const Collapse: React.FC<CollapseProps> = (props) => {
    const idName = `toggle-${Math.random()}`
    const [toggle, setToggle] = React.useState(true)
    const onClick = () => {
        setToggle(prev => !prev)
    }

    return (
        <section className={styles.container}>
            <div className={styles.head} onClick={onClick}>
                <div className={styles.toggle}>
                    <input className={styles.input} type="checkbox" id={idName} checked={toggle} onChange={() => void 0} />
                    <label className={styles.label} htmlFor={idName} onClick={onClick} />
                </div>
                <span className={styles.title}>{props.head}</span>
            </div>
            {toggle && (
                <div className={styles.body}>
                    {props.children}
                </div>
            )}
        </section>
    )
}

export default Collapse
