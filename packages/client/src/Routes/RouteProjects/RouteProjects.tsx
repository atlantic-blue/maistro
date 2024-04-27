import React from "react"
import classNames from "classnames"
import { useNavigate } from "react-router-dom"

import { ProjectsContext } from "../../Projects"
import IconNew from "../../Components/Icons/New/New"
import Thumbnail from "../../Components/Thumbnail/Thumbnail"

import { appRoutes } from "../router"

import ProjectOptions from "./Components/ProjectOptions/ProjectOptions"
import RouteProjectHeader from "../RouteProject/Components/Header/Header"

import { PaymentsContext } from '../../Payments/PaymentsProvider';
import * as styles from "./RouteProjects.scss"
import { templates } from "../../Components/Gallery"

const RoutesProjects: React.FC = () => {
    const navigate = useNavigate();
    const { projects } = React.useContext(ProjectsContext)
    const { isSubscribed, redirectToCheckout } = React.useContext(PaymentsContext)

    const onNewProjectClick = async () => {
        navigate(appRoutes.getProjectsNewRoute())
    }

    const projectsList = Object.keys(projects.getProjects())
    const canCreateNewProjects = projectsList.length < 1 || isSubscribed

    return (
        <div className={styles.projects}>
            <RouteProjectHeader />
            <div className={styles.projectsContent}>
                <div
                    className={classNames(styles.section, styles.sectionEmpty)}
                    onClick={canCreateNewProjects ? onNewProjectClick : redirectToCheckout}
                    title="Create new Project"
                >
                    <div className={styles.content}>
                        <IconNew className={styles.icon} />
                        <div>Create a new Project</div>
                    </div>
                </div>

                {projectsList.map(projectId => {
                    const project = projects.getProjectById(projectId)

                    const Preview = () => {
                        const pagesKey = Object.keys(project.getPages())
                        const firstPage = project.getPageById(pagesKey[0])
                        if (!firstPage) {
                            return
                        }

                        const content = firstPage.getContentIds().map(contentId => {
                            const content = project.getContentById(contentId)
                            if (!content) {
                                return
                            }
                            const Component = templates[content.getTemplateName()]?.Component
                            if (!Component) {
                                return null
                            }

                            let props = content.getData()

                            return (
                                <Component key={content.getId()} {...props as any} />
                            )
                        })

                        return content
                    }

                    const onClick = () => {
                        navigate(
                            appRoutes.getProjectRoute(project.getId())
                        )
                    }

                    return (
                        <div key={project.getId()}>
                            <div
                                className={styles.section}
                                onClick={onClick}
                                title={project.getId()}
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
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default RoutesProjects
