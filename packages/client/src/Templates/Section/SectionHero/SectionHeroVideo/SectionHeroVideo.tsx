import React from 'react';

import { TemplateStruct, ContentCategory } from '../../../templateTypes';
import Button from '../../../Components/Button/Button';
import * as ButtonStyles from '../../../Components/Button/Button.scss';

import * as styles from "./SectionHeroVideo.scss"
import { Heading, Text } from '@radix-ui/themes';

interface SectionHeroVideoProps {
    videoURL: string
    title: string
    content: string | React.ReactNode
    buttonLink?: string
    buttonText: string
    buttonOnClick?: () => void
}

const SectionHeroVideo: React.FC<SectionHeroVideoProps> = (props) => {
    return (
        <section className={styles.hero} {...props}>
            <video
                className={styles.video}
                playsInline
                autoPlay
                muted
                loop
            >
                <source src={props.videoURL} type="video/mp4" />
            </video>
            <div className={styles.content}>
                <Heading
                    as="h1"
                    align="center"
                    wrap="pretty"
                    size="9"
                >
                    {props.title}
                </Heading>

                <Text
                    as="div"
                    className={styles.text}
                >
                    {props.content}
                </Text>

                <Button
                    size="4"
                    onClick={props.buttonOnClick}
                    link={props.buttonLink}
                    children={props.buttonText}
                />

            </div>
        </section >
    );
};

export const SectionHeroVideoItem: TemplateStruct = {
    name: "SectionHeroVideo",
    Component: SectionHeroVideo,
    categories: [ContentCategory.HERO, ContentCategory.TEXT],
    description: "Creates an engaging and immersive experience with a background video, ideal for dynamic content presentation.",
    classNames: [
        ...Object.values(styles),
        ...Object.values(ButtonStyles),
    ],
    props: {
        videoURL: "https://maistro.website/assets/hero-video.mp4",
        title: "Immerse Yourself in Our World",
        content: "Experience the difference with us.",
        buttonLink: "#home",
        buttonText: "Get Started",
    },
    ComponentEditor: () => null,
}

export default SectionHeroVideo;
