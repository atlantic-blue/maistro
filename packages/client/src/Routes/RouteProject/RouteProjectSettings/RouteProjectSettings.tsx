import React from "react"
import { Box, Card, Flex, Heading } from "@radix-ui/themes";
import { useParams } from "react-router-dom"

import { ProjectsContext } from "../../../Projects";
import Helmet from "../Components/Helmet/Helmet";

import SettingsMetadata from "./Components/SettingsMetadata/SettingsMetadata";

import RouteProjectSettingsDelete from "./Components/RouteProjectSettingsDelete/RouteProjectSettingsDelete";

import * as styles from "./RouteProjectSettings.scss"
import RouteProjectSettingsMailList from "./Components/RouteProjectSettingsMailList/RouteProjectSettingsMailList";
import RouteProjectSettingsTheme from "./Components/RouteProjectSettingsTheme/RouteProjectSettingsTheme";

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

            <Flex direction="column" maxWidth="800px" m="auto" mb="50px">
                <SettingsMetadata project={project} />
                <RouteProjectSettingsDelete project={project} />
            </Flex>
        </Helmet>
    )
}

export default RouteProjectSettings
