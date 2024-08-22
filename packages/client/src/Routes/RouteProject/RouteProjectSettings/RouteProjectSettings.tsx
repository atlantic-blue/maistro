import React from "react"
import { Box, Flex, Heading, Tabs } from "@radix-ui/themes";
import { useParams } from "react-router-dom"

import { ProjectsContext } from "../../../Projects";
import Helmet from "../Components/Helmet/Helmet";

import SettingsMetadata from "./Components/SettingsMetadata/SettingsMetadata";

import RouteProjectSettingsDelete from "./Components/RouteProjectSettingsDelete/RouteProjectSettingsDelete";
import PageNavigationDropdown from "../RouteProjectPage/PageNavigationDropdown/PageNavigationDropdown";
import Menu from "../Components/Menu/Menu";

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

            <Tabs.Root defaultValue="seo">
                <Tabs.List style={{ display: "flex", justifyContent: "center" }}>
                    <Tabs.Trigger value="seo">SEO</Tabs.Trigger>
                </Tabs.List>

                <Box m="3">
                    <Tabs.Content value="seo">
                        <SettingsMetadata project={project} />
                    </Tabs.Content>
                </Box>
            </Tabs.Root>


            <Flex direction="column" maxWidth="800px" m="auto" mb="50px">
                <RouteProjectSettingsDelete project={project} />
            </Flex>

        </Helmet>
    )
}

export default RouteProjectSettings
