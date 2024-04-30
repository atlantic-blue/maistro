import React from "react"

import { Button, Card, Flex } from "@radix-ui/themes"
import EditorData, { EditorDataType } from "../../Components/Editor/EditorData"
import { HeaderBurgerLink, HeaderProps } from "../../Templates/Header/HeaderTypes"

interface EditorProps {
    onSaveData: (props: HeaderProps) => void
    onUploadImage: (file: File) => Promise<string>
    children: React.ReactNode
}

const HeaderBasicEditor: React.FC<HeaderProps & EditorProps> = (props) => {
    const [logoUrl, setLogoUrl] = React.useState(props.logo.url)
    const [logoSlogan, setLogoSlogan] = React.useState(props.logo.slogan)
    const [links, setLinks] = React.useState(Object.values(props.links || {}))


    const onSave = (ls: HeaderBurgerLink[]) => {
        const headerLinks: Record<string, HeaderBurgerLink> = {}
        ls.forEach((l) => {
            headerLinks[l.value.toLowerCase()] = l
        })

        props.onSaveData({
            logo: {
                url: logoUrl,
                slogan: logoSlogan,
            },
            links: headerLinks
        })
    }

    return (
        <>
            <Flex direction="column" gap="3">
                <EditorData
                    type={EditorDataType.IMAGE}
                    name="Logo Url"
                    value={logoUrl}
                    onChange={setLogoUrl}
                    onUploadImage={props.onUploadImage}
                />
                <EditorData
                    type={EditorDataType.TEXT}
                    name="Logo Slogan"
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
                                    value={link.value}
                                    onChange={data => setLinks(prev => {
                                        prev[index] = {
                                            href: prev[index].href,
                                            value: data,
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
                                            value: prev[index].value,
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

                <Button size="1" variant="ghost" onClick={() => setLinks([...links, { href: "#Edit-me!", value: "Edit me" }])}>
                    Create Link
                </Button>

            </Flex>
            {props.children}
            <Button onClick={() => onSave(links)}>Save</Button>
        </>
    )
};

export default HeaderBasicEditor