import React from 'react';
import { faker } from '@faker-js/faker';

import * as styles from "./SectionHeroImage.scss"
import { TemplateStruct, ContentCategory } from '../../../../../types';
import SectionHeroBasicEditor from '../SectionHeroBasic/SectionHeroBasicEditor';

interface SectionHeroImageProps {
    title: string
    imageUrl: string
    content?: string
    cta: string
    ctaLink: string
}

const SectionHeroImage: React.FC<SectionHeroImageProps> = (props) => {
    return (
        <section className={styles.hero} style={{ backgroundImage: `url(${props.imageUrl})` }}>
            <div className={styles.content}>
                <h1>{props.title}</h1>
                <p>{props.content}</p>
                <button>
                    {props.cta}
                </button>
            </div>
        </section>
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
    description: "Offers a visually striking first impression with a full-width background image, suitable for storytelling or branding.",
    props: {
        title: "Captivating Experiences Await",
        content: "Join us on our journey.",
        imageUrl: faker.image.urlPicsumPhotos(),
        cta: "Discover More",
        ctaLink: "#home"
    }
}
export default SectionHeroImage;