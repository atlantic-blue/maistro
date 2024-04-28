import React from "react";
import { Button, Flex, TextField, Text, TextArea } from "@radix-ui/themes";

import { SectionSubscribeBasicProps } from "./SectionSubscribeBasic";

interface EditorProps {
    onSaveData: (props: Partial<SectionSubscribeBasicProps>) => void
    children: React.ReactNode
}

const SectionSubscribeBasicEditor: React.FC<SectionSubscribeBasicProps & EditorProps> = (props) => {
    const [title, setTitle] = React.useState(props.title)
    const [cta, setCta] = React.useState(props.cta)
    const [redirect, setRedirect] = React.useState(props.redirect)

    const onSave = () => {
        props.onSaveData({
            title,
            redirect,
            cta,
        })
    }

    return (
        <>
            <Flex direction="column" gap="3">
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Title text
                    </Text>
                    <TextField.Root
                        placeholder={props.title}
                        type="text"
                        size="2"
                        variant="surface"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </label>


                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Call to Action Button
                    </Text>
                    <TextField.Root
                        placeholder={props.cta}

                        type="text"
                        size="2"
                        variant="surface"
                        value={cta}
                        onChange={e => setCta(e.target.value)}
                        required
                    />
                </label>

                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Redirect To
                    </Text>
                    <TextField.Root
                        placeholder={props.redirect}

                        type="text"
                        size="2"
                        variant="surface"
                        value={redirect}
                        onChange={e => setRedirect(e.target.value)}
                        required
                    />
                </label>
            </Flex>
            {props.children}
            <Button onClick={onSave}>Save</Button>
        </>
    )
};

export default SectionSubscribeBasicEditor
