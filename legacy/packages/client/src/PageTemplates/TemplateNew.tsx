import { PageStruct } from "../types"

export const CreateTemplateNew = (): PageStruct[] => {
    return [
        {
            path: `/index`,
            title: "I am a title please edit me!",
            description: "I am a page description, edit me!",
        },
    ]
}
