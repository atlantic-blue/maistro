import React from 'react';

import { ContentStruct, ContentCategory } from '../../../../../types';

import * as styles from './SectionContactBasic.scss';

const SectionContactBasic = () => (
    <div className={styles.container}>
        <h2>Contact Us</h2>
        <form className={styles.contactForm}>
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <textarea placeholder="Your Message"></textarea>
            <button type="submit">Send Message</button>
        </form>
    </div>
);

export const SectionContactBasicItem: ContentStruct = {
    id: "SectionContactBasic",
    description: "A basic contact form for user inquiries.",
    Component: SectionContactBasic,
    categories: [ContentCategory.CONTACT],
    classNames: [
        ...Object.values(styles)
    ],
};

export default SectionContactBasic;
