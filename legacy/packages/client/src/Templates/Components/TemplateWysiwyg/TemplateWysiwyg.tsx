import React from "react"

import { Box } from "@radix-ui/themes"

interface TemplateWysiwygProps {
    content: string | React.ReactNode
    className?: string
}

const TemplateWysiwyg: React.FC<TemplateWysiwygProps> = (props) => {
    if (React.isValidElement(props.content)) {
        return (
            <Box
                className={props.className}>
                {props.content}
            </Box>
        )
    }

    if (typeof props.content === "string") {
        return (
            <Box
                className={props.className}
                dangerouslySetInnerHTML={{ __html: props.content }}
            />
        )
    }

    return null
}

export default TemplateWysiwyg
