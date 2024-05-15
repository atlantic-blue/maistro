import React from "react";
import { TextField, Text, Box, Flex, TextArea } from "@radix-ui/themes";

import { EditorTextProps } from "./EditorData";
import EditorTextAi from "../../Ai/EditorTextAi/EditorTextAi";

const EditorText: React.FC<EditorTextProps> = (props) => {
    return (
        <Box mb="2">
            <Flex align="center" gap="2" justify="between" mb="2">
                <Text as="div" size="1" mb="1" weight="bold">
                    {props.name}
                </Text>
                {props.aiEnabled && (
                    <EditorTextAi
                        onChange={props.onChange}
                        value={props.value}
                        copywritingType="Advertising"
                        section={props.section}
                    />)
                }
            </Flex>
            <TextArea
                placeholder={props.value}
                size="2"
                rows={2}
                variant="surface"
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
                required
            />
        </Box>
    )
}

export default EditorText
