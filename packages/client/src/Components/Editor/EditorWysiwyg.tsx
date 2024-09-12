import React from "react";
import htmlReactParser from 'html-react-parser'
import { Box, Button, Flex, Text } from "@radix-ui/themes";
import { EditorWysiwygProps } from "./EditorData";
import Wysiwyg, { WysiwygApi } from "../Wysiwyg/Wysiwyg";
import ErrorBoundary from "../../Errors/ErrorBoundary";

const EditorWysiwyg: React.FC<EditorWysiwygProps> = (props) => {
    const editorApiRef = React.useRef<WysiwygApi>(null);
    const [content, setContent] = React.useState(htmlReactParser(props.value || ""))

    const onClick = () => {
        const content = editorApiRef.current?.getContent() || ""
        props.onChange(content)
        setContent(content)
    }

    return (
        <ErrorBoundary>
            <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                    {props.name}
                </Text>

                <Wysiwyg
                    key={Date.now()}
                    apiRef={editorApiRef}
                    onUploadFile={props.onUploadFile}
                    isEditable
                >
                    {content}
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
