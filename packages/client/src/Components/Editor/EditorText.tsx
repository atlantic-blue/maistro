import React from "react";
import { TextField, Text } from "@radix-ui/themes";
import { EditorDataProps } from "./EditorData";

const EditorText: React.FC<EditorDataProps> = (props) => {
    return (
        <label>
            <Text as="div" size="2" mb="1" weight="bold">
                {props.name}
            </Text>
            <TextField.Root
                placeholder={props.value}
                type="text"
                size="2"
                variant="surface"
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
                required
            />
        </label>
    )
}

export default EditorText