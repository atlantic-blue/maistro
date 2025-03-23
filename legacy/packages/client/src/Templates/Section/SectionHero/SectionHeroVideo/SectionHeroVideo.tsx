import React from 'react';
import { Flex, Heading, Section } from '@radix-ui/themes';

import { TemplateStruct, TemplateCategory, TemplateComponentType } from '../../../templateTypes';
import Button from '../../../Components/Button/Button';
import TemplateWysiwyg from '../../../Components/TemplateWysiwyg/TemplateWysiwyg';

import * as styles from "./SectionHeroVideo.scss"
import * as ButtonStyles from '../../../Components/Button/Button.scss';

export interface SectionHeroVideoProps {
    "data-hydration-id"?: string
    title: string
    video: {
        src: string
        alt: string
    }
    content: string | React.ReactNode
    cta?: string
    ctaLink?: string
    ctaOnClick?: () => void
}

const SectionHeroVideo: React.FC<SectionHeroVideoProps> = (props) => {
    return (
        <Section
            data-hydration-id={props["data-hydration-id"]}
            className={styles.hero}
        >
            <video
                className={styles.video}
                playsInline
                autoPlay
                muted
                loop
            >
                <source src={props.video?.src} type="video/mp4" />
            </video>
            <Flex className={styles.content} align="center" direction="column" justify="center" gap="3">
                {props.title && <Heading
                    as="h1"
                    align="center"
                    wrap="pretty"
                    size="9"
                    className={styles.heroTitle}
                >
                    {props.title}
                </Heading>}

                <TemplateWysiwyg
                    content={props.content}
                    className={styles.heroText}
                />

                {props.cta && <Button
                    size="4"
                    onClick={props.ctaOnClick}
                    className={styles.heroButton}
                >
                    {props.ctaLink ?
                        (
                            <a aria-label={props.cta} href={props.ctaLink} target="_blank" rel="noopener noreferrer">
                                {props.cta}
                            </a>
                        ) : props.cta
                    }
                </Button>}

            </Flex>
        </Section>
    );
};

export const SectionHeroVideoItem: TemplateStruct<SectionHeroVideoProps> = {
    name: TemplateComponentType.HERO_VIDEO,
    Component: SectionHeroVideo,
    categories: [TemplateCategory.HERO],
    description: "Hero Video",
    classNames: [
        ...Object.values(styles),
        ...Object.values(ButtonStyles),
    ],
    props: {
        video: {
            src: "https://maistro.website/assets/hero-video.mp4",
            alt: "Main hero video"
        },
        title: "Immerse Yourself in Our World",
        content: "Experience the difference with us.",
        ctaLink: "#home",
        cta: "Get Started",
    },
}

export default SectionHeroVideo;
