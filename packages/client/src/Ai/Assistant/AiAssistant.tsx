import React from "react"
import { useParams } from "react-router-dom";
import { Avatar, Dialog, Flex, IconButton, Text } from "@radix-ui/themes"

import IconClose from "../../Components/Icons/Close/Close";
import AiAssistantInput from "./Input/AiAssistantInput";
import { ApiContext } from "../../Api/ApiProvider";
import { ProjectsContext } from "../../Projects";
import AiAssistantThread from "./Thread/AiAssistantThread";

import { ProjectMessageType, ProjectThreadMessage, ProjectThreadMessageType } from "../../types";

import * as styles from "./AiAssistant.scss"
import useObservable from "../../Utils/Hooks/UseObservable";
import { filter } from "rxjs";
import { PaymentsContext } from "../../Payments/PaymentsProvider";
import AvatarMaistro from "../../Components/AvatarMaistro/AvatarMaistro";

const AiAssistant: React.FC = () => {
    const { api } = React.useContext(ApiContext)
    const { projects, user } = React.useContext(ProjectsContext)
    const { isSubscribed, redirectToCheckout } = React.useContext(PaymentsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")

    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    const [open, setOpen] = React.useState(false);
    const thread = project.getThreadByName(project.getName())

    useObservable(project.event$.pipe(filter(event => {
        return event.type === ProjectMessageType.SET_AI_THREAD
    })))


    if (!project || !thread) {
        return null
    }

    const onSubmit = async (message: ProjectThreadMessage) => {
        try {
            setIsLoading(true)

            thread.event$.next({
                type: ProjectThreadMessageType.PUSH_MESSAGE,
                data: {
                    message,
                    inputTokens: thread.getInputTokens(),
                    outputTokens: thread.getOutputTokens(),
                }
            })

            const response = await api.ai.aiThreads.updateById({
                token: user.getTokenId(),
                projectId: project.getId(),
                threadId: thread.getId(),
                messages: [message],
            })

            thread.event$.next({
                type: ProjectThreadMessageType.PUSH_MESSAGE,
                data: response
            })
        } catch (error) {
            // TODO app level error
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.main}>
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger>
                    <IconButton variant="ghost" className={styles.iconButton}>
                        <AvatarMaistro />
                    </IconButton>
                </Dialog.Trigger>

                <Dialog.Content maxWidth="800px">
                    <Flex>
                        <Dialog.Close>
                            <IconButton
                                size="1"
                                variant="soft"
                                color="gray"
                                style={{ marginLeft: "auto" }}
                                className={styles.button}
                            >
                                <IconClose style={{ width: "10px" }} />
                            </IconButton>
                        </Dialog.Close>
                    </Flex>

                    <Dialog.Title align="center">
                        Maistro Assistant
                    </Dialog.Title>

                    <AiAssistantThread />
                    <AiAssistantInput onSubmit={
                        !isSubscribed && thread.getOutputTokens() > 500 ?
                            redirectToCheckout :
                            onSubmit
                    }
                        isLoading={isLoading} />
                    {error && <Text>
                        {error}
                    </Text>}
                </Dialog.Content>
            </Dialog.Root>
        </div>
    )
}

export default AiAssistant
