import React from "react";
import { SectionHeroProps } from "../../Templates/Section/SectionHero/SectionHeroTypes";
import { Button, Flex } from "@radix-ui/themes";
import EditorData, { EditorDataType } from "./EditorData";

interface EditorProps {
    onSaveData: (props: SectionHeroProps) => void
    onUploadFile: (file: File) => Promise<string>
    children: React.ReactNode
}

const HeroBasicEditor: React.FC<SectionHeroProps & EditorProps> = (props) => {
    const [state, setState] = React.useState(props)


    const onSave = () => {
        props.onSaveData({
            content: state.content,
            cta: state.cta,
            ctaLink: state.ctaLink,
            img: state.img,
            title: state.title,
        })
    }

    return (
        <>
            <Flex direction="column" gap="3">
                <EditorData
                    type={EditorDataType.TEXT}
                    name="Title"
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
                    type={EditorDataType.IMAGE}
                    name="Hero Image"
                    value={state.img.src}
                    onChange={e => {
                        setState(prev => {
                            return {
                                ...prev,
                                img: {
                                    ...prev.img,
                                    src: e,
                                }
                            }
                        })
                    }}
                    onUploadFile={props.onUploadFile}
                />

                <EditorData
                    type={EditorDataType.WYSIWYG}
                    name="Content"
                    section="content"
                    aiEnabled
                    value={state.content}
                    onUploadFile={props.onUploadFile}
                    onChange={e => {
                        setState(prev => {
                            return {
                                ...prev,
                                content: e
                            }
                        })
                    }}
                />

                <EditorData
                    type={EditorDataType.TEXT}
                    name="cta text"
                    section="cta"
                    aiEnabled
                    value={state.cta}
                    onChange={e => {
                        setState(prev => {
                            return {
                                ...prev,
                                cta: e
                            }
                        })
                    }}
                />

                <EditorData
                    type={EditorDataType.TEXT}
                    name="cta link"
                    section="cta"
                    value={state.ctaLink}
                    onChange={e => {
                        setState(prev => {
                            return {
                                ...prev,
                                ctaLink: e
                            }
                        })
                    }}
                />

            </Flex>
            {props.children}

            <Flex gap="3" mt="4" justify="end">
                <Button onClick={onSave}>Save</Button>
            </Flex>
        </>
    )
};

export default HeroBasicEditor