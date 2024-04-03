import React from "react"
import { Project } from "../../../../Store/Project"
import { ProjectMessageType } from "../../../../types"

import * as styles from "./ProjectOptions.scss"

interface ProjectOptionsProps {
    project: Project
    isDisabled?: boolean
}

const ProjectOptions: React.FC<ProjectOptionsProps> = ({ project, isDisabled }) => {
    const [title, setTitle] = React.useState(project.getTitle())

    React.useEffect(() => {
        project.event$.next({
            type: ProjectMessageType.SET_TITLE,
            data: title
        })
    }, [title])


    return (
        <div className={styles.content}>
            <div>
                <div
                    className={styles.title}
                >
                    Tittle
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

export default ProjectOptions