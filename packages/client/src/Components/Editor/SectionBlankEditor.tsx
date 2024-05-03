import React from "react";
import { Button, Flex } from "@radix-ui/themes";

import EditorData, { EditorDataType } from "./EditorData";
import { SectionBlankProps } from "../../Templates/Section/SectionBlank";

interface EditorProps {
    onSaveData: (props: SectionBlankProps) => void
    onUploadFile: (file: File) => Promise<string>
    children: React.ReactNode
}

const SectionBlankEditor: React.FC<SectionBlankProps & EditorProps> = (props) => {
    return (
        <>
            <Flex direction="column" gap="3">
                <EditorData
                    type={EditorDataType.WYSIWYG}
                    name="Content"
                    value={props.content}
                    onUploadFile={props.onUploadFile}
                    onChange={e => {
                        props.onSaveData({
                            content: e
                        })
                    }}
                />
            </Flex>
        </>
    )
};

export default SectionBlankEditor