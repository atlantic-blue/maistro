import React, { useEffect } from "react"

import { Project } from "../../../../../Store/Project"
import { ProjectMessageType } from "../../../../../types"

import { ProjectsContext } from "../../../../../Projects"

import { createUrl, isValidUrl } from "../../../../../Utils/url"

import * as styles from "./SettingsMetadata.scss"
import { ApiContext } from "../../../../../Api/ApiProvider"
import { Box, Button, Flex, Text, TextField } from "@radix-ui/themes"

interface SettingsMetadataProps {
    project: Project
    isDisabled?: boolean
}

const HOSTING_DOMAIN = ".maistro.website"

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
            url: createUrl(projectUrl)
        })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <Flex gap="3" className={styles.content}>
            <Box p="2">
                <Text
                    className={styles.title}
                >
                    Project Name
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
                    Project URL
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

            <Button onClick={onClick} size="3" loading={isLoading}>
                Update
            </Button>
        </Flex>
    )
}

export default SettingsMetadata
