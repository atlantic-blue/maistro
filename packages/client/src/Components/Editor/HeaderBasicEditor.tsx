import React from "react"
import { Button, Card, Flex } from "@radix-ui/themes"

import EditorData, { EditorDataType } from "../../Components/Editor/EditorData"
import { HeaderProps } from "../../Templates/Header/HeaderTypes"

interface EditorProps {
    onSaveData: (props: HeaderProps) => void
    onUploadFile: (file: File) => Promise<string>
    children: React.ReactNode
}

const HeaderBasicEditor: React.FC<HeaderProps & EditorProps> = (props) => {
    const [logoUrl, setLogoUrl] = React.useState(props.logo.url)
    const [logoSlogan, setLogoSlogan] = React.useState(props.logo.slogan)
    const [links, setLinks] = React.useState(props.links || [])


    const onSave = () => {
        props.onSaveData({
            logo: {
                url: logoUrl,
                slogan: logoSlogan,
            },
            links,
        })
    }

    return (
        <>
            <Flex direction="column" gap="3">
                <EditorData
                    type={EditorDataType.IMAGE}
                    name="Logo"
                    value={logoUrl}
                    onChange={setLogoUrl}
                    onUploadFile={props.onUploadFile}
                />
                <EditorData
                    type={EditorDataType.TEXT}
                    name="Slogan"
                    value={logoSlogan}
                    onChange={setLogoSlogan}
                />

                {
                    links.map((link, index) => {
                        return (
                            <Card key={index}>
                                <EditorData
                                    type={EditorDataType.TEXT}
                                    name="Link Text"
                                    value={link.name}
                                    onChange={data => setLinks(prev => {
                                        prev[index] = {
                                            href: prev[index].href,
                                            name: data,
                                        }
                                        return [
                                            ...prev
                                        ]
                                    })}
                                />

                                <EditorData
                                    type={EditorDataType.TEXT}
                                    name="Link"
                                    value={link.href}
                                    onChange={data => setLinks(prev => {
                                        prev[index] = {
                                            name: prev[index].name,
                                            href: data,
                                        }
                                        return [
                                            ...prev
                                        ]
                                    })}
                                />

                                <Button size="1" variant="ghost" onClick={() => {
                                    setLinks(prev => {

                                        return prev.filter(i => i !== link)
                                    })
                                }}>
                                    Remove
                                </Button>
                            </Card>
                        )
                    })
                }

                <Button size="1" variant="ghost" onClick={() => setLinks([...links, { href: "#Edit-me!", name: "Edit me" }])}>
                    Create Link
                </Button>

            </Flex>
            {props.children}

            <Flex gap="3" mt="4" justify="end">
                <Button onClick={() => onSave()}>Save</Button>
            </Flex>
        </>
    )
};

export default HeaderBasicEditor