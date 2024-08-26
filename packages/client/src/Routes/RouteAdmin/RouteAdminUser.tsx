import { Crown } from "lucide-react"
import { filter } from "rxjs/operators"
import React, { useEffect } from "react"

import { appRoutes } from "../router"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import HeaderBurger from "../../Templates/Header/HeaderBurger/HeaderBurger"
import { Avatar, Badge, Button, Card, Flex, Heading, Text } from "@radix-ui/themes"
import PaymentPlan from "../../Payments/PaymentPlan/PaymentPlan"
import { ApiContext } from "../../Api/ApiProvider"
import { ProjectsContext, projectsStore } from "../../Projects"
import { ProjectsMessageType } from "../../types"
import useObservable from "../../Utils/Hooks/UseObservable"
import { SystemUser } from "../../Api/System/systemUsersRead"
import { Project } from "../../Store/Project"

const RouteAdminUser: React.FC = () => {
    const navigate = useNavigate();
    const { projects, user } = React.useContext(ProjectsContext)
    const { api } = React.useContext(ApiContext)

    const { userId } = useParams()

    if (!user) {
        return (
            <Navigate to={appRoutes.getLoginRoute()} />
        )
    }

    if (!user.isAdmin()) {
        return (
            <Navigate to={appRoutes.getProjectsRoute()} />
        )
    }

    useEffect(() => {
        if (!userId) {
            return
        }

        api.system.projects.read({
            token: user.getTokenId(),
            userId,
        }).then(projects => {
            projects.map(project => {
                projectsStore.event$.next({
                    type: ProjectsMessageType.SET_PROJECT,
                    data: project,
                })
            })
        })

    }, [userId])

    useObservable(
        projectsStore.event$
            .pipe(
                filter(e => e.type === ProjectsMessageType.SET_PROJECT)
            )
    )

    const onTransferProjectToAdmin = (project: Project) => {
        api.system.projects.updateUser({
            token: user.getTokenId(),
            userId: user.getId(),
            projectId: project.getId(),
        }).then(() => {
            if (!userId) {
                return
            }

            projectsStore.event$.next({
                type: ProjectsMessageType.DELETE_PROJECT,
                data: project.getId(),
            })
            navigate(appRoutes.getAdminUserRoute(userId))
        })
    }

    const projectsList = Object.keys(projects.getProjects())
        .filter(projectId => {
            return user.getId() !== projects.getProjectById(projectId).getUserId()
        })

    return (
        <div>
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
                        <Card m="2" >
                            <Flex direction="column" justify="center" mb="2">
                                <Card key={project.getId()} onClick={onClick} mb="3">
                                    <Flex wrap="wrap" direction="column" align="center" gap="1">
                                        <Heading as="h3" size="2">
                                            {project.getName()}
                                        </Heading>
                                        {project.getLogo() ? <Avatar
                                            size="9"
                                            fallback={project.getName()}
                                            src={project.getLogo()}
                                        /> : null}
                                        <Badge color="mint">
                                            {project.getUrl()}
                                        </Badge>
                                    </Flex>
                                </Card>
                                <Button variant="outline" onClick={() => onTransferProjectToAdmin(project)}>
                                    Transfer to Admin
                                </Button>
                            </Flex>
                        </Card>
                    )
                })
            }
        </div>
    )
}

export default RouteAdminUser
