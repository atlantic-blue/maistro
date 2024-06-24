import React from "react"
import { useNavigate } from "react-router-dom"

import { ProjectsContext } from "../../Projects"

import { appRoutes } from "../router"

import RouteProjectHeader from "../RouteProject/Components/Header/Header"

import { Box, Button, Card, Flex, Section, Text } from "@radix-ui/themes"
import * as styles from "./RouteProjects.scss"
import { CirclePlus } from "lucide-react";

const RoutesProjects: React.FC = () => {
    const navigate = useNavigate();
    const { projects } = React.useContext(ProjectsContext)

    const onNewProjectClick = async () => {
        navigate(appRoutes.getProjectsNewRoute())
    }

    const projectsList = Object.keys(projects.getProjects())

    return (
        <div className={styles.projects}>
            <RouteProjectHeader />
            <Flex direction="column" align="center">
                <Section size="2" m="2">
                    <Flex direction="column" gap="4">
                        <Button
                            variant="outline"
                            onClick={onNewProjectClick}
                        >
                            <CirclePlus />
                            Create a new project
                        </Button>

                        <Box>
                            {
                                projectsList.map(projectId => {
                                    const project = projects.getProjectById(projectId)

                                    const onClick = () => {
                                        navigate(
                                            project.getPageByPathname("index")?.getId() ?
                                                appRoutes.getProjectPageRoute(project.getId(), project.getPageByPathname("index").getId())
                                                : appRoutes.getProjectRoute(project.getId())
                                        )
                                    }

                                    return (
                                        <Card key={project.getId()} onClick={onClick} mb="3">
                                            <Flex wrap="wrap" justify="start" align="center" gap="2">
                                                <Text as="div" size="2" weight="bold">
                                                    {project.getName()}
                                                </Text>
                                                <Text as="div" size="2" color="gray">
                                                    {project.getUrl()}
                                                </Text>
                                            </Flex>
                                        </Card>
                                    )
                                })
                            }
                        </Box>
                    </Flex>
                </Section>
            </Flex>
        </div>
    )
}

export default RoutesProjects
