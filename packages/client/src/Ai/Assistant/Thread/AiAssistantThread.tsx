import React from "react"
import { ApiContext } from "../../../Api/ApiProvider"
import { ProjectsContext } from "../../../Projects"
import { useParams } from "react-router-dom"
import { Avatar, Box, Card, Flex, Text } from "@radix-ui/themes"
import { ProjectThreadMessageRole, ProjectThreadMessageType } from "../../../types"
import useObservable from "../../../Utils/Hooks/UseObservable"
import { filter } from "rxjs"

import * as styles from "./AiAssistantThread.scss"

const AiAssistantThread = () => {
    const { projects, user } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")

    const thread = Object.values(project.getThreads())[0]

    useObservable(thread.event$.pipe(filter(event => {
        return event.type === ProjectThreadMessageType.PUSH_MESSAGE
    })))

    if (!project || !thread) {
        return null
    }

    return (
        <div>
            {thread?.getMessages()
                .filter(Boolean)
                .filter(message => message.role !== ProjectThreadMessageRole.SYSTEM)
                .map((message, key) => {
                    return (
                        <Card key={key} className={styles.message} >
                            <Box className={styles.timestamp}>
                                {message.timestamp}
                            </Box>

                            <Flex gap="3" align="start" justify="start">
                                <Avatar
                                    size="3"
                                    src={message.role === ProjectThreadMessageRole.ASSISTANT ? "https://maistro.website/assets/logo.svg" : user.getAvatar()}
                                    fallback={message.role === ProjectThreadMessageRole.ASSISTANT ? "Ai" : user.getName()}
                                    radius="small"
                                    className={styles.avatar}
                                />

                                <Box>
                                    <Text as="div" size="2" weight="bold">
                                        {message.role === ProjectThreadMessageRole.ASSISTANT ? "Maistro" : "You"}
                                    </Text>
                                    <Box>
                                        {message?.content?.map((c, key) => {
                                            return (
                                                <Text as="div" size="2" color="gray" key={key}>
                                                    {c.text}
                                                </Text>
                                            )
                                        })}
                                    </Box>
                                </Box>
                            </Flex>
                        </Card>
                    )
                })}
        </div>
    )
}

export default AiAssistantThread
