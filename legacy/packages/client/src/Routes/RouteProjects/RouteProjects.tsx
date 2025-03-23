import React from "react"
import { useNavigate } from "react-router-dom"
import { CirclePlus, Crown } from "lucide-react";
import { Avatar, Badge, Box, Button, Card, Flex, Heading, Section, Text } from "@radix-ui/themes"

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
                        user.isAdmin() ? {
                            href: appRoutes.getAdminRoute(),
                            name: (
                                <Flex align="center" gap="2" justify="center">
                                    <Badge>
                                        <Crown />
                                    </Badge>
                                </Flex>
                            )
                        } : {},
                        {
                            href: appRoutes.getSettingsRoute(),
                            name: (
                                <Flex align="center" gap="2" justify="center">
                                    <PaymentPlan />
                                    <Avatar
                                        size="1"
                                        src={user.getAvatar()}
                                        alt={user.getName()}
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
                                            <Flex wrap="wrap" direction="column" align="center" gap="1">
                                                <Heading as="h3" size="2">
                                                    {project.getName()}
                                                </Heading>
                                                <Avatar
                                                    size="9"
                                                    src={project.getLogo()}
                                                    alt={project.getName()}
                                                    fallback={project.getName()}
                                                />
                                                <Badge color="mint">
                                                    {project.getUrl()}
                                                </Badge>
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
