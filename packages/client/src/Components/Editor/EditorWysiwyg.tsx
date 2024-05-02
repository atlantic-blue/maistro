import React from "react";
import htmlReactParser from 'html-react-parser'
import { Box, Button, Flex, Text } from "@radix-ui/themes";
import { EditorWysiwygProps } from "./EditorData";
import Wysiwyg, { WysiwygApi } from "../Wysiwyg/Wysiwyg";
import ErrorBoundary from "../../Errors/ErrorBoundary";
import { defaultColorScheme } from "../../PageContext";

const EditorWysiwyg: React.FC<EditorWysiwygProps> = (props) => {
    const editorApiRef = React.useRef<WysiwygApi>(null);

    const onClick = () => {
        const content = editorApiRef.current?.getContent()
        props.onChange(content || "")
    }

    return (
        <ErrorBoundary>
            <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                    {props.name}
                </Text>

                <Wysiwyg
                    key={Date.now()}
                    colourScheme={defaultColorScheme}
                    apiRef={editorApiRef}
                    onUploadFile={props.onUploadFile}
                    isEditable
                >
                    {htmlReactParser(props.value || "")}
                </Wysiwyg>
                <Flex gap="2" mt="4" justify="center">
                    <Button variant="outline" onClick={onClick}>
                        Save {props.name}
                    </Button>
                </Flex>
            </Box>
        </ErrorBoundary>
    )
}

export default EditorWysiwyg
