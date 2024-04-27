import React from 'react';

import { TemplateStruct, ContentCategory } from '../../../../../types';

import * as styles from "./SectionAboutUsDetailed.scss"

const SectionAboutUsDetailed = () => {
    return (
        <div className={styles.aboutUs}>
            <h2>About Our Company</h2>
            <p>Founded in 2010, we have grown to become leaders in our industry, thanks to our innovative approach and dedicated team members.</p>
            <div className={styles.achievements}>
                <div className={styles.achievement}><strong>10+</strong> Years in Business</div>
                <div className={styles.achievement}><strong>100+</strong> Projects Delivered</div>
                <div className={styles.achievement}><strong>50+</strong> Team Members</div>
            </div>
        </div>
    );
};

export const SectionAboutUsDetailedItem: TemplateStruct = {
    name: "SectionAboutUsDetailed",
    Component: SectionAboutUsDetailed,
    categories: [ContentCategory.ABOUT, ContentCategory.TEXT],
    description: "",
    classNames: [
        ...Object.values(styles)
    ],
}

export default SectionAboutUsDetailed;