import React from 'react';
import { faker } from '@faker-js/faker';

import { TemplateStruct, ContentCategory } from "../../../templateTypes";

import { SectionHeroProps } from '../SectionHeroTypes';

import Button from '../../../Components/Button/Button';

import SectionHeroBasicEditor from './SectionHeroBasicEditor';

import * as styles from "./SectionHeroBasic.scss";

const SectionHeroBasic: React.FC<SectionHeroProps> = (props) => {
    return (
        <section className={styles.hero} data-hydration-id={props["data-hydration-id"]}>
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
                <div className={styles.text}>
                    {props.content}
                </div>
            </div>


            <Button
                onClick={props.ctaOnClick}
                className={styles.button}
                link={props.ctaLink}
            >
                {props.cta}
            </Button>

        </section>
    )
};


export const SectionHeroBasicItem: TemplateStruct = {
    name: "SectionHeroBasic",
    description: "Hero Basic",
    categories: [ContentCategory.HERO, ContentCategory.TEXT],
    Component: SectionHeroBasic,
    ComponentEditor: SectionHeroBasicEditor,
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
