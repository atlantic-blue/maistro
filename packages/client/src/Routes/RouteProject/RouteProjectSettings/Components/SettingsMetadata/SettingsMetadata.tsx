import React, { useEffect } from "react"

import { Project } from "../../../../../Store/Project"
import { ProjectMessageType } from "../../../../../types"

import { ProjectsContext } from "../../../../../Projects"

import { createUrl } from "../../../../../Utils/url"

import * as styles from "./SettingsMetadata.scss"
import { ApiContext } from "../../../../../Api/ApiProvider"
import { Box, Button, Card, Flex, Heading, Text, TextField } from "@radix-ui/themes"
import RouteProjectSettingsTheme from "../RouteProjectSettingsTheme/RouteProjectSettingsTheme"

interface SettingsMetadataProps {
    project: Project
    isDisabled?: boolean
}

const SettingsMetadata: React.FC<SettingsMetadataProps> = ({ project, isDisabled }) => {
    const { api } = React.useContext(ApiContext)
    const { user } = React.useContext(ProjectsContext)
    const [name, setName] = React.useState(project.getName())
    const [projectUrl, setProjectURl] = React.useState(project.getUrl())
    const [isLoading, setIsLoading] = React.useState(false)

    useEffect(() => {
        project.event$.next({
            type: ProjectMessageType.SET_NAME,
            data: name
        })
    }, [name])

    useEffect(() => {
        project.event$.next({
            type: ProjectMessageType.SET_URL,
            data: projectUrl
        })
    }, [projectUrl])


    // TODO ERROR HANDLING
    const onClick = async () => {
        setIsLoading(true)
        api.projects.updateById({
            token: user.getTokenId(),
            projectId: project.getId(),
            name: name,
            url: createUrl(projectUrl),
            theme: project.getTheme(),
        })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <Card m="3">
            <Flex gap="3" direction="column" justify="center" align="center">
                <Box p="2">
                    <Text
                        className={styles.title}
                    >
                        Title
                    </Text>
                    <TextField.Root
                        size="2"
                        type="text"
                        variant="surface"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={isDisabled}
                        className={styles.input}
                    />
                </Box>

                <Box p="2">
                    <Text
                        className={styles.title}
                    >
                        URL
                    </Text>
                    <TextField.Root
                        type="text"
                        size="2"
                        variant="surface"
                        value={projectUrl}
                        onChange={e => setProjectURl(e.target.value)}
                        disabled={isDisabled}
                        className={styles.input}
                    />

                </Box>

                <Box p="2">
                    <Heading as="h6">
                        Theme
                    </Heading>
                    <RouteProjectSettingsTheme />

                </Box>

                <Button onClick={onClick} size="3" loading={isLoading}>
                    Update
                </Button>
            </Flex>
        </Card>
    )
}

export default SettingsMetadata
