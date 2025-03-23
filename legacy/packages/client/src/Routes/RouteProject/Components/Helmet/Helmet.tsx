import React from "react"

import Menu from "../Menu/Menu"

import RouteProjectHeader from "../Header/Header";

import AiAssistant from "../../../../Ai/Assistant/AiAssistant";

import * as styles from "./Helmet.scss"

interface HelmetProps {
    children: React.ReactNode
}

const Helmet: React.FC<HelmetProps> = (props) => {
    return (
        <main className={styles.main}>
            <RouteProjectHeader />

            {props.children}

            <AiAssistant />
        </main>
    )
}

export default Helmet
