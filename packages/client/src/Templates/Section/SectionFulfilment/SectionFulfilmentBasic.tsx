import React from "react"
import { TemplateCategory, TemplateComponentType, TemplateStruct } from "../../templateTypes"
import { Truck } from "lucide-react"

interface SectionFulfilmentBasicProps {

}

const SectionFulfilmentBasic: React.FC<SectionFulfilmentBasicProps> = () => {
    return (
        <>

            <Truck />
        </>
    )
}

export const SectionFulfilmentBasicItem: TemplateStruct<SectionFulfilmentBasicProps> = {
    name: TemplateComponentType.FULFILLMENT_BASIC,
    Component: SectionFulfilmentBasic,
    categories: [TemplateCategory.FULFILLMENT],
    description: "Fulfilment",
    classNames: [
        // ...Object.values(styles),
        // ...Object.values(ButtonStyles),
    ],
    props: {

    },
}

export default SectionFulfilmentBasicItem