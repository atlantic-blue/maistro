import React from "react"
import { Project } from "../../../../Store/Project"

import * as styles from "./ProjectOptions.scss"

interface ProjectOptionsProps {
    project: Project
}

const ProjectOptions: React.FC<ProjectOptionsProps> = ({ project }) => {

    return (
        <div className={styles.content}>
            <div>
                <div
                    className={styles.title}
                >
                    {project.getTitle()}
                </div>
            </div>

        </div>
    )
}

export default ProjectOptions