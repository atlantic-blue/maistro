import React from 'react';
import { faker } from '@faker-js/faker';

import { ContentStruct, ContentCategory } from "../../../../../types";

import { SectionHeroProps } from '../SectionHeroTypes';

import Button from '../../../Components/Button/Button';

import * as styles from "./SectionHeroBasic.scss";

const SectionHeroBasic: React.FC<SectionHeroProps> = (props) => {
    return (
        <section className={styles.hero}>
            <h1>
                {props.title}
            </h1>

            <div className={styles.section}>
                <div className={styles.imgFrame}>
                    <div className={styles.imgWrapper}>
                        <img
                            src={props.img.src}
                            alt={props.img.alt}
                            className={styles.img}
                        />
                    </div>
                </div>
                <p className={styles.text}>
                    {props.content}
                </p>
            </div>


            <Button
                link={props.ctaLink}
                text={props.cta}
            />

        </section>
    )
};


export const SectionHeroBasicItem: ContentStruct<SectionHeroProps> = {
    id: "SectionHeroBasic",
    description: "A clean and straightforward hero component, focusing on core messaging with a clear call to action",
    categories: [ContentCategory.HERO, ContentCategory.TEXT],
    Component: SectionHeroBasic,
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
