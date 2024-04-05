import React from "react"

import EditableImage from "../../../Editable/EditableImage/EditableImage"
import EditableContent from "../../../Editable/EditableContent/EditableContent"

import * as styles from "./Logo.scss"

interface LogoProps {
    edit?: boolean
    slogan: string
    imgUrl: string
    onChange: (id: string, content: string) => void
}

const Logo: React.FC<LogoProps> = (props) => {
    if (props.edit) {
        return (
            <div className={styles.logo}>
                <a href="/">
                    <EditableImage
                        onChange={content => props.onChange(`logo.url`, content)}
                        defaultImage={props.imgUrl}
                    />
                </a>
                <span className={styles.logoSlogan}>
                    <EditableContent
                        onContentChange={content => props.onChange(`logo.slogan`, content)}
                    >
                        {props.slogan}
                    </EditableContent>
                </span>
            </div>
        )
    }

    return (
        <div className={styles.logo}>
            <a href="/">
                <img src={props.imgUrl} className={styles.logoImg} />
            </a>
            <span className={styles.logoSlogan}>{props.slogan}</span>
        </div>
    )
}

export default Logo

