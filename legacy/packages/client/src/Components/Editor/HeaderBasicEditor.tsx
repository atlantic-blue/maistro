import React from "react"
import { Button, Flex } from "@radix-ui/themes"

import EditorData, { EditorDataType } from "./EditorData"
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
                    section="headline"
                    aiEnabled
                    value={logoSlogan}
                    onChange={setLogoSlogan}
                />

                <EditorData
                    type={EditorDataType.LINKS}
                    links={links}
                    onChange={setLinks}
                    onUploadFile={props.onUploadFile}
                />

            </Flex>
            {props.children}

            <Flex gap="3" mt="4" justify="end">
                <Button onClick={() => onSave()}>Save</Button>
            </Flex>
        </>
    )
};

export default HeaderBasicEditor