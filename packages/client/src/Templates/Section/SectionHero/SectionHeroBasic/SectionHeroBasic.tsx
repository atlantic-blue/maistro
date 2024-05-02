import React from 'react';
import { faker } from '@faker-js/faker';
import { Box, Button, Flex, Heading, Section } from '@radix-ui/themes';

import { TemplateStruct, ContentCategory, TemplateComponentType } from "../../../templateTypes";

import { SectionHeroProps } from '../SectionHeroTypes';

import TemplateWysiwyg from '../../../Components/TemplateWysiwyg/TemplateWysiwyg';

import * as styles from "./SectionHeroBasic.scss";

const SectionHeroBasic: React.FC<SectionHeroProps> = (props) => {
    return (
        <Section
            data-hydration-id={props["data-hydration-id"]}
            className={styles.hero}
        >
            <Heading as="h1">
                {props.title}
            </Heading>

            <Flex className={styles.section}>
                <Box className={styles.imgFrame}>
                    <div className={styles.imgWrapper}>
                        <img
                            src={props.img.src}
                            alt={props.img.alt}
                            className={styles.img}
                        />
                    </div>
                </Box>

                <TemplateWysiwyg
                    content={props.content}
                    className={styles.text}
                />

            </Flex>


            <Button
                onClick={props.ctaOnClick}
                className={styles.button}
            >
                <a href={props.ctaLink} target="_blank" rel="noopener noreferrer">
                    {props.cta}
                </a>
            </Button>

        </Section>
    )
};


export const SectionHeroBasicItem: TemplateStruct = {
    name: TemplateComponentType.HERO_BASIC,
    description: "Hero Basic",
    categories: [ContentCategory.HERO, ContentCategory.TEXT],
    Component: SectionHeroBasic,
    classNames: [
        ...Object.values(styles)
    ],
    props: {
        title: "Landing Page.",
        content: "Discover our services and offerings.",
        cta: "Get Started",
        ctaLink: "#home",
        img: {
            src: faker.image.urlPicsumPhotos(),
            alt: "img",
        }
    }
}

export default SectionHeroBasic
