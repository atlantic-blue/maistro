import React from 'react';
import { faker } from '@faker-js/faker';
import { Button, Flex, Heading, Section, Text } from '@radix-ui/themes';

import { TemplateStruct, ContentCategory, TemplateComponentType } from '../../../templateTypes';

import { SectionHeroProps } from '../SectionHeroTypes';

import * as styles from "./SectionHeroImage.scss"
import TemplateWysiwyg from '../../../Components/TemplateWysiwyg/TemplateWysiwyg';

const SectionHeroImage: React.FC<SectionHeroProps> = (props) => {
    return (
        <Section
            data-hydration-id={props["data-hydration-id"]}
            className={styles.hero}
            style={{ backgroundImage: `url(${props?.img?.src})` }}
        >
            <div className={styles.heroWrapper}>
                <div className={styles.heroImageFilter} />
                <Flex className={styles.heroContent} align="center" direction="column" justify="center" gap="3">
                    <Heading as="h1" size="9" className={styles.heroTitle}>{props.title}</Heading>
                    <TemplateWysiwyg
                        content={props.content}
                        className={styles.heroText}
                    />
                    <Button
                        size="4"
                        className={styles.heroButton}
                    >
                        {props.cta}
                    </Button>
                </Flex>
            </div>
        </Section>
    );
};

export const SectionHeroImageItem: TemplateStruct = {
    name: TemplateComponentType.HERO_IMAGE,
    Component: SectionHeroImage,
    classNames: [
        ...Object.values(styles)
    ],
    categories: [ContentCategory.HERO, ContentCategory.TEXT],
    description: "Hero Image",
    props: {
        title: "Captivating Experiences Await",
        content: "Join us on our journey.",
        img: {
            src: faker.image.urlPicsumPhotos(),
            alt: "",
        },
        cta: "Discover More",
        ctaLink: "#home"
    }
}

export default SectionHeroImage;