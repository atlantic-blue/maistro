import React from "react"
import { ApiContext } from "../../../Api/ApiProvider"
import { ProjectsContext } from "../../../Projects"
import { useParams } from "react-router-dom"
import { Avatar, Box, Card, Flex, Text } from "@radix-ui/themes"
import { ProjectThreadMessageRole, ProjectThreadMessageType } from "../../../types"
import useObservable from "../../../Utils/Hooks/UseObservable"
import { filter } from "rxjs"

import * as styles from "./AiAssistantThread.scss"
import { IconLogoSimple } from "../../../Components/Icons/Logo/Logo"

const AiAssistantThread = () => {
    const { projects, user } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")

    const thread = project.getThreadByName(project.getName())

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
                                    src={message.role === ProjectThreadMessageRole.ASSISTANT ? "" : user.getAvatar()}
                                    fallback={
                                        message.role === ProjectThreadMessageRole.ASSISTANT ? (
                                            <Box width="24px" height="24px">
                                                <IconLogoSimple />
                                            </Box>
                                        ) : user.getName().charAt(0)
                                    }
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
