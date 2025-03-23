import { Avatar } from "@radix-ui/themes"
import React from "react"
import { IconLogoSimple } from "../Icons/Logo/Logo"
import classNames from "classnames"
import IconSpinner from "../Icons/Spinner/Spinner"

import * as styles from "./AvatarMaistro.scss"

interface AvatarMaistroProps {
    classNames?: {
        avatar?: string
        icon?: string
    }
    isLoading?: boolean
}

const AvatarMaistro: React.FC<AvatarMaistroProps> = (props) => {
    return (
        <div className={styles.main}>
            <Avatar
                size="1"
                className={classNames(styles.mainAvatar, props.classNames?.avatar)}
                fallback={
                    <IconLogoSimple className={classNames(styles.mainIcon, props.classNames?.icon)} />
                }
                alt="Maistro"
            />
            {props.isLoading && (
                <div className={styles.mainLoading}>
                    <IconSpinner />
                </div>
            )}
        </div>
    )
}

export default AvatarMaistro
