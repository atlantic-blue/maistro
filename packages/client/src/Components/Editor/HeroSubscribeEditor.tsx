import React from "react";
import { useParams } from "react-router-dom";
import { Button, DropdownMenu, Flex } from "@radix-ui/themes";

import { SectionHeroSubscribeProps } from "../../Templates/Section/SectionHero/SectionHeroTypes";
import EditorData, { EditorDataType } from "./EditorData";
import { ProjectsContext } from "../../Projects";
import { ProjectEmailList } from "../../Store/EmailList";

interface EditorProps {
    onSaveData: (props: SectionHeroSubscribeProps) => void
    onUploadFile: (file: File) => Promise<string>
    children: React.ReactNode
}

const HeroSubscribeEditor: React.FC<SectionHeroSubscribeProps & EditorProps> = (props) => {
    const { projects } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")
    const [emailList, setEmailList] = React.useState<ProjectEmailList | null>(project.getEmailListById(props.emailListId))
    const [state, setState] = React.useState(props)

    const onSave = () => {
        props.onSaveData({
            content: state.content,
            cta: state.cta,
            ctaLink: state.ctaLink,
            img: state.img,
            title: state.title,
            emailListId: state.emailListId,
            url: state.url,
            successMessage: state.successMessage,
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

                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Button variant="soft">
                            {emailList ? `Current Email List: ${emailList.getTitle()}` : "Select Email List"}
                            <DropdownMenu.TriggerIcon />
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        {Object.values(project.getEmailLists()).map(emailList => {
                            return (
                                <DropdownMenu.Item
                                    key={emailList.getId()}
                                    onClick={() => {
                                        setState(prev => {
                                            return {
                                                ...prev,
                                                emailListId: emailList.getId(),
                                            }
                                        })
                                        setEmailList(emailList)
                                    }}
                                >
                                    {emailList.getTitle()}
                                </DropdownMenu.Item>
                            )
                        })}
                    </DropdownMenu.Content>
                </DropdownMenu.Root>

                <EditorData
                    type={EditorDataType.TEXT}
                    name="CTA text"
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
                    name="Success Message"
                    value={state.successMessage}
                    onChange={e => {
                        setState(prev => {
                            return {
                                ...prev,
                                successMessage: e
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

export default HeroSubscribeEditor