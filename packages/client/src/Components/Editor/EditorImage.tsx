import React from "react";
import { Button, Flex, Spinner, Text } from "@radix-ui/themes";

import { EditorImageProps } from "./EditorData";

const EditorImage: React.FC<EditorImageProps> = (props) => {
    const [preview, setPreview] = React.useState(props.value);
    const [isLoading, setLoading] = React.useState(false)

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        if (!event.target.files || !event.target.files[0]) {
            return
        }
        setLoading(true)
        const file = event.target.files[0]
        const src = await props.onUploadImage(file)

        setPreview(src);
        props.onChange(src)
        setLoading(false)
    };

    return (
        <Text as="label">
            <Flex justify="center" align="center" direction="column">
                <Text as="div" size="2" mb="1" weight="bold">
                    {props.name}
                </Text>
                {preview && <img src={preview} alt="Preview" style={{ maxWidth: '96px' }} />}

                {!isLoading && <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ maxWidth: '96px' }}
                />}
                {isLoading && <Spinner />}
            </Flex>
        </Text>
    )
}

export default EditorImage
