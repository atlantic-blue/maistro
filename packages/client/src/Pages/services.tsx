import { FooterSimpleItem } from "../Components/Gallery/Footer/FooterSimple/FooterSimple"
import { HeaderBasicItem } from "../Components/Gallery/Header/HeaderBasic/HeaderBasic"
import { SectionServicesAccordionItem } from "../Components/Gallery/Section/SectionServices/SectionServicesAccordion/SectionServicesAccordion"
import { SectionServicesBasicItem } from "../Components/Gallery/Section/SectionServices/SectionServicesBasic/SectionServicesBasic"
import { SectionServicesIconsItem } from "../Components/Gallery/Section/SectionServices/SectionServicesIcons/SectionServicesIcons"
import { PageStruct } from "../types"

export const creteServicesPage = (): { page: PageStruct, templates: TemplateStruct[] } => {
    return {
        page: {
            path: 'services',
            title: "Services Page",
            description: "I am a description edit me!",
        },
        templates: [
            HeaderBasicItem,
            SectionServicesIconsItem,
            FooterSimpleItem,
        ]
    }
}
