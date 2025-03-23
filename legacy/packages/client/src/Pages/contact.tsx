import { templates } from "../Templates"
import { PageStruct } from "../types"

export const creteContactPage = (): { page: PageStruct, templates: TemplateStruct[] } => {
    return {
        page: {
            path: 'contact',
            title: "Contact Page",
            description: "I am a description edit me!",
        },
        templates: [
            templates["HeaderBurger"],
            templates["SectionSubscribeBasic"],
        ]
    }
}
