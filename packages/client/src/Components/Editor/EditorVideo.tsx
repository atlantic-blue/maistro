import React from "react";
import { Box, Flex, Tabs, Text, TextField } from "@radix-ui/themes";

import { EditorVideoProps } from "./EditorData";

const EditorVideo: React.FC<EditorVideoProps> = (props) => {
    const [preview, setPreview] = React.useState(props.value);

    return (
        <Tabs.Root defaultValue="url">
            <Flex justify="center" align="center" direction="column" width="100%">
                <Text as="div" size="2" mb="1" weight="bold">
                    {props.name}
                </Text>
                <video
                    style={{ width: "400px" }}
                    playsInline
                    autoPlay
                    muted
                    loop
                >
                    <source src={preview} type="video/mp4" />
                </video>

                <Tabs.List>
                    <Tabs.Trigger value="url">URL</Tabs.Trigger>
                </Tabs.List>

                <Box pt="3" width="100%">
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

export default EditorVideo
