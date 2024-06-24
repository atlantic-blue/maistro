import React from 'react';
import { Box, Flex, Heading } from '@radix-ui/themes';

import { TemplateStruct, TemplateCategory, TemplateComponentType } from '../../../templateTypes';
import { SectionServicesProps } from '../SectionServicesTypes';

import TemplateWysiwyg from '../../../Components/TemplateWysiwyg/TemplateWysiwyg';

import * as styles from './SectionServicesBasic.scss';

const SectionServicesBasic: React.FC<SectionServicesProps> = (props) => {
    return (
        <Box
            className={styles.main}
            data-hydration-id={props["data-hydration-id"]}
        >
            <Flex className={styles.services} justify="center">
                {props.services?.map((service, index) => (
                    <Flex className={styles.service} key={index} direction={index % 2 ? "row-reverse" : "row"} align="center" justify="center" gap="2">
                        <Box className={styles.serviceFigure}>
                            <img className={styles.serviceImg} src={service.imageUrl} alt={service.title} />
                        </Box>
                        <Box className={styles.serviceContent}>
                            <Flex direction="column" gap="2" m="4" p="3">
                                <Heading
                                    as="h3"
                                    size="5"
                                    align='center'
                                    mb="3"
                                >
                                    {service.title}
                                </Heading>
                                <TemplateWysiwyg
                                    className={styles.serviceContentText}
                                    content={service.description}
                                />
                            </Flex>
                        </Box>
                    </Flex>
                ))}
            </Flex>
        </Box>
    );
};

export const SectionServicesBasicItem: TemplateStruct<SectionServicesProps> = {
    name: TemplateComponentType.SERVICE_BASIC,
    Component: SectionServicesBasic,
    categories: [TemplateCategory.SERVICES],
    description: "Service Basic",
    classNames: [
        ...Object.values(styles)
    ],
    props: {
        services: [
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
        ]
    },
}

export default SectionServicesBasic;