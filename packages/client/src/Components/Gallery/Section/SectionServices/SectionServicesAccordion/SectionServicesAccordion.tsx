import React, { useState } from 'react';

import * as styles from './SectionServicesAccordion.scss';
import { TemplateStruct, ContentCategory } from '../../../../../types';

const SectionServicesAccordion = () => {
    const [activeService, setActiveService] = useState<number | null>(null);

    const services = [
        { id: 1, title: 'Web Development', content: 'Developing high-quality web applications.' },
        { id: 2, title: 'Graphic Design', content: 'Crafting visually stunning designs.' },
        { id: 3, title: 'Digital Marketing', content: 'Strategizing effective online marketing campaigns.' },
    ];

    const toggleService = (id: number) => {
        setActiveService(activeService === id ? null : id);
    };

    return (
        <div className={styles.servicesAccordion}>
            <h2>Our Services</h2>
            {services.map((service) => (
                <div key={service.id} className={styles.service}>
                    <button className={styles.title} onClick={() => toggleService(service.id)}>
                        {service.title}
                    </button>
                    {activeService === service.id && <p className={styles.content}>{service.content}</p>}
                </div>
            ))}
        </div>
    );
};

export const SectionServicesAccordionItem: TemplateStruct = {
    name: "SectionServicesAccordion",
    Component: SectionServicesAccordion,
    categories: [ContentCategory.SERVICES, ContentCategory.TEXT],
    description: "Features collapsible sections for each service, making it easy for users to browse through offerings and expand them for more details. This design is great for saving space while providing ample information in an organized manner.",
    props: {},
    classNames: [
        ...Object.values(styles)
    ],
}

export default SectionServicesAccordion;