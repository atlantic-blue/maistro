import React from 'react';
import { randImg, randSentence } from '@ngneat/falso';
import { Box, Button, Flex, Heading, Section } from '@radix-ui/themes';

import { TemplateStruct, TemplateCategory, TemplateComponentType } from "../../../templateTypes";

import { SectionHeroProps } from '../SectionHeroTypes';

import TemplateWysiwyg from '../../../Components/TemplateWysiwyg/TemplateWysiwyg';

import * as styles from "./SectionHeroBasic.scss";
import * as animationStyles from "../../../Styles/animation.scss"
import classNames from 'classnames';

const SectionHeroBasic: React.FC<SectionHeroProps> = (props) => {
    return (
        <Section
            data-hydration-id={props["data-hydration-id"]}
            className={styles.hero}
        >
            <Heading
                as="h1"
                size="9"
                className={classNames(styles.heroTitle, animationStyles.fadeIn)}
            >
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
                <a aria-label={props.cta} href={props.ctaLink} target="_blank" rel="noopener noreferrer">
                    {props.cta}
                </a>
            </Button>

        </Section>
    )
};


export const SectionHeroBasicItem: TemplateStruct<SectionHeroProps> = {
    name: TemplateComponentType.HERO_BASIC,
    description: "Hero Basic",
    categories: [TemplateCategory.HERO],
    Component: SectionHeroBasic,
    classNames: [
        ...Object.values(styles),
        ...Object.values(animationStyles)
    ],
    props: {
        title: "Landing Page.",
        content: "Discover our services and offerings.",
        cta: "Get Started",
        ctaLink: "#home",
        img: {
            src: randImg(),
            alt: randSentence(),
        }
    }
}

export default SectionHeroBasic
