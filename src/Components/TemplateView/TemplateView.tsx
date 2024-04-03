import React from "react"
import Thumbnail, { ThumbnailProps } from "../Thumbnail/Thumbnail"

import IconNew from "../Icons/New/New"

import * as styles from "./TemplateView.scss"
import classNames from "classnames"

interface TemplateViewProps {
    title?: string

    children?: React.ReactNode
    onClick?: () => void
    thumbnail?: Partial<ThumbnailProps>
}

const TemplateView: React.FC<TemplateViewProps> = (props) => {
    return (
        <div className={styles.section} onClick={props?.onClick} title={props.title}>
            <div className={styles.content}>
                <Thumbnail {...props.thumbnail}>
                    {props.children}
                </Thumbnail>
            </div>
        </div>
    )
}

const TemplateViewNew: React.FC<TemplateViewProps> = (props) => {
    return (
        <div className={classNames(styles.section, styles.sectionEmpty)} onClick={props.onClick} title={props.title}>
            <div className={styles.content}>
                <IconNew className={styles.icon} />
            </div>
        </div>
    )
}

export {
    TemplateViewNew,
    TemplateView as default
}
