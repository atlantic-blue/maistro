import React from "react"
import { Button, Card, Flex } from "@radix-ui/themes"
import { randImg } from '@ngneat/falso';

import EditorData, { EditorDataType } from "./EditorData"
import { SectionServicesProps } from "../../Templates/Section/SectionServices/SectionServicesTypes"

interface EditorProps {
    onSaveData: (props: SectionServicesProps) => void
    onUploadFile: (file: File) => Promise<string>
    children: React.ReactNode
}

const ServicesBasicEditor: React.FC<SectionServicesProps & EditorProps> = (props) => {
    const [state, setState] = React.useState<SectionServicesProps>(props)

    const onSave = () => {
        props.onSaveData({
            services: state.services,
        })
    }

    return (
        <>
            <Flex direction="column" gap="3">
                {
                    state?.services?.map((service, index) => {
                        return (
                            <Card key={service.imageUrl}>
                                <EditorData
                                    type={EditorDataType.TEXT}
                                    name="Title"
                                    section="headline"
                                    aiEnabled
                                    value={service.title}
                                    onChange={data => setState(prev => {
                                        prev.services[index] = {
                                            ...prev.services[index],
                                            title: data,
                                        }

                                        return {
                                            ...prev
                                        }
                                    })}
                                />

                                <EditorData
                                    type={EditorDataType.TEXT}
                                    name="Description"
                                    section="content"
                                    aiEnabled
                                    value={service.description}
                                    onChange={data => setState(prev => {
                                        prev.services[index] = {
                                            ...prev.services[index],
                                            description: data,
                                        }

                                        return {
                                            ...prev
                                        }
                                    })}
                                />

                                <EditorData
                                    type={EditorDataType.IMAGE}
                                    name="Service Image"
                                    value={service.imageUrl}
                                    onChange={data => setState(prev => {
                                        prev.services[index] = {
                                            ...prev.services[index],
                                            imageUrl: data,
                                        }

                                        return {
                                            ...prev
                                        }
                                    })}
                                    onUploadFile={props.onUploadFile}
                                />

                                <Button size="1" variant="ghost" onClick={() => {
                                    setState(prev => {
                                        return {
                                            ...prev,
                                            services: prev.services.filter(i => i !== service)
                                        }
                                    })
                                }}>
                                    Remove
                                </Button>
                            </Card>
                        )
                    })
                }

                <Button
                    size="1"
                    variant="ghost"
                    onClick={
                        () =>
                            setState(prev => {
                                const nextServices = [
                                    ...prev.services,
                                    { title: "Edit Me!", description: "Edit Me!", imageUrl: randImg() }
                                ]

                                return {
                                    ...prev,
                                    services: nextServices,
                                }
                            })
                    }
                >
                    Create Service
                </Button>

            </Flex>
            {props.children}

            <Flex gap="3" mt="4" justify="end">
                <Button onClick={() => onSave()}>Save</Button>
            </Flex>
        </>
    )
};

export default ServicesBasicEditor