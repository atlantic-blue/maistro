import * as uuid from "uuid"
import { faker } from '@faker-js/faker';

import { PageStruct } from "../types"

import { defaultColorScheme, defaultFontScheme } from "../PageContext"

export const CreateTemplateNew = (): PageStruct[] => {
    return [
        {
            title: "New Template",
            id: uuid.v4(),
            contentActive: null,
            path: `/${faker.word.adjective()}`,
            content: [],
            description: "I am a page description, edit me!",
            fontScheme: defaultFontScheme,
            colourScheme: defaultColorScheme,
        }
    ]
}
