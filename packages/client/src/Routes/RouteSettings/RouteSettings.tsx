import React from "react"

import { ProjectsContext } from "../../Projects"
import RouteProjectHeader from "../RouteProject/Components/Header/Header"

import AuthLogoutButton from "../../Auth/AuthLogoutButton"
import PaymentsRedirect from "../../Payments/Payments"

import Button from "../../Components/Gallery/Components/Button/Button"
import { PaymentsContext } from "../../Payments/PaymentsProvider"

import * as styles from "./RouteSettings.scss"

const RoutesSettings: React.FC = () => {
    const { user } = React.useContext(ProjectsContext)
    const { isSubscribed } = React.useContext(PaymentsContext)

    return (
        <div className={styles.main}>
            <RouteProjectHeader user={user} />

            <div className={styles.content}>

                <div className={styles.section}>
                    <img src={user.getAvatar()} />
                    <div>{user.getName()}</div>
                </div>


                <div className={styles.section}>
                    {isSubscribed ?
                        (
                            <Button onClick={() => {
                                window.open("https://billing.stripe.com/p/login/00g4i29gM9GOgz6dQQ", "_blank")
                            }}>
                                Manage Subscription
                            </Button>
                        ) :
                        (
                            <PaymentsRedirect />
                        )
                    }
                </div>

                <div className={styles.section}>
                    <AuthLogoutButton />
                </div>
            </div>
        </div >
    )
}

export default RoutesSettings
