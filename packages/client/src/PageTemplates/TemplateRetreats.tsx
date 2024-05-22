import * as uuid from "uuid"

import { PageStruct } from "../types"

import { HeaderBasicItem } from "../Templates/Header/HeaderBasic/HeaderBasic"
import { SectionHeroVideoItem } from "../Templates/Section/SectionHero/SectionHeroVideo/SectionHeroVideo"
import { SectionAboutUsTeamItem } from "../Templates/Section/SectionAboutUs/SectionAboutUsTeam/SectionAboutUsTeam"
import { SectionServicesDetailedItem } from "../Templates/Section/SectionServices/SectionServicesBasic/SectionServicesBasic"
import { SectionContactBasicItem } from "../Templates/Section/SectionContact/SectionSubscribeBasic/SectionSubscribeBasic"
import { FooterWithNavigationItem } from "../Templates/Footer/FooterWithNavigation/FooterWithNavigation"
import { defaultFontScheme } from "../PageContext"

export const CreateTemplateRetreats = (): PageStruct[] => {
    return [
        {
            title: "Colombian Retreats",
            id: uuid.v4(),
            path: `/home`,
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
