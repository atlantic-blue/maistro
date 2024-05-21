import { Avatar, Box, Card, Flex, Text } from "@radix-ui/themes"
import React from "react"
import { TemplateCategory, TemplateComponentType, TemplateStruct } from "../../../templateTypes"
import { SectionTestimonialsProps } from "../SectionTestimonialsTypes"

const SectionTestimonialsBasic: React.FC<SectionTestimonialsProps> = (props) => {
    return (
        <Box p="4" data-hydration-id={props["data-hydration-id"]}>
            <Flex align="center" direction="column" gap="3">
                <Text as="div" size="6" color="gray" align="center">
                    “{props.testimonial}”
                </Text>
                <Flex gap="3" align="center">
                    <Avatar
                        size="3"
                        src={props.pictureUrl}
                        radius="full"
                        fallback={props.name.charAt(0)}
                    />
                    <Text as="div" size="1">
                        {props.name}
                    </Text>
                </Flex>
            </Flex>
        </Box>
    )
}

export const SectionTestimonialsBasicItem: TemplateStruct<SectionTestimonialsProps> = {
    name: TemplateComponentType.TESTIMONIALS_BASIC,
    Component: SectionTestimonialsBasic,
    categories: [TemplateCategory.TESTIMONIALS],
    description: "Testimonials Basic",
    classNames: [
        // ...Object.values(styles),
        // ...Object.values(ButtonStyles),
    ],
    props: {
        name: "Julian Tellez",
        testimonial: "It's the perfect companion for my active lifestyle!",
        pictureUrl: "https://hosting.maistro.website/1498d438-d0d1-703a-53f2-d1b674fce02f/1be48130-9f7c-44f6-8e35-268c03cc148a/07084DBC-C427-497A-8B83-E3AA2E3EE770.jpeg",
    },
}

export default SectionTestimonialsBasic