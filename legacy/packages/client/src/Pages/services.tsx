import { templates } from "../Templates"
import { FooterSimpleItem } from "../Templates/Footer/FooterBasic/FooterBasic"
import { HeaderBasicItem } from "../Templates/Header/HeaderBasic/HeaderBasic"
import { SectionServicesAccordionItem } from "../Templates/Section/SectionServices/SectionServicesAccordion/SectionServicesAccordion"
import { SectionServicesBasicItem } from "../Templates/Section/SectionServices/SectionServicesBasic/SectionServicesBasic"
import { SectionServicesIconsItem } from "../Templates/Section/SectionServices/SectionServicesIcons/SectionServicesIcons"
import { PageStruct } from "../types"

export const creteServicesPage = (): { page: PageStruct, templates: TemplateStruct[] } => {
    return {
        page: {
            path: 'services',
            title: "Services Page",
            description: "I am a description edit me!",
        },
        templates: [
            templates["HeaderBurger"],
            // SectionServicesIconsItem,
            // FooterSimpleItem,
        ]
    }
}
