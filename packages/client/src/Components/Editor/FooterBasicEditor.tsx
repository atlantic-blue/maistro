import React from "react"
import { Button, Flex } from "@radix-ui/themes"

import EditorData, { EditorDataType } from "../../Components/Editor/EditorData"
import { FooterBasicProps } from "../../Templates/Footer/FooterTypes"

interface EditorProps {
    onSaveData: (props: FooterBasicProps) => void
    onUploadFile: (file: File) => Promise<string>
    children: React.ReactNode
}

const FooterBasicEditor: React.FC<FooterBasicProps & EditorProps> = (props) => {
    const [name, setName] = React.useState(props.name)
    const [links, setLinks] = React.useState(props.links || [])
    const [mediaLinks, setMediaLinks] = React.useState(props.mediaLinks || [])

    const onSave = () => {
        props.onSaveData({
            links,
            mediaLinks,
            name,
        })
    }

    return (
        <>
            <Flex direction="column" gap="3">
                <EditorData
                    type={EditorDataType.TEXT}
                    name="Name"
                    value={name}
                    onChange={setName}
                />
                <EditorData
                    type={EditorDataType.LINKS}
                    links={links}
                    onChange={setLinks}
                    onUploadFile={props.onUploadFile}
                />
                <EditorData
                    type={EditorDataType.LINKS}
                    links={mediaLinks}
                    onChange={setMediaLinks}
                    onUploadFile={props.onUploadFile}
                />
            </Flex>

            <Flex gap="3" mt="4" justify="end">
                <Button onClick={() => onSave()}>Save</Button>
            </Flex>
        </>
    )
};

export default FooterBasicEditor