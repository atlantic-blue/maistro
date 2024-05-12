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

const AiAssistant: React.FC = () => {
    const { api } = React.useContext(ApiContext)
    const { projects, user } = React.useContext(ProjectsContext)
    const { isSubscribed, redirectToCheckout } = React.useContext(PaymentsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")

    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState(null)
    const [open, setOpen] = React.useState(false);
    const thread = Object.values(project.getThreads())[0]

    useObservable(project.event$.pipe(filter(event => {
        return event.type === ProjectMessageType.SET_AI_THREAD
    })))


    if (!project || !thread) {
        return null
    }

    const onSubmit = async (message: ProjectThreadMessage) => {
        if (!isSubscribed) {
            redirectToCheckout()
            return
        }
        try {
            setIsLoading(true)

            thread.event$.next({
                type: ProjectThreadMessageType.PUSH_MESSAGE,
                data: message
            })

            const response = await api.ai.aiThreads.updateById({
                token: user.getTokenId(),
                projectId: project.getId(),
                threadId: thread.getId(),
                messages: [message],
            })

            thread.event$.next({
                type: ProjectThreadMessageType.PUSH_MESSAGE,
                data: response.message
            })
        } catch (error) {
            // TODO app level error
            console.log("HRE")
            console.log(error);
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
                        <Avatar
                            fallback="Ai"
                            src="https://maistro.website/assets/logo.svg"
                            className={styles.avatar}
                        />
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
                    <AiAssistantInput onSubmit={onSubmit} isLoading={isLoading} />
                    {error && <Text>
                        {error}
                    </Text>}
                </Dialog.Content>
            </Dialog.Root>
        </div>
    )
}

export default AiAssistant
