import React from "react"
import { Card, Heading } from "@radix-ui/themes";
import { useParams } from "react-router-dom"

import { ProjectsContext } from "../../../Projects";
import Helmet from "../Components/Helmet/Helmet";
import ColorScheme from "../../../Components/ColourScheme/ColourScheme";
import { ProjectMessageType } from "../../../types";
import FontDesign from "../../../Components/FontScheme/FontScheme";

import SettingsMetadata from "./Components/SettingsMetadata/SettingsMetadata";

import RouteProjectSettingsDelete from "./Components/RouteProjectSettingsDelete/RouteProjectSettingsDelete";

import * as styles from "./RouteProjectSettings.scss"
import RouteProjectSettingsMailList from "./Components/RouteProjectSettingsMailList/RouteProjectSettingsMailList";

const RouteProjectSettings: React.FC = () => {
    const { projects } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")

    if (!project) {
        return
    }

    return (
        <Helmet>
            <br />
            <Heading size="4" as="h3" align="center">
                Project Settings
            </Heading>
            <br />

            <div className={styles.content}>
                <Card className={styles.section}>
                    <SettingsMetadata project={project} />
                </Card>

                <RouteProjectSettingsMailList project={project} />

                <RouteProjectSettingsDelete project={project} />
            </div>
        </Helmet>
    )
}

export default RouteProjectSettings
