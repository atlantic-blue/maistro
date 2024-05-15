import React from "react"
import { useParams } from "react-router-dom"

import { ApiContext } from "../../Api/ApiProvider"
import { ProjectsContext } from "../../Projects"
import { PaymentsContext } from "../../Payments/PaymentsProvider"
import AiAssistantInput from "../Assistant/Input/AiAssistantInput"
import { ProjectThreadMessage } from "../../types"
import env from "../../env"

interface EditorImageAiProps {
    onChange: (value: string) => void
}

const EditorImageAi: React.FC<EditorImageAiProps> = (props) => {
    const { api } = React.useContext(ApiContext)
    const { projects, user } = React.useContext(ProjectsContext)
    const { isSubscribed, redirectToCheckout } = React.useContext(PaymentsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")

    const [isLoading, setIsLoading] = React.useState(false)

    const onSubmit = async (message: ProjectThreadMessage) => {
        try {
            if (!projectId || !project) {
                return
            }
            setIsLoading(true)

            const aiImageResponse = await api.ai.aiImages.create({
                token: user.getTokenId(),
                projectId: projectId,
                data: `
                ${project.getName()} ${message.content[0].text}.
                `
            })

            const url = `${env.hosting.baseUrl}/${aiImageResponse.src}`
            props.onChange(url)
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AiAssistantInput
            placeholder="Describe the image you wish to see"
            onSubmit={isSubscribed ? onSubmit : redirectToCheckout}
            isLoading={isLoading}
        />
    )
}

export default EditorImageAi
