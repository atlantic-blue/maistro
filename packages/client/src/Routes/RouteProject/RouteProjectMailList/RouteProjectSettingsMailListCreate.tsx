import React from "react"
import { Box, Button, Card, Text, TextField } from "@radix-ui/themes"

import { ApiContext } from "../../../Api/ApiProvider"
import { ProjectsContext } from "../../../Projects"

import { Project } from "../../../Store/Project"
import { ProjectMessageType } from "../../../types"
import * as styles from "./RouteProjectSettingsMailList.scss"

interface RouteProjectSettingsMailListCreateProps {
    project: Project
}

const RouteProjectSettingsMailListCreate: React.FC<RouteProjectSettingsMailListCreateProps> = (props) => {
    const { user } = React.useContext(ProjectsContext)
    const { api } = React.useContext(ApiContext)

    const [isLoading, setIsLoading] = React.useState(false)
    const [title, setTitle] = React.useState("")
    const [description, setDescription] = React.useState("")

    const onClick = () => {
        setIsLoading(true)
        api
            .email
            .lists
            .create({
                token: user.getTokenId(),
                projectId: props.project.getId(),
                title,
                description,
            })
            .then(data => {
                props.project.event$.next({
                    type: ProjectMessageType.SET_EMAIL_LIST,
                    data
                })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <Card className={styles.section}>
            <Box p="2">
                <Text
                    className={styles.title}
                >
                    Title
                </Text>
                <TextField.Root
                    type="text"
                    size="2"
                    variant="surface"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className={styles.input}
                />

            </Box>

            <Box p="2">
                <Text
                    className={styles.title}
                >
                    Description
                </Text>
                <TextField.Root
                    type="text"
                    size="2"
                    variant="surface"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className={styles.input}
                />
            </Box>

            <Button
                loading={isLoading}
                onClick={onClick}
            >
                Create mail list
            </Button>
        </Card>
    )
}

export default RouteProjectSettingsMailListCreate