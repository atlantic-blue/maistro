import React from 'react';

import * as styles from './SectionContactWithMap.scss';
import { ContentStruct, ContentCategory } from '../../../../../types';

const SectionContactWithMap = () => (
    <div className={styles.container}>
        <div className={styles.formContainer}>
            <h2>Visit Us</h2>
            <form>
                <input type="text" placeholder="Your Name" />
                <input type="email" placeholder="Your Email" />
                <textarea placeholder="Your Message"></textarea>
                <button type="submit">Send Message</button>
            </form>
        </div>
        <div className={styles.mapContainer}>
            {/* TODO Embed your map or use an image placeholder */}
            <img src="path/to/map/image.jpg" alt="Our location" />
        </div>
    </div>
);

export const SectionContactWithMapItem: ContentStruct = {
    id: "section-contact-with-map",
    description: "Contact form with an embedded map for easy location reference.",
    Component: SectionContactWithMap,
    categories: [ContentCategory.CONTACT],
};

export default SectionContactWithMap;