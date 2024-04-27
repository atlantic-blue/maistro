import React from 'react';

import { TemplateStruct, ContentCategory } from '../../../../../types';

import * as styles from "./SectionAboutUsSimple.scss";

const SectionAboutUsSimple = () => {
    return (
        <div className={styles.aboutUs}>
            <h2>About Us</h2>
            <p>We are a team of passionate individuals dedicated to providing innovative solutions.</p>
        </div>
    );
};

export const SectionAboutUsSimpleItem: TemplateStruct = {
    name: "SectionAboutUsSimple",
    Component: SectionAboutUsSimple,
    categories: [ContentCategory.TEXT, ContentCategory.ABOUT],
    description: "",
    classNames: [
        ...Object.values(styles)
    ],
}

export default SectionAboutUsSimple;
