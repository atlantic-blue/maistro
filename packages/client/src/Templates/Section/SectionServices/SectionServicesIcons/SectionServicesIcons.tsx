import React from 'react';

import * as styles from './SectionServicesIcons.scss';
import { TemplateStruct, TemplateCategory } from '../../../templateTypes';

const SectionServicesIcons = (props) => {
    // Placeholder icons. Replace with actual icons for your services.
    const services = [
        { name: 'Web Development', icon: '🌐' },
        { name: 'Graphic Design', icon: '🎨' },
        { name: 'Digital Marketing', icon: '📈' },
    ];

    return (
        <div className={styles.servicesIcons} {...props}>
            <h2>Our Services</h2>
            <div className={styles.servicesList}>
                {services.map((service, index) => (
                    <div key={index} className={styles.serviceItem}>
                        <div className={styles.icon}>{service.icon}</div>
                        <div className={styles.name}>{service.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const SectionServicesIconsItem: TemplateStruct = {
    name: "SectionServicesIcons",
    Component: SectionServicesIcons,
    categories: [TemplateCategory.SERVICES],
    description: "A visually appealing way to showcase services with relevant icons, making each service easily identifiable at a glance.",
    classNames: [
        ...Object.values(styles)
    ],
    ComponentEditor: () => null,
    props: {},
}

export default SectionServicesIcons;