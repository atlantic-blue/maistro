import { FooterSimpleItem } from "../Components/Gallery/Footer/FooterSimple/FooterSimple"
import { HeaderBasicItem } from "../Components/Gallery/Header/HeaderBasic/HeaderBasic"
import { SectionAboutUsTeamItem } from "../Components/Gallery/Section/SectionAboutUs/SectionAboutUsTeam/SectionAboutUsTeam"
import { PageStruct } from "../types"

export const creteAboutPage = (): { page: PageStruct, templates: TemplateStruct[] } => {
    return {
        page: {
            path: 'about',
            title: "About Page",
            description: "I am a description edit me!",
        },
        templates: [
            HeaderBasicItem,
            SectionAboutUsTeamItem,
            FooterSimpleItem,
        ]
    }
}
