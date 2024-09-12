import React from 'react';

import { TemplateStruct, TemplateCategory, TemplateComponentType } from '../../../templateTypes';

import * as styles from './SectionSubscribeBasic.scss';
import SectionSubscribeBasicEditor from './SectionSubscribeBasicEditor';
import { Button, Flex, Heading, Section, Text, TextField } from '@radix-ui/themes';

export interface SectionSubscribeBasicProps {
    title: string
    url: string
    redirect: string
    cta: string
    emailListId: string
    "data-hydration-id"?: string
}

const SectionSubscribeBasic: React.FC<SectionSubscribeBasicProps> = (props) => (
    <Section className={styles.container} data-hydration-id={props["data-hydration-id"]}>
        <Heading as="h2">{props.title}</Heading>
        <form
            action={props.url}
            method="POST"
            onSubmit={() => window.location.href = '/success.html'}
        >
            <Flex direction="column" gap="3" mb="1">
                <Text as="label" htmlFor="name" size="2" weight="bold">
                    Name
                </Text>
                <TextField.Root
                    id="name"
                    name="name"
                    placeholder="Emilia Tellez"
                    type="text"
                    size="2"
                    variant="surface"
                    required
                />
            </Flex>
            <Flex direction="column" gap="3" mb="1">
                <Text as="label" htmlFor="email" size="2" weight="bold">
                    Email
                </Text>
                <TextField.Root
                    id="email"
                    name="email"
                    placeholder="emilia@gmail.com"
                    type="email"
                    size="2"
                    variant="surface"
                    required
                />
            </Flex>
            <input type="hidden" name="emailListId" value={props.emailListId} />
            <input type="hidden" name="redirectTo" value={props.redirect} />
            <Flex direction="column" gap="3" mt="4">
                <Button type="submit">{props.cta}</Button>
            </Flex>
        </form>
    </Section>
);

export const SectionSubscribeBasicItem: TemplateStruct = {
    name: TemplateComponentType.SUBSCRIBE_BASIC,
    description: "A basic contact form for user inquiries.",
    Component: SectionSubscribeBasic,
    categories: [TemplateCategory.SUBSCRIBE],
    props: {
        url: "",
        emailListId: "00000000-0000-0000-0000-00000000",
        title: "Subscribe Today!",
        redirect: "/success",
        cta: "Subscribe",
    },
    classNames: [
        ...Object.values(styles)
    ],
};

export default SectionSubscribeBasic;
