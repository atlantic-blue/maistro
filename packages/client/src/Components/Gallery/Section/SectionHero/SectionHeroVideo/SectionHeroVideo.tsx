import React from 'react';

import { ContentStruct, ContentCategory } from '../../../../../types';
import Button from '../../../Components/Button/Button';
import * as ButtonStyles from '../../../Components/Button/Button.scss';

import * as styles from "./SectionHeroVideo.scss"

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
        <section className={styles.hero}>
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
                <h1>{props.title}</h1>
                <div className={styles.text}>
                    {props.content}
                </div>

                <Button
                    onClick={props.buttonOnClick}
                    link={props.buttonLink}
                    children={props.buttonText}
                />

            </div>
        </section >
    );
};

export const SectionHeroVideoItem: ContentStruct<SectionHeroVideoProps> = {
    id: "SectionHeroVideo",
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
    }
}

export default SectionHeroVideo;
