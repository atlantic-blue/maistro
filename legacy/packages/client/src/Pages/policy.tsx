import { templates } from "../Templates"
import { FooterSimpleItem } from "../Templates/Footer/FooterBasic/FooterBasic"
import { HeaderBasicItem } from "../Templates/Header/HeaderBasic/HeaderBasic"
import { SectionHeroBasicItem } from "../Templates/Section/SectionHero/SectionHeroBasic/SectionHeroBasic"
import { PageStruct } from "../types"

export const cretePolicyPage = (): { page: PageStruct, templates: TemplateStruct[] } => {
    return {
        page: {
            path: 'policy',
            title: "Policy Page",
            description: "I am a description edit me!",
        },
        templates: [
            templates["HeaderBurger"],
            {
                ...SectionHeroBasicItem,
                props: {
                    ...SectionHeroBasicItem.props,
                    title: "Policy.",
                    content: "Lorem...",
                }
            },
            // FooterSimpleItem,
        ]
    }
}
