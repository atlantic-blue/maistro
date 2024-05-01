import React from "react";
import htmlReactParser from 'html-react-parser'
import { Button, Flex, Section, Text } from "@radix-ui/themes";
import { EditorDataProps, EditorWysiwygProps } from "./EditorData";
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
            <Section>
                <Text as="div" size="2" mb="1" weight="bold">
                    {props.name}
                </Text>

                <Wysiwyg
                    key={Date.now()}
                    colourScheme={defaultColorScheme}
                    apiRef={editorApiRef}
                    onUploadImage={props.onUploadImage}
                    isEditable
                >
                    {htmlReactParser(props.value || "")}
                </Wysiwyg>
                <Flex gap="2" mt="4" justify="center">
                    <Button variant="outline" onClick={onClick}>
                        Save {props.name}
                    </Button>
                </Flex>
            </Section>
        </ErrorBoundary>
    )
}

export default EditorWysiwyg
