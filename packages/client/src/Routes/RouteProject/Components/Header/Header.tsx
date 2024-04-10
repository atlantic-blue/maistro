import React from "react"

import HeaderBurger from "../../../../Components/Gallery/Header/HeaderBurger/HeaderBurger"
import * as styles from "./Header.scss"
import { User } from "../../../../Store/User"
import { appRoutes } from "../../../router"

interface RouteProjectHeaderProps {
    user: User
}

const RouteProjectHeader: React.FC<RouteProjectHeaderProps> = (props) => {
    return (
        <HeaderBurger
            {
            ...{
                logo: {
                    url: "https://maistro.website/assets/logo.svg",
                },
                links: {
                    login: {
                        href: appRoutes.getSettingsRoute(),
                        value: (
                            // TODO what if the avatar doesn't load?
                            <div className={styles.headerLink}>
                                <img src={props.user.getAvatar()} className={styles.headerAvatar} />
                                <div className={styles.headerText}>My Settings</div>
                            </div>
                        ),
                    }
                },
            }
            }
        />
    )
}

export default RouteProjectHeader
