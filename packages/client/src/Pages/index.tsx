import React from "react"
import { PageStruct, TemplateStruct } from "../types"
import { creteAboutPage } from "./about"
import { creteContactPage } from "./contact"
import { cretePolicyPage } from "./policy"
import { creteTermsPage } from "./terms"
import { ThumbnailProps } from "../Components/Thumbnail/Thumbnail"
import { Flex } from "@radix-ui/themes"
import TemplateView from "../Components/TemplateView/TemplateView"
import { HeaderBasicItem } from "../Templates/Header/HeaderBasic/HeaderBasic"
import { SectionHeroSlidesItem } from "../Templates/Section/SectionHero/SectionHeroSlides/SectionHeroSlides"
import { FooterSimpleItem } from "../Templates/Footer/FooterBasic/FooterBasic"
import { creteServicesPage } from "./services"
import { SectionHeroVideoItem } from "../Templates/Section/SectionHero/SectionHeroVideo/SectionHeroVideo"
import { templates } from "../Templates"
import { TemplateComponentType } from "../Templates/templateTypes"

const createIndexPage = (): { page: PageStruct, templates: TemplateStruct[] } => {
    return {
        page: {
            path: 'index',
            title: "Home Page",
            description: "I am a description edit me!",
        },
        templates: [
            templates[TemplateComponentType.HEADER_BURGER],
        ]
    }
}

export const createPages = (): { page: PageStruct, templates: TemplateStruct[] }[] => {
    return [
        createIndexPage(),
        creteAboutPage(),
        creteContactPage(),
        creteServicesPage(),
        cretePolicyPage(),
        creteTermsPage(),
    ]
}

interface PageViewsProps {
    className?: string
    onClick: (page: PageStruct, templates: TemplateStruct[]) => void
    thumbnail?: Partial<ThumbnailProps>
}

export const PageViews: React.FC<PageViewsProps> = (props) => {
    const pages = createPages()

    return (
        <Flex gap="3" wrap="wrap" justify="center" align="center">
            {pages.map(({ page, templates }) => {
                return (
                    <TemplateView
                        key={`${page.id}-${Math.random()}`}
                        onClick={() => props.onClick(page, templates)}
                        title={page.title}
                        className={props.className}
                        thumbnail={props.thumbnail}
                    >
                        {templates?.map(template => {
                            const Component = template?.Component
                            if (!Component) {
                                return null
                            }

                            return (
                                <Component
                                    key={`${template.name}-${Math.random()}`}
                                    {...template.props}
                                />
                            )
                        })}
                    </TemplateView>
                )
            })}
        </Flex>
    )
}

export default createPages
