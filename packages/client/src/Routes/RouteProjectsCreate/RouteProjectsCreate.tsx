import React from "react"

import RouteProjectHeader from "../RouteProject/Components/Header/Header"
import ProjectFlow from "./Components/CreateProjectFlow/CreateProjectFlow"

import * as styles from "./RouteProjectsCreate.scss"

const RouteProjectsCreate: React.FC = () => {
    return (
        <div className={styles.main}>
            <RouteProjectHeader />
            <ProjectFlow />
        </div>
    )
}

export default RouteProjectsCreate
