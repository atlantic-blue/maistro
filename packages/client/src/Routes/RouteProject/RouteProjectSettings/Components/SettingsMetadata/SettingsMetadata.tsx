import React, { useEffect } from "react"

import { Project } from "../../../../../Store/Project"
import { ProjectMessageType } from "../../../../../types"

import { ProjectsContext } from "../../../../../Projects"

import { createUrl } from "../../../../../Utils/url"

import * as styles from "./SettingsMetadata.scss"
import { ApiContext } from "../../../../../Api/ApiProvider"
import { Box, Button, Card, Flex, Heading, Text, TextField } from "@radix-ui/themes"
import RouteProjectSettingsTheme from "../../../RouteProjectTheme/RouteProjectTheme"
import EditorImage from "../../../../../Components/Editor/EditorImage"
import { EditorDataType } from "../../../../../Components/Editor/EditorData"
import { convertFileToBase64 } from "../../../../../Utils/toBase64"

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
    const [projectLogo, setProjectLogo] = React.useState(project.getLogo())

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
            currency: project.getCurrency(),
            logo: projectLogo,
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

                <EditorImage
                    name="Logo"
                    onChange={src => {
                        setProjectLogo(src)
                    }}
                    onUploadFile={async file => {
                        const fileBase64 = await convertFileToBase64(file)
                        const response = await api.projects.upload({
                            fileType: file.type,
                            fileName: file.name,
                            projectId: project.getId(),
                            token: user.getTokenId(),
                            fileContent: fileBase64,
                            path: "assets"
                        })

                        return response?.src
                    }}
                    type={EditorDataType.IMAGE}
                />

                <Button onClick={onClick} size="3" loading={isLoading}>
                    Update
                </Button>
            </Flex>
        </Card>
    )
}

export default SettingsMetadata
