import React from "react"
import { Box, Card, Flex, Heading, Tabs } from "@radix-ui/themes";
import { useParams } from "react-router-dom"

import { ProjectsContext } from "../../../Projects";
import Helmet from "../Components/Helmet/Helmet";

import SettingsMetadata from "./Components/SettingsMetadata/SettingsMetadata";

import RouteProjectSettingsDelete from "./Components/RouteProjectSettingsDelete/RouteProjectSettingsDelete";

import * as styles from "./RouteProjectSettings.scss"
import RouteProjectSettingsMailList from "./Components/RouteProjectSettingsMailList/RouteProjectSettingsMailList";
import RouteProjectSettingsTheme from "./Components/RouteProjectSettingsTheme/RouteProjectSettingsTheme";
import RouteProjectSettingsProducts from "./Components/RouteProjectSettingsProducts/RouteProjectSettingsProducts";
import RouteProjectSettingsContent from "./Components/RouteProjectSettingsContent/RouteProjectSettingsContent";

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
                    <Tabs.Trigger value="email">Email</Tabs.Trigger>
                    <Tabs.Trigger value="products">Products</Tabs.Trigger>
                    <Tabs.Trigger value="theme">Theme</Tabs.Trigger>
                    <Tabs.Trigger value="content">Content</Tabs.Trigger>
                </Tabs.List>

                <Box m="3">
                    <Tabs.Content value="seo">
                        <SettingsMetadata project={project} />
                    </Tabs.Content>

                    <Tabs.Content value="email">
                        <RouteProjectSettingsMailList project={project} />
                    </Tabs.Content>

                    <Tabs.Content value="products">
                        <RouteProjectSettingsProducts />
                    </Tabs.Content>

                    <Tabs.Content value="theme">
                        <RouteProjectSettingsTheme />
                    </Tabs.Content>

                    <Tabs.Content value="content">
                        <RouteProjectSettingsContent />
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
