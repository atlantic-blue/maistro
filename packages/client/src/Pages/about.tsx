import { templates } from "../Templates"
import { PageStruct } from "../types"

export const creteAboutPage = (): { page: PageStruct, templates: TemplateStruct[] } => {
    return {
        page: {
            path: 'about',
            title: "About Page",
            description: "I am a description edit me!",
        },
        templates: [
            templates["HeaderBurger"],
        ]
    }
}
