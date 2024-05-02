import React from "react";
import { Avatar, Box, Button, Flex, Spinner, Tabs, Text, TextField } from "@radix-ui/themes";

import * as styles from "./EditorImage.scss"

import { EditorImageProps } from "./EditorData";
import IconUpLoad from "../Icons/Upload/Upload";

const EditorImage: React.FC<EditorImageProps> = (props) => {
    const [preview, setPreview] = React.useState(props.value);
    const [isLoading, setLoading] = React.useState(false)
    const uploadId = `${props.name}-${Date.now()}`

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        if (!event.target.files || !event.target.files[0]) {
            return
        }
        setLoading(true)
        const file = event.target.files[0]
        const src = await props.onUploadFile(file)

        setPreview(src);
        props.onChange(src)
        setLoading(false)
    };

    return (
        <Tabs.Root defaultValue="upload">
            <Flex justify="center" align="center" direction="column" width="100%">
                <Text as="div" size="2" mb="1" weight="bold">
                    {props.name}
                </Text>
                <Avatar
                    src={preview}
                    fallback="Preview"
                    size="9"
                />

                <Tabs.List>
                    <Tabs.Trigger value="upload">Upload</Tabs.Trigger>
                    <Tabs.Trigger value="url">URL</Tabs.Trigger>
                </Tabs.List>

                <Box pt="3" width="100%">
                    <Tabs.Content value="upload">

                        {!isLoading && (
                            <>
                                <label htmlFor={uploadId} className={styles.uploadLabel}>
                                    <span>
                                        <IconUpLoad className={styles.uploadIcon} />
                                    </span>
                                    <span>Upload</span>
                                    <input
                                        id={uploadId}
                                        type="file"
                                        accept="image/*"
                                        className={styles.uploadInput}
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </>
                        )}

                        {isLoading && (
                            <Flex justify="center" align="center" direction="column" width="100%">
                                <Spinner />
                            </Flex>
                        )}

                    </Tabs.Content>

                    <Tabs.Content value="url">
                        <TextField.Root
                            placeholder={props.value}
                            type="text"
                            size="2"
                            variant="surface"
                            value={props.value}
                            onChange={e => {
                                const src = e.target.value;
                                setPreview(src);
                                props.onChange(src);
                            }}
                            required
                        />
                    </Tabs.Content>

                </Box>
            </Flex>
        </Tabs.Root>
    )
}

export default EditorImage
