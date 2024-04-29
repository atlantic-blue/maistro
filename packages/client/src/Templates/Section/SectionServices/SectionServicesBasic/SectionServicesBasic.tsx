import React from 'react';

import { TemplateStruct, ContentCategory } from '../../../templateTypes';

import * as styles from './SectionServicesBasic.scss';

interface SectionServicesBasicProps {

}

const SectionServicesBasic: React.FC<SectionServicesBasicProps> = (props) => {
    return (
        <div className={styles.servicesBasic} {...props}>
            <h2>Our Services</h2>
            <ul>
                <li>Web Development</li>
                <li>Graphic Design</li>
                <li>Digital Marketing</li>
            </ul>
        </div>
    );
};

export const SectionServicesBasicItem: TemplateStruct = {
    name: "SectionServicesBasic",
    description: "A basic and clean presentation of services, perfect for businesses that prefer a minimalist and straightforward approach.",
    categories: [ContentCategory.SERVICES, ContentCategory.TEXT],
    classNames: [
        ...Object.values(styles)
    ],
    Component: SectionServicesBasic,
    ComponentEditor: () => null,
    props: {},
}

export default SectionServicesBasic;
