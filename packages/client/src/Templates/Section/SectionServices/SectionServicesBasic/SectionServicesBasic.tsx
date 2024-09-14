import React from 'react';
import { randImg, randSentence, randWord } from '@ngneat/falso';
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
                            <img className={styles.serviceImg} src={service.imageUrl} alt={service.title} loading="lazy" />
                        </Box>
                        <Box className={styles.serviceContent}>
                            <Flex direction="column" gap="2" m="4" p="3">
                                <Heading
                                    as="h2"
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
                title: randWord({ length: 3 }).join(" "),
                description: randWord({ length: 10 }).join(" "),
                imageUrl: randImg(),
            },
            {
                title: randWord({ length: 3 }).join(" "),
                description: randWord({ length: 10 }).join(" "),
                imageUrl: randImg(),
            },
            {
                title: randWord({ length: 3 }).join(" "),
                description: randWord({ length: 10 }).join(" "),
                imageUrl: randImg(),
            },
            {
                title: randWord({ length: 3 }).join(" "),
                description: randWord({ length: 10 }).join(" "),
                imageUrl: randImg(),
            },
        ]
    },
}

export default SectionServicesBasic;