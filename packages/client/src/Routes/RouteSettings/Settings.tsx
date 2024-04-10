import React from "react"

import { ProjectsContext } from "../../Projects"
import RouteProjectHeader from "../RouteProject/Components/Header/Header"

import * as styles from "./Settings.scss"
import AuthLogoutButton from "../../Components/Auth/AuthLogoutButton"

const RoutesSettings: React.FC = () => {
    const { user } = React.useContext(ProjectsContext)

    return (
        <div className={styles.main}>
            <RouteProjectHeader user={user} />

            <div className={styles.content}>

                <div className={styles.section}>
                    <img src={user.getAvatar()} />
                    <div>{user.getName()}</div>
                </div>

                <div className={styles.section}>
                    <AuthLogoutButton />
                </div>
            </div>
        </div>
    )
}

export default RoutesSettings
