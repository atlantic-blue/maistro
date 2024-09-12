import React from "react"
import { Flex, Section } from "@radix-ui/themes"

import TemplateWysiwyg from "../Components/TemplateWysiwyg/TemplateWysiwyg"
import { TemplateCategory, TemplateComponentType, TemplateStruct } from "../templateTypes"

import * as styles from "./SectionBlank.scss"

export interface SectionBlankProps {
    "data-hydration-id"?: string
    content: string
}

const SectionBlank: React.FC<SectionBlankProps> = (props) => {
    return (
        <Section
            size={"1"}
            data-hydration-id={props["data-hydration-id"]}
            className={styles.main}
        >
            <Flex align="center" direction="column" justify="center" maxWidth="800px" m="20px">
                <TemplateWysiwyg
                    content={props.content}
                />
            </Flex>
        </Section>
    )
}

export const SectionBlankItem: TemplateStruct = {
    name: TemplateComponentType.SECTION_BLANK,
    Component: SectionBlank,
    classNames: [
        ...Object.values(styles)
    ],
    categories: [TemplateCategory.TEXT],
    description: "Blank",
    props: {
        content: "Join us on our journey.",
    }
}

export default SectionBlank
