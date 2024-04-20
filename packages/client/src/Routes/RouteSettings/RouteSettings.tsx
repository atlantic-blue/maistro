import React from "react"

import { ProjectsContext } from "../../Projects"
import RouteProjectHeader from "../RouteProject/Components/Header/Header"

import AuthLogoutButton from "../../Auth/AuthLogoutButton"
import PaymentsRedirect from "../../Payments/Payments"

import * as styles from "./RouteSettings.scss"

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
                    {/*                     
                        TODO, how do we know if the user has subscribed?
                        https://billing.stripe.com/p/login/00g4i29gM9GOgz6dQQ
                     */}
                    <PaymentsRedirect user={user} />
                </div>

                <div className={styles.section}>
                    <AuthLogoutButton />
                </div>
            </div>
        </div>
    )
}

export default RoutesSettings
