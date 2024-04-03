import React from "react"
import classNames from "classnames"
import { useNavigate } from "react-router-dom"

import { ProjectsContext } from "../../Projects"
import { ProjectsMessageType } from "../../types"
import { Project } from "../../Store/Project"
import IconNew from "../../Components/Icons/New/New"
import Thumbnail from "../../Components/Thumbnail/Thumbnail"

import { appRoutes } from "../router"

import * as styles from "./Projects.scss"
import ProjectOptions from "./Components/ProjectOptions/ProjectOptions"

const RoutesProjects: React.FC = () => {
    const { projects } = React.useContext(ProjectsContext)
    const navigate = useNavigate();


    const onNewProjectClick = () => {
        const newProject = Project.createEmptyProject()

        projects.event$.next({
            type: ProjectsMessageType.SET_PROJECT,
            data: newProject.getProjectStructure()
        })


        navigate(appRoutes.getProjectTemplateRoute(newProject.getId()))
    }

    return (
        <div className={styles.projects}>
            <div className={styles.projectsContent}>
                <div
                    className={classNames(styles.section, styles.sectionEmpty)}
                    onClick={onNewProjectClick}
                    title="Create new Project"
                >
                    <div className={styles.content}>
                        <IconNew className={styles.icon} />
                    </div>
                </div>

                {Object.keys(projects.getProjects()).map(projectId => {
                    const project = projects.getProjectById(projectId)

                    const Preview = () => {
                        const pagesKey = Object.keys(project.getPages())
                        const firstPage = project.getPageById(pagesKey[0])
                        if (!firstPage) {
                            return
                        }

                        const content = firstPage.getContent().map(content => {
                            const Component = content.getComponent()
                            return (
                                <Component key={content.getId()} {...content.getProps() as any} />
                            )
                        })

                        return content
                    }

                    const onClick = () => {
                        navigate(
                            appRoutes.getProjectEditRoute(project.getId())
                        )
                    }

                    return (
                        <div>
                            <div
                                className={styles.section}
                                onClick={onClick}
                                title={project.getId()}
                                key={project.getId()}
                            >
                                <div className={styles.content}>
                                    <Thumbnail
                                        dimensions={{
                                            height: `350px`,
                                            width: `250px`,
                                            scale: 0.5
                                        }}
                                    >
                                        <Preview />
                                    </Thumbnail>
                                </div>
                            </div>
                            <ProjectOptions
                                project={project}
                                isDisabled
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default RoutesProjects
