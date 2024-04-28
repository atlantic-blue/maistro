import { FooterSimpleItem } from "../Components/Gallery/Footer/FooterSimple/FooterSimple"
import { HeaderBasicItem } from "../Components/Gallery/Header/HeaderBasic/HeaderBasic"
import SectionContactDetailed, { SectionContactDetailedItem } from "../Components/Gallery/Section/SectionContact/SectionContactDetailed/SectionContactDetailed"
import { SectionSubscribeBasicItem } from "../Components/Gallery/Section/SectionContact/SectionSubscribeBasic/SectionSubscribeBasic"
import { PageStruct } from "../types"

export const creteContactPage = (): { page: PageStruct, templates: TemplateStruct[] } => {
    return {
        page: {
            path: 'contact',
            title: "Contact Page",
            description: "I am a description edit me!",
        },
        templates: [
            HeaderBasicItem,
            SectionSubscribeBasicItem,
            SectionContactDetailedItem,
            FooterSimpleItem
        ]
    }
}
