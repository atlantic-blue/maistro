import React from "react"
import { useParams } from "react-router-dom"

import { ProjectsContext } from "../../../Projects";
import Helmet from "../Components/Helmet/Helmet";
import ColorScheme from "../../../Components/ColourScheme/ColourScheme";
import { ProjectMessageType } from "../../../types";
import FontDesign from "../../../Components/FontScheme/FontScheme";

import SettingsMetadata from "./Components/SettingsMetadata/SettingsMetadata";

import SubmitProject from "./Components/SubmitProject/SubmitProject";

import RouteProjectHeader from "../Components/Header/Header";
import RouteProjectSettingsDelete from "./Components/RouteProjectSettingsDelete/RouteProjectSettingsDelete";

import * as styles from "./RouteProjectSettings.scss"

const RouteProjectSettings: React.FC = () => {
    const { projects, user } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")

    if (!project) {
        return
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

                <RouteProjectSettingsDelete project={project} />
            </div>
        </Helmet>
    )
}

export default RouteProjectSettings
