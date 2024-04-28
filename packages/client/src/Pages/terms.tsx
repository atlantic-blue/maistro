import { FooterSimpleItem } from "../Components/Gallery/Footer/FooterSimple/FooterSimple"
import { HeaderBasicItem } from "../Components/Gallery/Header/HeaderBasic/HeaderBasic"
import { SectionHeroBasicItem } from "../Components/Gallery/Section/SectionHero/SectionHeroBasic/SectionHeroBasic"
import { PageStruct } from "../types"

export const creteTermsPage = (): { page: PageStruct, templates: TemplateStruct[] } => {
    return {
        page: {
            path: 'policy',
            title: "Policy Page",
            description: "I am a description edit me!",
        },
        templates: [
            HeaderBasicItem,
            {
                ...SectionHeroBasicItem,
                props: {
                    ...SectionHeroBasicItem.props,
                    title: "Our Terms.",
                    content: "Lorem...",
                }
            },
            FooterSimpleItem,
        ]
    }
}
