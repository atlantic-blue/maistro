import React from "react";
import { SectionHeroProps } from "../../Templates/Section/SectionHero/SectionHeroTypes";
import { Button, Flex } from "@radix-ui/themes";
import EditorData, { EditorDataType } from "./EditorData";
import { SectionHeroVideoProps } from "../../Templates/Section/SectionHero/SectionHeroVideo/SectionHeroVideo";

interface EditorProps {
    onSaveData: (props: SectionHeroProps) => void
    onUploadFile: (file: File) => Promise<string>
    children: React.ReactNode
}

const HeroVideoEditor: React.FC<SectionHeroVideoProps & EditorProps> = (props) => {
    const [state, setState] = React.useState(props)


    const onSave = () => {
        props.onSaveData({
            content: state.content,
            cta: state.cta,
            ctaLink: state.ctaLink,
            video: state.video,
            title: state.title,
        })
    }

    return (
        <>
            <Flex direction="column" gap="3">
                <EditorData
                    type={EditorDataType.TEXT}
                    name="Title"
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
                    type={EditorDataType.VIDEO}
                    name="Hero video"
                    onUploadFile={props.onUploadFile}
                    value={state.video.src}
                    onChange={e => {
                        setState(prev => {
                            return {
                                ...prev,
                                video: {
                                    ...prev.video,
                                    src: e,
                                }
                            }
                        })
                    }}
                />

                <EditorData
                    type={EditorDataType.WYSIWYG}
                    name="Content"
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

export default HeroVideoEditor