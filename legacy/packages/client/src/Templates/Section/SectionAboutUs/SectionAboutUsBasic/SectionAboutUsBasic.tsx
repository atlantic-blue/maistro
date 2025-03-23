import React from 'react';
import { Heading, Section } from '@radix-ui/themes';

import { TemplateStruct, TemplateCategory, TemplateComponentType } from '../../../templateTypes';
import TemplateWysiwyg from '../../../Components/TemplateWysiwyg/TemplateWysiwyg';
import { SectionAboutUsProps } from '../SectionAboutUsTypes';

import * as styles from "./SectionAboutUsBasic.scss";

const SectionAboutUsBasic: React.FC<SectionAboutUsProps> = (props) => {
    return (
        <Section
            className={styles.aboutUs}
            data-hydration-id={props["data-hydration-id"]}
        >
            <Heading
                as="h2"
                size="8"
            >
                {props.title}
            </Heading>
            <TemplateWysiwyg
                className={styles.aboutUsContent}
                content={props.content}
            />
        </Section>
    );
};

export const SectionAboutUsBasicItem: TemplateStruct<SectionAboutUsProps> = {
    name: TemplateComponentType.ABOUT_US_BASIC,
    Component: SectionAboutUsBasic,
    categories: [TemplateCategory.ABOUT],
    description: "About us basic",
    classNames: [
        ...Object.values(styles)
    ],
    props: {
        title: "About Us",
        content: "We are a team of passionate individuals dedicated to providing innovative solutions."
    },
}

export default SectionAboutUsBasic;
