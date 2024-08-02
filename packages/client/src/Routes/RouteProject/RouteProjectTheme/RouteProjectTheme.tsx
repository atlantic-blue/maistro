import React from "react"
import { useParams } from "react-router-dom"
import { Button, Card, Flex, Text } from "@radix-ui/themes"

import { ProjectsContext } from "../../../Projects"
import { ProjectMessageType, ProjectTheme, ProjectThemeAccentColour, ProjectThemeGrayColour } from "../../../types"

import * as styles from "./RouteProjectSettingsTheme.scss"
import { ApiContext } from "../../../Api/ApiProvider"
import Helmet from "../Components/Helmet/Helmet"

const RouteProjectSettingsTheme: React.FC = () => {
    const { api } = React.useContext(ApiContext)
    const { user } = React.useContext(ProjectsContext)
    const { projects } = React.useContext(ProjectsContext)
    const [isLoading, setIsLoading] = React.useState(false)

    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")

    const palette: ProjectThemeAccentColour[] = Object.values(ProjectThemeAccentColour)
    const onPaletteChange = async (colour: ProjectThemeAccentColour) => {
        const nextTheme = {
            ...project.getTheme(),
            accentColor: colour,
        }

        project.event$.next({
            type: ProjectMessageType.SET_THEME,
            data: nextTheme
        })
    }

    const radius: ProjectTheme["radius"][] = ["none", "small", "medium", "large", "full"]
    const onRadiusChange = async (radius: ProjectTheme["radius"]) => {
        const nextTheme: ProjectTheme = {
            ...project.getTheme(),
            radius: radius,
        }

        project.event$.next({
            type: ProjectMessageType.SET_THEME,
            data: nextTheme
        })
    }

    // TODO ERROR HANDLING
    const onClick = async () => {
        setIsLoading(true)
        api.projects.updateById({
            token: user.getTokenId(),
            projectId: project.getId(),
            name: project.getName(),
            url: project.getUrl(),
            theme: project.getTheme(),
            currency: project.getCurrency(),
        })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <Helmet>
            <Card>
                <Flex gap="3" direction="column" justify="center" align="center">
                    <Flex mb="3" direction="column" align="center">
                        <Text
                            mb="1"
                        >
                            Colour
                        </Text>
                        <Flex maxWidth="350px" wrap="wrap" justify="center">
                            {palette?.map(colour => {
                                return (
                                    <div
                                        key={colour}
                                        style={{ backgroundColor: `var(--${colour}-9)` }}
                                        className={styles.gridColour}
                                        onClick={() => onPaletteChange(colour)}
                                        title={`Apply ${colour}`}
                                    >
                                    </div>
                                )
                            })}
                        </Flex>
                    </Flex>

                    <Flex mb="3" direction="column" align="center">
                        <Text
                            m="1"
                        >
                            CTA
                        </Text>
                        <Flex maxWidth="300px" wrap="wrap" justify="center" align="center" gap="1" m="auto">
                            {radius?.map(r => {
                                return (
                                    <Button
                                        key={r}
                                        size="1"
                                        variant="outline"
                                        radius={r}
                                        onClick={() => onRadiusChange(r)}
                                        title={`Apply ${r}`}
                                    >
                                        {r}
                                    </Button>
                                )
                            })}
                        </Flex>
                    </Flex>

                    <Button onClick={onClick} size="3" loading={isLoading}>
                        Update
                    </Button>
                </Flex>
            </Card>
        </Helmet>
    )
}

export default RouteProjectSettingsTheme
