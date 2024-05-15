import React from "react"
import { Button, DropdownMenu } from "@radix-ui/themes"

import AvatarMaistro from "../../Components/AvatarMaistro/AvatarMaistro"
import AiAssistantInput from "../Assistant/Input/AiAssistantInput"

import { ProjectThreadMessage, ProjectThreadMessageRole, ProjectThreadName } from "../../types"
import { EditorTextProps } from "../../Components/Editor/EditorData"

import { ProjectsContext } from "../../Projects"
import { useParams } from "react-router-dom"
import { ApiContext } from "../../Api/ApiProvider"
import { PaymentsContext } from "../../Payments/PaymentsProvider"

import * as styles from "./EditorTextAi.scss"
import { createMaistroCopywritingPrompt } from "../prompts/MaistroCopywriting"

interface EditorTextAiProps {
    copywritingType: "Advertising" | "SEO" | "Content"
    onChange: EditorTextProps["onChange"]
    section: EditorTextProps["section"]
    value?: EditorTextProps["value"]
}

const EditorTextAi: React.FC<EditorTextAiProps> = (props) => {
    const { api } = React.useContext(ApiContext)
    const { projects, user } = React.useContext(ProjectsContext)
    const { isSubscribed, redirectToCheckout } = React.useContext(PaymentsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")
    const thread = project.getThreadByName(ProjectThreadName.COPYWRITING)

    const [isLoading, setIsLoading] = React.useState(false)

    const onSubmit = async (message: ProjectThreadMessage) => {
        try {
            if (!project || !thread) {
                return
            }

            setIsLoading(true)

            const response = await api.ai.aiThreads.updateById({
                token: user.getTokenId(),
                projectId: project.getId(),
                threadId: thread.getId(),
                stateless: true,
                messages: [
                    {
                        timestamp: new Date().toISOString(),
                        role: ProjectThreadMessageRole.USER,
                        content: [
                            {
                                text: createMaistroCopywritingPrompt()
                            },
                            {
                                text: `Company Name: ${project.getName()}`,
                            },
                            {
                                text: `Type of Copywriting: ${props.copywritingType}`,
                            },
                            {
                                text: `Section: ${props.section}`,
                            },
                            {
                                text: `Current Text: ${props.value || ""}`,
                            },
                            {
                                text: `Input: ${message.content[0].text}`,
                            },
                        ]
                    },
                ],
            })

            props.onChange(response.message.content[0].text.trim().replaceAll("\n", ""))

        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Button variant="ghost">
                    <AvatarMaistro classNames={{ icon: styles.avatarIcon }} />
                    <DropdownMenu.TriggerIcon />
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <AiAssistantInput
                    placeholder="Describe any changes you wish to see"
                    onSubmit={isSubscribed ? onSubmit : redirectToCheckout}
                    isLoading={isLoading}
                />
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )
}

export default EditorTextAi
