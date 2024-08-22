import React from "react"

import { Button, Card, Flex, Text } from "@radix-ui/themes"
import { Address } from "../../Templates/Section/SectionMap/SectionMapGoogle"
import EditorData, { EditorDataType } from "./EditorData"

const AddressEditor: React.FC<{
    address?: Address
    onChange: (a: Address) => void
}> = (props) => {
    const [address, setAddress] = React.useState<Address>(props.address || {
        firstLine: "",
        postcode: "",
        country: "",
        city: "",
    })

    const onSave = () => {
        props.onChange(address)
    }

    return (
        <Card m="1">
            <Text as="div" size="1" weight="bold" mb="2">
                Address
            </Text>
            <Flex direction="column" gap="2">
                <EditorData
                    type={EditorDataType.TEXT}
                    name="First Line"
                    value={address?.firstLine}
                    onChange={data => {
                        setAddress(prev => {
                            return {
                                ...prev,
                                firstLine: data
                            }
                        })
                    }}
                />

                <EditorData
                    type={EditorDataType.TEXT}
                    name="City"
                    value={address?.city}
                    onChange={data => {
                        setAddress(prev => {
                            return {
                                ...prev,
                                city: data
                            }
                        })
                    }}
                />

                <EditorData
                    type={EditorDataType.TEXT}
                    name="Country"
                    value={address?.country}
                    onChange={data => {
                        setAddress(prev => {
                            return {
                                ...prev,
                                country: data
                            }
                        })
                    }}
                />

                <EditorData
                    type={EditorDataType.TEXT}
                    name="Postcode"
                    value={address?.postcode}
                    onChange={data => {
                        setAddress(prev => {
                            return {
                                ...prev,
                                postcode: data
                            }
                        })
                    }}
                />
            </Flex>

            <Button onClick={onSave}>
                Save
            </Button>
        </Card>
    )
}

export default AddressEditor
