import React from 'react';

import { TemplateStruct, TemplateCategory } from '../../../templateTypes';

import * as styles from "./SectionAboutUsSimple.scss";

const SectionAboutUsSimple = (props) => {
    return (
        <div className={styles.aboutUs} {...props}>
            <h2>About Us</h2>
            <p>We are a team of passionate individuals dedicated to providing innovative solutions.</p>
        </div>
    );
};

export const SectionAboutUsSimpleItem: TemplateStruct = {
    name: "SectionAboutUsSimple",
    Component: SectionAboutUsSimple,
    categories: [TemplateCategory.ABOUT],
    description: "",
    classNames: [
        ...Object.values(styles)
    ],
    ComponentEditor: () => null,
    props: {},
}

export default SectionAboutUsSimple;
