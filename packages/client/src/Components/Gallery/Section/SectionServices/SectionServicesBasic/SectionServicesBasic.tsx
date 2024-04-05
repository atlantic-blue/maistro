import React from 'react';

import { ContentStruct, ContentCategory } from '../../../../../types';

import * as styles from './SectionServicesBasic.scss';

const SectionServicesBasic = () => {
    return (
        <div className={styles.servicesBasic}>
            <h2>Our Services</h2>
            <ul>
                <li>Web Development</li>
                <li>Graphic Design</li>
                <li>Digital Marketing</li>
            </ul>
        </div>
    );
};

export const SectionServicesBasicItem: ContentStruct = {
    id: "SectionServicesBasic",
    Component: SectionServicesBasic,
    categories: [ContentCategory.SERVICES, ContentCategory.TEXT],
    description: "A basic and clean presentation of services, perfect for businesses that prefer a minimalist and straightforward approach."
}

export default SectionServicesBasic;
