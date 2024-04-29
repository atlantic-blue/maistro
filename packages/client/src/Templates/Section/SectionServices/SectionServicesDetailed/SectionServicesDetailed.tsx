import React from 'react';

import { TemplateStruct, ContentCategory } from '../../../templateTypes';

import * as styles from './SectionServicesDetailed.scss';

const SectionServicesDetailed = (props) => {
    const services = [
        {
            title: 'Beautiful Landscapes',
            description: 'Colombia is home to some of the most beautiful landscapes in the world. From the Andes mountains to the Caribbean coast, there is something for everyone.',
            imageUrl: 'https://maistro.website/assets/pages/retreats/landscape.png'
        },
        {
            title: 'Local knowledge',
            description: 'Having local experts in place means that we can help you craft unique experiences for your team. Without local knowledge, a simple thing like booking a restaurant for a group can become an overwhelming project.',
            imageUrl: 'https://maistro.website/assets/pages/retreats/localisation.png'
        },
        {
            title: 'Cost effective',
            description: 'Colombia is a cost-effective destination. Your team will be able to enjoy a luxurious experience without breaking the bank.',
            imageUrl: 'https://maistro.website/assets/pages/retreats/piggy-bank.png'
        },
        {
            title: 'Save your Team Time',
            description: 'Planning a trip for a large group can be a time-consuming process. We can help you save time by taking care of all the details for you.',
            imageUrl: 'https://maistro.website/assets/pages/retreats/save-time.png'
        },
    ];

    return (
        <div className={styles.servicesDetailed} {...props}>
            <h2>Detailed Services</h2>
            <div className={styles.services}>
                {services.map((service, index) => (
                    <div key={index} className={styles.service}>
                        <img src={service.imageUrl} alt={service.title} />
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const SectionServicesDetailedItem: TemplateStruct = {
    name: "SectionServicesDetailed",
    Component: SectionServicesDetailed,
    categories: [ContentCategory.SERVICES, ContentCategory.TEXT],
    description: "Offers a detailed overview of each service, ideal for businesses wanting to provide comprehensive information about what they offer.",
    classNames: [
        ...Object.values(styles)
    ],
    ComponentEditor: () => null,
    props: {},
}

export default SectionServicesDetailed;