import React from "react"
import { Box, TextArea, IconButton } from "@radix-ui/themes"
import IconUpLoad from "../../../Components/Icons/Upload/Upload"

import * as styles from "./AiAssistantInput.scss"
import { ProjectThreadMessage, ProjectThreadMessageRole } from "../../../types"

interface AiAssistantInputProps {
    onSubmit: (message: ProjectThreadMessage) => void
    isLoading: boolean
}

const AiAssistantInput: React.FC<AiAssistantInputProps> = (props) => {
    const [input, setInput] = React.useState("")

    const onSubmit = async () => {
        if (!input) {
            return
        }

        const message: ProjectThreadMessage = {
            timestamp: new Date().toUTCString(),
            content: [{
                text: input,
            }],
            role: ProjectThreadMessageRole.USER
        }

        props.onSubmit(message)
        setInput("")
    }

    return (
        <Box>
            <TextArea
                placeholder="What would you like to create?"
                size="3"
                variant="surface"
                value={input}
                onChange={e => setInput(e.target.value)}
                required
            />
            <IconButton
                size="1"
                variant="soft"
                onClick={onSubmit}
                className={styles.inputButton}
                loading={props.isLoading}
            >
                <IconUpLoad className={styles.inputButtonIcon} />
            </IconButton>
        </Box>
    )
}

export default AiAssistantInput