import React from 'react';

import { ContentStruct, ContentCategory } from '../../../../../types';

import * as styles from "./SectionAboutUsSimple.scss";

const SectionAboutUsSimple = () => {
    return (
        <div className={styles.aboutUs}>
            <h2>About Us</h2>
            <p>We are a team of passionate individuals dedicated to providing innovative solutions.</p>
        </div>
    );
};

export const SectionAboutUsSimpleItem: ContentStruct = {
    id: "SectionAboutUsSimple",
    Component: SectionAboutUsSimple,
    categories: [ContentCategory.TEXT, ContentCategory.ABOUT],
    description: "",
    classNames: [
        ...Object.values(styles)
    ],
}

export default SectionAboutUsSimple;
