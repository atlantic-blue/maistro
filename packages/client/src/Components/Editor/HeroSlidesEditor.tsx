import React from "react";
import { Button, Card, Flex } from "@radix-ui/themes";

import { SectionHeroSlidesProps } from "../../Templates/Section/SectionHero/SectionHeroSlides/SectionHeroSlides";
import EditorData, { EditorDataType } from "./EditorData";

interface EditorProps {
    onSaveData: (props: SectionHeroSlidesProps) => void
    onUploadFile: (file: File) => Promise<string>
    children: React.ReactNode
}

const HeroSlidesEditor: React.FC<SectionHeroSlidesProps & EditorProps> = (props) => {
    const [state, setState] = React.useState(props)

    const onSave = () => {
        props.onSaveData({
            transition: props.transition,
            slides: props.slides
        })
    }

    return (
        <>
            <Flex direction="column" gap="3">
                {state.slides.map((slide, index) => {
                    return (
                        <Card>
                            <EditorData
                                type={EditorDataType.TEXT}
                                name="Title"
                                value={slide.title}
                                section="headline"
                                aiEnabled
                                onChange={e => {
                                    setState(prev => {
                                        prev.slides[index] = {
                                            ...prev.slides[index],
                                            title: e
                                        }
                                        return {
                                            ...prev,
                                            slides: prev.slides
                                        }
                                    })
                                }}
                            />

                            <EditorData
                                type={EditorDataType.IMAGE}
                                name="Hero Image"
                                value={slide.img.src}
                                onChange={e => {
                                    setState(prev => {
                                        prev.slides[index] = {
                                            ...prev.slides[index],
                                            img: {
                                                ...prev.slides[index].img,
                                                src: e,
                                            }
                                        }
                                        return {
                                            ...prev,
                                            slides: prev.slides
                                        }
                                    })
                                }}
                                onUploadFile={props.onUploadFile}
                            />

                            <EditorData
                                type={EditorDataType.WYSIWYG}
                                name="Content"
                                value={slide.content}
                                onUploadFile={props.onUploadFile}
                                onChange={e => {
                                    setState(prev => {
                                        prev.slides[index] = {
                                            ...prev.slides[index],
                                            content: e
                                        }
                                        return {
                                            ...prev,
                                            slides: prev.slides
                                        }
                                    })
                                }}
                            />

                            <EditorData
                                type={EditorDataType.TEXT}
                                name="cta text"
                                section="cta"
                                aiEnabled
                                value={slide.cta}
                                onChange={e => {
                                    setState(prev => {
                                        prev.slides[index] = {
                                            ...prev.slides[index],
                                            cta: e
                                        }
                                        return {
                                            ...prev,
                                            slides: prev.slides
                                        }
                                    })
                                }}
                            />

                            <EditorData
                                type={EditorDataType.TEXT}
                                name="cta link"
                                section="cta"
                                value={slide.ctaLink}
                                onChange={e => {
                                    setState(prev => {
                                        prev.slides[index] = {
                                            ...prev.slides[index],
                                            ctaLink: e
                                        }
                                        return {
                                            ...prev,
                                            slides: prev.slides
                                        }
                                    })
                                }}
                            />

                            <Button size="1" variant="ghost" onClick={() => {
                                setState(prev => {
                                    return {
                                        ...prev,
                                        slides: prev.slides.filter(s => s !== slide)
                                    }
                                })
                            }}>
                                Remove
                            </Button>
                        </Card>
                    )
                })}

                <Button
                    size="1"
                    variant="ghost"
                    onClick={() => {
                        setState(prev => {
                            return {
                                ...prev,
                                slides: [
                                    ...prev.slides,
                                    {
                                        img: {
                                            src: "",
                                            alt: "",
                                        },
                                        title: "Title.",
                                        content: "Amazing content.",
                                        cta: "Get Started",
                                        ctaLink: "/"
                                    }
                                ]
                            }
                        })
                    }}
                >
                    Create Link
                </Button>
            </Flex>
            {props.children}

            <Flex gap="3" mt="4" justify="end">
                <Button onClick={onSave}>Save</Button>
            </Flex>
        </>
    )
};

export default HeroSlidesEditor