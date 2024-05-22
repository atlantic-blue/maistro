import React from "react";
import { Button, Flex } from "@radix-ui/themes";

import EditorData, { EditorDataType } from "./EditorData";
import { SectionAboutUsProps } from "../../Templates/Section/SectionAboutUs/SectionAboutUsTypes";

interface EditorProps {
    onSaveData: (props: SectionAboutUsProps) => void
    onUploadFile: (file: File) => Promise<string>
    children: React.ReactNode
}

const AboutUsBasicEditor: React.FC<SectionAboutUsProps & EditorProps> = (props) => {
    const [state, setState] = React.useState(props)

    const onSave = () => {
        props.onSaveData({
            content: state.content,
            title: state.title,
        })
    }

    return (
        <>
            <Flex direction="column" gap="3">
                <EditorData
                    type={EditorDataType.TEXT}
                    name="Name"
                    section="headline"
                    aiEnabled
                    value={state.title}
                    onChange={e => {
                        setState(prev => {
                            return {
                                ...prev,
                                title: e
                            }
                        })
                    }}
                />

                <EditorData
                    type={EditorDataType.TEXT}
                    name="Testimonial"
                    section="content"
                    aiEnabled
                    value={state.content}
                    onChange={e => {
                        setState(prev => {
                            return {
                                ...prev,
                                content: e
                            }
                        })
                    }}
                />

                <Flex gap="3" mt="4" justify="end">
                    <Button onClick={onSave}>Save</Button>
                </Flex>
            </Flex>
        </>
    )
};

export default AboutUsBasicEditor