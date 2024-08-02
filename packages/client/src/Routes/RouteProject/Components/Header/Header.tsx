import React from "react"

import HeaderBurger from "../../../../Templates/Header/HeaderBurger/HeaderBurger"
import { appRoutes } from "../../../router"
import { Avatar, Flex, Text } from "@radix-ui/themes"
import { ProjectsContext } from "../../../../Projects"

import { useParams } from "react-router-dom"
import { Barcode, BoxIcon, Cog, Contact, Package, Palette, PanelsTopLeft, Puzzle, Settings2 } from "lucide-react"

interface RouteProjectHeaderProps {

}

const RouteProjectHeader: React.FC<RouteProjectHeaderProps> = (props) => {
    const { user } = React.useContext(ProjectsContext)
    const { projects } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")

    return (
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
                        href: appRoutes.getProjectRoute(project?.getId()),
                        name: (
                            <Flex direction="column" align="center" justify="center">
                                <PanelsTopLeft style={{ width: "20px" }} />
                                <Text size="1">Pages</Text>
                            </Flex>
                        ),
                        description: "Pages"
                    },
                    {
                        href: appRoutes.getProjectProductsRoute(project?.getId()),
                        name: (
                            <Flex direction="column" align="center" justify="center">
                                <Barcode style={{ width: "20px" }} />
                                <Text size="1">Products</Text>
                            </Flex>
                        ),
                        description: "Products"
                    },
                    {
                        href: appRoutes.getProjectOrdersRoute(project?.getId()),
                        name: (
                            <Flex direction="column" align="center" justify="center">
                                <BoxIcon style={{ width: "20px" }} />
                                <Text size="1">Orders</Text>
                            </Flex>
                        ),
                        description: "Orders"
                    },
                    {
                        href: appRoutes.getProjectContactsRoute(project?.getId()),
                        name: (
                            <Flex direction="column" align="center" justify="center">
                                <Contact style={{ width: "20px" }} />
                                <Text size="1">Contacts</Text>
                            </Flex>
                        ),
                        description: "Contacts"
                    },
                    {
                        href: appRoutes.getProjectContentsRoute(project?.getId()),
                        name: (
                            <Flex direction="column" align="center" justify="center">
                                <Puzzle style={{ width: "20px" }} />
                                <Text size="1">Assets</Text>
                            </Flex>
                        ),
                        description: "Assets"
                    },
                    {
                        href: appRoutes.getProjectThemeRoute(project?.getId()),
                        name: (
                            <Flex direction="column" align="center" justify="center">
                                <Palette style={{ width: "20px" }} />
                                <Text size="1">Theme</Text>
                            </Flex>
                        ),
                        description: "Theme"
                    },
                    {
                        href: appRoutes.getProjectSettingsRoute(project?.getId()),
                        name: (
                            <Flex direction="column" align="center" justify="center">
                                <Cog style={{ width: "20px" }} />
                                <Text size="1">Settings</Text>
                            </Flex>
                        ),
                        description: "My settings"
                    },
                ]
            }
            }
        />
    )
}

export default RouteProjectHeader
