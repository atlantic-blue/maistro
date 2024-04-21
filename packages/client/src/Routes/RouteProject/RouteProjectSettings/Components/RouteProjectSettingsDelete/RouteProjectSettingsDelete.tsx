import React from "react"
import { useNavigate } from "react-router-dom"

import { ProjectsContext } from "../../../../../Projects"
import { ProjectsMessageType } from "../../../../../types"
import { appRoutes } from "../../../../router"
import { Project } from "../../../../../Store/Project"

import IconBin from "../../../../../Components/Icons/Bin/Bin"

import * as styles from "../../RouteProjectSettings.scss"

interface RouteProjectSettingsDeleteProps {
    project: Project
}

const RouteProjectSettingsDelete: React.FC<RouteProjectSettingsDeleteProps> = (props) => {
    const navigate = useNavigate();

    const { projects, user, api } = React.useContext(ProjectsContext)
    const onProjectDelete = (project: Project) => {
        // TODO offline mode
        // projects.event$.next({
        //     type: ProjectsMessageType.DELETE_PROJECT,
        //     data: project.getId()
        // })

        // navigate(appRoutes.getProjectsRoute())

        // TODO states with react query
        api.projects
            .delete({ token: user.getTokenId(), id: project.getId() })
            .then(() => {
                projects.event$.next({
                    type: ProjectsMessageType.DELETE_PROJECT,
                    data: project.getId()
                })

                navigate(appRoutes.getProjectsRoute())
            })
    }

    return (
        <div className={styles.section}>
            <div className={styles.title}>
                Danger Zone
            </div>

            <div className={styles.sectionDanger}>
                <div>
                    Once you delete a project, there is no going back.
                    Please be certain.
                </div>
                <button className={styles.buttonDanger} onClick={() => onProjectDelete(props.project)}>
                    <IconBin className={styles.buttonDangerIcon} />
                </button>
            </div>
        </div>
    )
}

export default RouteProjectSettingsDelete