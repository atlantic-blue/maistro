import React from "react";
import { Button, Flex, TextField, Text, TextArea } from "@radix-ui/themes";

import { SectionHeroProps } from "../SectionHeroTypes";

interface EditorProps {
    onSaveData: (props: Object) => void
    children: React.ReactNode
}

const SectionHeroBasicEditor: React.FC<SectionHeroProps & EditorProps> = (props) => {
    const [title, setTitle] = React.useState(props.title)
    const [content, setContent] = React.useState(props.content)
    const [cta, setCta] = React.useState(props.cta)
    const [ctaLink, setCtaLink] = React.useState(props.ctaLink)
    const [imgSrc, setImgSrc] = React.useState(props.img.src)

    const onSave = () => {
        props.onSaveData({
            title,
            content,
            cta,
            ctaLink,
            imgSrc
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
                        Content text
                    </Text>
                    <TextArea
                        placeholder={props.content}

                        size="2"
                        variant="surface"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        required
                    />
                </label>

                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Image
                    </Text>
                    <TextField.Root
                        placeholder={props.img.src}

                        type="text"
                        size="2"
                        variant="surface"
                        value={imgSrc}
                        onChange={e => setImgSrc(e.target.value)}
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
                        Call to Action Button Link
                    </Text>
                    <TextField.Root
                        placeholder={props.ctaLink}

                        type="text"
                        size="2"
                        variant="surface"
                        value={ctaLink}
                        onChange={e => setCtaLink(e.target.value)}
                        required
                    />
                </label>
            </Flex>
            {props.children}
            <Button onClick={onSave}>Save</Button>
        </>
    )
};

export default SectionHeroBasicEditor
