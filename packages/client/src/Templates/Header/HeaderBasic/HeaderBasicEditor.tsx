import React from "react"

import { HeaderBurgerLink, HeaderProps } from "../HeaderTypes"

import { Box, Button, Card, Flex, Text, TextArea, TextField } from "@radix-ui/themes"

interface EditorProps {
    onSaveData: (props: HeaderProps) => void
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
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Logo Url
                    </Text>
                    <TextField.Root
                        placeholder={props.logo.url}
                        type="text"
                        size="2"
                        variant="surface"
                        value={logoUrl}
                        onChange={e => setLogoUrl(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Logo Slogan
                    </Text>
                    <TextArea
                        placeholder={props.logo.slogan}

                        size="2"
                        variant="surface"
                        value={logoSlogan}
                        onChange={e => setLogoSlogan(e.target.value)}
                        required
                    />
                </label>

                {
                    links.map((link, index) => {
                        return (
                            <Card key={index}>
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">
                                        Link Text
                                    </Text>
                                    <TextField.Root
                                        type="text"
                                        placeholder={link.value}
                                        size="2"
                                        variant="surface"
                                        value={link.value}
                                        onChange={e => setLinks(prev => {
                                            prev[index] = {
                                                href: prev[index].href,
                                                value: e.target.value,
                                            }
                                            return [
                                                ...prev
                                            ]
                                        })}
                                        required
                                    />
                                </label>
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">
                                        Link
                                    </Text>
                                    <TextField.Root
                                        type="text"
                                        placeholder={link.href}
                                        size="2"
                                        variant="surface"
                                        value={link.href}
                                        onChange={e => setLinks(prev => {
                                            prev[index] = {
                                                value: prev[index].value,
                                                href: e.target.value,
                                            }
                                            return [
                                                ...prev
                                            ]
                                        })}
                                        required
                                    />
                                </label>
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