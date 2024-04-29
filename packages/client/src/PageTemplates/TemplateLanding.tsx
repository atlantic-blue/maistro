import * as uuid from "uuid"

import { defaultFontScheme } from "../PageContext";
import { SectionHeroBasicItem } from "../Templates/Section/SectionHero/SectionHeroBasic/SectionHeroBasic";
import { PageStruct } from "../types";

export const CreateTemplateLanding = (): PageStruct[] => {
    return [
        {
            id: uuid.v4(),
            title: "Generic Landing Page",
            description: "Generic Landing Page",
            path: `/home`,
            contentActive: null,
            content: [
                SectionHeroBasicItem
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