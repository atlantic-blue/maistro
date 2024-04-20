import { faker } from '@faker-js/faker';
import React, { useEffect } from "react"
import classNames from "classnames"
import { useNavigate } from "react-router-dom"

import { ProjectsContext } from "../../Projects"
import { ProjectsMessageType } from "../../types"
import { Project } from "../../Store/Project"
import IconNew from "../../Components/Icons/New/New"
import Thumbnail from "../../Components/Thumbnail/Thumbnail"

import { appRoutes } from "../router"

import ProjectOptions from "./Components/ProjectOptions/ProjectOptions"
import RouteProjectHeader from "../RouteProject/Components/Header/Header"

import * as styles from "./RouteProjects.scss"

const RoutesProjects: React.FC = () => {
    const { projects, user, api } = React.useContext(ProjectsContext)
    const navigate = useNavigate();

    const onNewProjectClick = async () => {
        const projectName = `${user.getName()}'s ${faker.commerce.productName()}`

        api.projects.create({
            token: user.getTokenId(),
            name: projectName,
        })
            .then(({ id, name }) => {
                const newProject = Project.createEmptyProject(id, name)
                projects.event$.next({
                    type: ProjectsMessageType.SET_PROJECT,
                    data: newProject.getProjectStructure()
                })

                navigate(appRoutes.getProjectTemplateRoute(newProject.getId()))
            })
            .catch(error => {
                //TODO APP LEVEL ERROR
                console.error(error)
            })
    }

    return (
        <div className={styles.projects}>
            <RouteProjectHeader user={user} />
            <div className={styles.projectsContent}>
                <div
                    className={classNames(styles.section, styles.sectionEmpty)}
                    onClick={onNewProjectClick}
                    title="Create new Project"
                >
                    <div className={styles.content}>
                        <IconNew className={styles.icon} />
                        <div>Create a new Project</div>
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
