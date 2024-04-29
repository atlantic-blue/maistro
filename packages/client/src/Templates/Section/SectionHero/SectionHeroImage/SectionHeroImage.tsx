import React from 'react';
import { faker } from '@faker-js/faker';

import { TemplateStruct, ContentCategory } from '../../../templateTypes';
import SectionHeroBasicEditor from '../SectionHeroBasic/SectionHeroBasicEditor';
import { Button, Flex, Heading, Section, Text, TextField } from '@radix-ui/themes';

import * as styles from "./SectionHeroImage.scss"

interface SectionHeroImageProps {
    title: string
    imageUrl: string
    content?: string
    cta: string
    ctaLink: string
    "data-hydration-id"?: string
}

interface EditorProps {
    fields: [{ name: string; value: string }]
}

const Editor: React.FC<EditorProps> = (props) => {
    const [state, setState] = React.useState(props.fields)

    state.map((field, index) => {
        return (
            <label>
                <Text as="div" size="2" mb="1" weight="bold">
                    {field.name}
                </Text>
                <TextField.Root
                    placeholder={field.value}
                    type="text"
                    size="2"
                    variant="surface"
                    value={field.value}
                    onChange={e => setState(prev => {
                        prev[index].value = e.target.value
                        return [
                            ...prev
                        ]
                    })}
                    required
                />
            </label>
        )
    })
}

const SectionHeroImage: React.FC<SectionHeroImageProps> = (props) => {
    return (
        <Section className={styles.hero} style={{ backgroundImage: `url(${props.imageUrl})` }} data-hydration-id={props["data-hydration-id"]}>
            <Flex className={styles.content} align="center" direction="column" justify="center">
                <Heading as="h1">{props.title}</Heading>
                <Text>{props.content}</Text>
                <Button>
                    {props.cta}
                </Button>
            </Flex>
        </Section>
    );
};

export const SectionHeroImageItem: TemplateStruct = {
    name: "SectionHeroImage",
    Component: SectionHeroImage,
    ComponentEditor: SectionHeroBasicEditor,
    classNames: [
        ...Object.values(styles)
    ],
    categories: [ContentCategory.HERO, ContentCategory.TEXT],
    description: "Hero Image",
    props: {
        title: "Captivating Experiences Await",
        content: "Join us on our journey.",
        imageUrl: faker.image.urlPicsumPhotos(),
        cta: "Discover More",
        ctaLink: "#home"
    }
}
export default SectionHeroImage;