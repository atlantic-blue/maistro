import React from 'react';
import { faker } from '@faker-js/faker';

import * as styles from "./SectionHeroImage.scss"
import { TemplateStruct, ContentCategory } from '../../../../../types';
import SectionHeroBasicEditor from '../SectionHeroBasic/SectionHeroBasicEditor';

interface SectionHeroImageProps {
    imageUrl: string
}

const SectionHeroImage: React.FC<SectionHeroImageProps> = (props) => {
    return (
        <section className={styles.hero} style={{ backgroundImage: `url(${props.imageUrl})` }}>
            <div className={styles.content}>
                <h1>Captivating Experiences Await</h1>
                <p>Join us on our journey.</p>
                <button>Discover More</button>
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
        imageUrl: faker.image.urlPicsumPhotos()
    }
}
export default SectionHeroImage;