import React from "react"
import { useParams } from "react-router-dom"
import { Button, Card, Flex, Text } from "@radix-ui/themes"

import { ProjectsContext } from "../../../../../Projects"
import { ProjectMessageType, ProjectTheme, ProjectThemeAccentColour, ProjectThemeGrayColour } from "../../../../../types"

import * as styles from "./RouteProjectSettingsTheme.scss"

const RouteProjectSettingsTheme: React.FC = () => {
    const { projects } = React.useContext(ProjectsContext)
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

    return (
        <Card>
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
        </Card>
    )
}

export default RouteProjectSettingsTheme
