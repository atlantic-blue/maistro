import { PageStruct } from "../types"

import { HeaderStickyItem } from "../Components/Gallery/Header/HeaderSticky/HeaderSticky"
import { SectionHeroSlidesItem } from "../Components/Gallery/Section/SectionHero/SectionHeroSlides/SectionHeroSlides"
import { SectionAboutUsDetailedItem } from "../Components/Gallery/Section/SectionAboutUs/SectionAboutUsDetailed/SectionAboutUsDetailed"
import { SectionServicesAccordionItem } from "../Components/Gallery/Section/SectionServices/SectionServicesAccordion/SectionServicesAccordion"
import { FooterWithNavigationItem } from "../Components/Gallery/Footer/FooterWithNavigation/FooterWithNavigation"
import { defaultFontScheme } from "../PageContext"
import { HeaderBasicItem } from "../Components/Gallery/Header/HeaderBasic/HeaderBasic"
import { SectionHeroVideoItem } from "../Components/Gallery/Section/SectionHero/SectionHeroVideo/SectionHeroVideo"

export const CreateTemplateJewellery = (): PageStruct[] => {
    return [
        {
            title: "Jewellery Page",
            path: `/home`,
            description: "A Jewellery e-commerce page",
            contentActive: null,
            content: [
                HeaderStickyItem,
                SectionHeroSlidesItem,
                SectionAboutUsDetailedItem,
                SectionServicesAccordionItem,
                FooterWithNavigationItem,
            ],
            fontScheme: defaultFontScheme,
            colourScheme: {
                primary: "#1b8da1",
                secondary: "#053b9e",
                accent: "#68daee",
                background: "#f0f0f0",
                neutral: "#386ed1",
                text: "#333333",
                palette: [
                    "#005a6e",
                    "#1b8da1",
                    "#4ec0d4",
                    "#00086b",
                    "#053b9e",
                    "#386ed1"
                ]
            },
        },

        {
            title: "Jewellery Page",
            path: `/about`,
            description: "A Jewellery e-commerce page",
            contentActive: null,
            content: [
                HeaderBasicItem,
                SectionHeroVideoItem,
                FooterWithNavigationItem,
            ],
            fontScheme: defaultFontScheme,
            colourScheme: {
                primary: "#1b8da1",
                secondary: "#053b9e",
                accent: "#68daee",
                background: "#f0f0f0",
                neutral: "#386ed1",
                text: "#333333",
                palette: [
                    "#005a6e",
                    "#1b8da1",
                    "#4ec0d4",
                    "#00086b",
                    "#053b9e",
                    "#386ed1"
                ]
            },
        }
    ]
}
