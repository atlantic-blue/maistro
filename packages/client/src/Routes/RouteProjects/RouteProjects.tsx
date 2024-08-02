import React from "react"
import { useNavigate } from "react-router-dom"
import { CirclePlus } from "lucide-react";
import { Avatar, Box, Button, Card, Flex, Section, Text } from "@radix-ui/themes"

import { ProjectsContext } from "../../Projects"

import { appRoutes } from "../router"

import HeaderBurger from "../../Templates/Header/HeaderBurger/HeaderBurger"
import PaymentPlan from "../../Payments/PaymentPlan/PaymentPlan"
import * as styles from "./RouteProjects.scss"

const RoutesProjects: React.FC = () => {
    const navigate = useNavigate();
    const { projects, user } = React.useContext(ProjectsContext)

    const onNewProjectClick = async () => {
        navigate(appRoutes.getProjectsNewRoute())
    }

    const projectsList = Object.keys(projects.getProjects())

    return (
        <div className={styles.projects}>
            <HeaderBurger
                {
                ...{
                    logo: {
                        url: "https://maistro.website/assets/logo.svg",
                        slogan: "Maistro",
                        href: appRoutes.getHomeRoute()
                    },
                    links: [
                        {
                            href: appRoutes.getSettingsRoute(),
                            name: (
                                <Flex align="center" gap="2" justify="center">
                                    <PaymentPlan />
                                    <Avatar
                                        size="1"
                                        src={user.getAvatar()}
                                        fallback={user.getName().charAt(0)}
                                    />
                                    <Text>Settings</Text>
                                </Flex>
                            ),
                            description: "My settings"
                        },
                    ]
                }
                }
            />
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
