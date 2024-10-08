import React, { useState, useEffect } from 'react';
import { randImg, randSentence, randWord } from '@ngneat/falso';
import { Button, Flex, Heading, Section } from '@radix-ui/themes';

import { TemplateStruct, TemplateCategory, TemplateComponentType } from '../../../templateTypes';

import TemplateWysiwyg from '../../../Components/TemplateWysiwyg/TemplateWysiwyg';
import { SectionHeroProps } from '../SectionHeroTypes';

import * as styles from "./SectionHeroSlides.scss"

export interface SectionHeroSlidesProps {
    "data-hydration-id"?: string
    slides: SectionHeroProps[]
    transition?: number
}

const SectionHeroSlides: React.FC<SectionHeroSlidesProps> = (props) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentSlide((currentSlide + 1) % props.slides.length);
        }, props.transition || 5000);

        return () => clearTimeout(timer);
    }, [currentSlide]);

    return (
        <Section
            data-hydration-id={props["data-hydration-id"]}
            className={styles.hero}
        >
            {
                props.slides.map((slide, index) => (
                    <div
                        key={`SectionHeroSlides-${slide.title.replace(" ", "")}`}
                        className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
                        style={{ backgroundImage: `url(${slide.img?.src})` }}
                    >
                        {index === currentSlide && (
                            <>
                                <div className={styles.heroImageFilter} />
                                <Flex className={styles.heroContent} align="center" direction="column" justify="center" gap="3">
                                    <Heading
                                        as="h1"
                                        size="9"
                                        className={styles.heroTitle}
                                    >
                                        {slide.title}
                                    </Heading>
                                    <TemplateWysiwyg
                                        content={slide.content}
                                        className={styles.heroText}
                                    />
                                    <Button
                                        className={styles.heroButton}
                                        onClick={slide.ctaOnClick}
                                        size="4"
                                    >
                                        <a aria-label={slide.cta} href={slide.ctaLink} target="_blank" rel="noopener noreferrer">
                                            {slide.cta}
                                        </a>
                                    </Button>
                                </Flex>
                            </>
                        )}
                    </div>
                ))
            }
        </Section >
    );
};

export const SectionHeroSlidesItem: TemplateStruct<SectionHeroSlidesProps> = {
    name: TemplateComponentType.HERO_SLIDES,
    Component: SectionHeroSlides,
    categories: [TemplateCategory.HERO],
    description: "Hero Slides",
    classNames: [
        ...Object.values(styles)
    ],
    props: {
        slides: [
            {
                title: randWord({ length: 3 }).join(" "),
                content: randWord({ length: 10 }).join(" "),
                img: {
                    src: randImg(),
                    alt: randWord({ length: 3 }).join(" "),
                },
                cta: randWord({ length: 3 }).join(" "),
                ctaLink: "/about",
            },
            {
                title: randWord({ length: 3 }).join(" "),
                content: randWord({ length: 10 }).join(" "),
                img: {
                    src: randImg(),
                    alt: randWord({ length: 3 }).join(" "),
                },
                cta: randWord({ length: 3 }).join(" "),
                ctaLink: "/contact",
            },
            {
                title: randWord({ length: 3 }).join(" "),
                content: randWord({ length: 10 }).join(" "),
                img: {
                    src: randImg(),
                    alt: randWord({ length: 3 }).join(" "),
                },
                cta: randWord({ length: 3 }).join(" "),
                ctaLink: "/services",
            },
            {
                title: randWord({ length: 3 }).join(" "),
                content: randWord({ length: 10 }).join(" "),
                img: {
                    src: randImg(),
                    alt: randWord({ length: 3 }).join(" "),
                },
                cta: randWord({ length: 3 }).join(" "),
                ctaLink: "/home",
            },
        ]
    },
}

export default SectionHeroSlides;