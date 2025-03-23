import React from "react"
import { SectionMapGoogleProps } from "../../Templates/Section/SectionMap/SectionMapGoogle"
import AddressEditor from "./AddressEditor"
import { Button, Flex, TextField, Text } from "@radix-ui/themes"

interface EditorProps {
    onSaveData: (props: SectionMapGoogleProps) => void
    onUploadFile: (file: File) => Promise<string>
    children: React.ReactNode
}

const SectionMapGoogleEditor: React.FC<SectionMapGoogleProps & EditorProps> = (props) => {
    const [state, setState] = React.useState(props)

    const onSave = () => {
        props.onSaveData({
            address: state.address,
            zoom: state.zoom
        })
    }

    return (
        <>
            <AddressEditor
                address={state.address}
                onChange={address => {
                    setState(prev => {
                        return {
                            ...prev,
                            address
                        }
                    })
                }}
            />

            <Flex align="center" gap="2" justify="between" mb="2">
                <Text as="div" size="1" mb="1" weight="bold">
                    Zoom
                </Text>
            </Flex>
            <TextField.Root
                type="number"
                size="2"
                variant="surface"
                value={state.zoom}
                onChange={e => {
                    setState(prev => {
                        return {
                            ...prev,
                            zoom: String(e.target.value)
                        }
                    })
                }}
            />

            <Flex gap="3" mt="4" justify="end">
                <Button onClick={onSave}>Save</Button>
            </Flex>
        </>
    )
}

export default SectionMapGoogleEditor
