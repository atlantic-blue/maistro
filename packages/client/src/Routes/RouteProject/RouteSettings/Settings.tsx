import React from "react"

import { useNavigate, useParams } from "react-router-dom"
import { ProjectsContext } from "../../../Projects";
import Helmet from "../Components/Helmet/Helmet";
import ColorScheme from "../../../Components/ColourScheme/ColourScheme";
import { ProjectMessageType, ProjectsMessageType } from "../../../types";
import FontDesign from "../../../Components/FontScheme/FontScheme";

import SettingsMetadata from "./Components/SettingsMetadata/SettingsMetadata";
import IconBin from "../../../Components/Icons/Bin/Bin";
import { Project } from "../../../Store/Project";
import { appRoutes } from "../../router";

import SubmitProject from "./Components/SubmitProject/SubmitProject";

import * as styles from "./Settings.scss"
import RouteProjectHeader from "../Components/Header/Header";

const PageSettings: React.FC<PageSettingsProps> = () => {
    const navigate = useNavigate();

    const { projects, user } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")

    if (!project) {
        return
    }

    const onProjectDelete = (project: Project) => {
        projects.event$.next({
            type: ProjectsMessageType.DELETE_PROJECT,
            data: project.getId()
        })

        navigate(appRoutes.getProjectsRoute())
    }

    return (
        <Helmet>
            <RouteProjectHeader user={user} />
            <div className={styles.content}>
                <div className={styles.section}>
                    <SubmitProject
                        project={project}
                        userId={user.getId()}
                    />
                </div>
                <div className={styles.section}>
                    <SettingsMetadata project={project} />
                </div>
                <div className={styles.section}>
                    <div className={styles.title}>
                        Font
                    </div>
                    <FontDesign
                        onChange={fontScheme => {
                            project.event$.next({
                                type: ProjectMessageType.SET_FONT_SCHEME,
                                data: fontScheme,
                            })
                        }}
                    />
                </div>

                <div className={styles.section}>
                    <div className={styles.title}>
                        Colour Palette
                    </div>
                    <ColorScheme
                        colourScheme={project.getColourScheme()}
                        onChange={colourScheme => {
                            project.event$.next({
                                type: ProjectMessageType.SET_COLOUR_SCHEME,
                                data: colourScheme,
                            })
                        }}
                    />
                </div>

                <div className={styles.section}>
                    <div className={styles.title}>
                        Danger Zone
                    </div>

                    <div className={styles.sectionDanger}>
                        <div>
                            Once you delete a project, there is no going back.
                            Please be certain.
                        </div>
                        <button className={styles.buttonDanger} onClick={() => onProjectDelete(project)}>
                            <IconBin className={styles.buttonDangerIcon} />
                        </button>
                    </div>
                </div>
            </div>
        </Helmet>
    )
}

export default PageSettings
