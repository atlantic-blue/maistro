import React, { useState, useEffect } from 'react';
import { renderToString } from 'react-dom/server';

import { faker } from '@faker-js/faker';

import { ContentStruct, ContentCategory } from '../../../../../types';

import * as styles from "./SectionHeroSlides.scss"

const slides = [
    { id: 1, title: faker.lorem.words(5), description: faker.lorem.sentence(), imageUrl: faker.image.urlPicsumPhotos() },
    { id: 2, title: faker.lorem.words(5), description: faker.lorem.sentence(), imageUrl: faker.image.urlPicsumPhotos() },
    { id: 3, title: faker.lorem.words(5), description: faker.lorem.sentence(), imageUrl: faker.image.urlPicsumPhotos() },
    { id: 4, title: faker.lorem.words(5), description: faker.lorem.sentence(), imageUrl: faker.image.urlPicsumPhotos() },
];

const SectionHeroSlides = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentSlide((currentSlide + 1) % slides.length);
        }, 3000);

        return () => clearTimeout(timer);
    }, [currentSlide]);

    return (
        <section className={styles.hero}>
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
                    style={{ backgroundImage: `url(${slide.imageUrl})` }}
                >
                    {index === currentSlide && (
                        <div className={styles.content}>
                            <h1>{slide.title}</h1>
                            <p>{slide.description}</p>
                            <button>View More</button>
                        </div>
                    )}
                </div>
            ))}
        </section>
    );
};

export const SectionHeroSlidesItem: ContentStruct = {
    id: "SectionHeroSlides",
    Component: SectionHeroSlides,
    categories: [ContentCategory.HERO, ContentCategory.TEXT],
    description: "Showcases multiple items or messages through a transitioning slideshow, perfect for highlighting various aspects of a service or product.",
    classNames: Object.values(styles),
}

export default SectionHeroSlides;