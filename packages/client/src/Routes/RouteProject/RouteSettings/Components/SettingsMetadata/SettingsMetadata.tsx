import React, { useEffect } from "react"

import { Project } from "../../../../../Store/Project"
import { ProjectMessageType } from "../../../../../types"

import * as styles from "./SettingsMetadata.scss"

interface SettingsMetadataProps {
    project: Project
    isDisabled?: boolean
}

const SettingsMetadata: React.FC<SettingsMetadataProps> = ({ project, isDisabled }) => {
    const [title, setTitle] = React.useState(project.getTitle())

    useEffect(() => {
        project.event$.next({
            type: ProjectMessageType.SET_TITLE,
            data: title
        })
    }, [title])


    return (
        <div>
            <div>
                <div
                    className={styles.title}
                >
                    Project Name
                </div>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    disabled={isDisabled}
                    className={styles.input}
                />
            </div>
        </div>
    )
}

export default SettingsMetadata
