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
import EditorData, { EditorDataType } from "../../../../../Components/Editor/EditorData"
import { convertFileToBase64 } from "../../../../../Utils/toBase64"
import EditorText from "../../../../../Components/Editor/EditorText"

interface SettingsMetadataProps {
    project: Project
    isDisabled?: boolean
}

const SettingsMetadata: React.FC<SettingsMetadataProps> = ({ project, isDisabled }) => {
    const { api } = React.useContext(ApiContext)
    const { user } = React.useContext(ProjectsContext)
    const [isLoading, setIsLoading] = React.useState(false)
    const [state, setState] = React.useState(project.getStruct())

    useEffect(() => {
        project.event$.next({
            type: ProjectMessageType.SET,
            data: {
                ...project.getStruct(),
                ...state
            }
        })
    }, [JSON.stringify(state)])


    // TODO ERROR HANDLING
    const onClick = async () => {
        setIsLoading(true)
        api.projects.updateById({
            token: user.getTokenId(),
            projectId: project.getId(),
            theme: project.getTheme(),
            currency: project.getCurrency(),

            url: createUrl(state.url),
            name: state.name,
            logo: state.logo,
            email: state.email,
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
                        value={state.name}
                        onChange={e => {
                            setState(prev => {
                                return {
                                    ...prev,
                                    name: e.target.value
                                }
                            })
                        }}
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
                        value={state.url}
                        onChange={e => {
                            setState(prev => {
                                return {
                                    ...prev,
                                    url: e.target.value
                                }
                            })
                        }}
                        disabled={isDisabled}
                        className={styles.input}
                    />

                </Box>

                <Box p="2">
                    <Text
                        className={styles.title}
                    >
                        Email
                    </Text>
                    <TextField.Root
                        size="2"
                        type="text"
                        variant="surface"
                        value={state.email}
                        onChange={e => {
                            setState(prev => {
                                return {
                                    ...prev,
                                    email: e.target.value
                                }
                            })
                        }}
                        disabled={isDisabled}
                        className={styles.input}
                    />
                </Box>

                <EditorImage
                    name="Logo"
                    value={state.logo}
                    onChange={logo => {
                        setState(prev => {
                            return {
                                ...prev,
                                logo,
                            }
                        })
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
