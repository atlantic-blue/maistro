import React from "react";
import { Button, Flex } from "@radix-ui/themes";

import EditorData, { EditorDataType } from "./EditorData";
import { SectionBlankProps } from "../../Templates/Section/SectionBlank";
import { SectionTestimonialsProps } from "../../Templates/Section/SectionTestimonials/SectionTestimonialsTypes";

interface EditorProps {
    onSaveData: (props: SectionTestimonialsProps) => void
    onUploadFile: (file: File) => Promise<string>
    children: React.ReactNode
}

const TestimonialsBasicEditor: React.FC<SectionTestimonialsProps & EditorProps> = (props) => {
    const [state, setState] = React.useState(props)

    const onSave = () => {
        props.onSaveData({
            name: state.name,
            pictureUrl: state.pictureUrl,
            testimonial: state.testimonial
        })
    }

    return (
        <>
            <Flex direction="column" gap="3">
                <EditorData
                    type={EditorDataType.TEXT}
                    name="Name"
                    value={state.name}
                    onChange={e => {
                        setState(prev => {
                            return {
                                ...prev,
                                name: e
                            }
                        })
                    }}
                />

                <EditorData
                    type={EditorDataType.TEXT}
                    name="Testimonial"
                    section="content"
                    aiEnabled
                    value={state.testimonial}
                    onChange={e => {
                        setState(prev => {
                            return {
                                ...prev,
                                testimonial: e
                            }
                        })
                    }}
                />

                <EditorData
                    type={EditorDataType.IMAGE}
                    name="Picture Image"
                    value={state.pictureUrl}
                    onChange={e => {
                        setState(prev => {
                            return {
                                ...prev,
                                pictureUrl: e
                            }
                        })
                    }}
                    onUploadFile={props.onUploadFile}
                />

                <Flex gap="3" mt="4" justify="end">
                    <Button onClick={onSave}>Save</Button>
                </Flex>
            </Flex>
        </>
    )
};

export default TestimonialsBasicEditor