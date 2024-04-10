import * as uuid from "uuid"
import { faker } from '@faker-js/faker';

import { PageStruct } from "../types"

import { HeaderBasicItem } from "../Components/Gallery/Header/HeaderBasic/HeaderBasic"
import { SectionHeroVideoItem } from "../Components/Gallery/Section/SectionHero/SectionHeroVideo/SectionHeroVideo"
import { SectionAboutUsTeamItem } from "../Components/Gallery/Section/SectionAboutUs/SectionAboutUsTeam/SectionAboutUsTeam"
import { SectionServicesDetailedItem } from "../Components/Gallery/Section/SectionServices/SectionServicesDetailed/SectionServicesDetailed"
import { SectionContactBasicItem } from "../Components/Gallery/Section/SectionContact/SectionContactUsBasic/SectionContactBasic"
import { FooterWithNavigationItem } from "../Components/Gallery/Footer/FooterWithNavigation/FooterWithNavigation"
import { defaultFontScheme } from "../PageContext"

export const CreateTemplateRetreats = (): PageStruct[] => {
    return [
        {
            title: "Colombian Retreats",
            id: uuid.v4(),
            path: `/${faker.word.adjective()}`,
            contentActive: null,
            description: "A Retreats page",
            content: [
                HeaderBasicItem,
                SectionHeroVideoItem,
                SectionServicesDetailedItem,
                SectionAboutUsTeamItem,
                SectionContactBasicItem,
                FooterWithNavigationItem,
            ],
            colourScheme: {
                "primary": "#DCA53D",
                "secondary": "#d9811c",
                "accent": "#fff28a",
                "background": "#f0f0f0",
                "neutral": "#ffb44f",
                "text": "#333333",
                "palette": [
                    "#a9720a",
                    "#DCA53D",
                    "#ffd870",
                    "#a64e00",
                    "#d9811c",
                    "#ffb44f"
                ]
            },
            fontScheme: defaultFontScheme,
        }
    ]
}
