import { Avatar } from "@radix-ui/themes"
import React from "react"
import { IconLogoSimple } from "../Icons/Logo/Logo"
import * as styles from "./AvatarMaistro.scss"
import classNames from "classnames"

interface AvatarMaistroProps {
    classNames?: {
        avatar?: string
        icon?: string
    }
}

const AvatarMaistro: React.FC<AvatarMaistroProps> = (props) => {
    return (
        <Avatar
            size="1"
            className={classNames(styles.avatar, props.classNames?.avatar)}
            fallback={
                <IconLogoSimple className={classNames(styles.avatarIcon, props.classNames?.icon)} />
            }
        />
    )
}

export default AvatarMaistro
