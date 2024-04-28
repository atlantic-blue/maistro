import React from "react"
import TemplateView from "../Components/TemplateView/TemplateView"
import { PageStruct, TemplateStruct } from "../types"
import { creteAboutPage } from "./about"
import { creteContactPage } from "./contact"
import { cretePolicyPage } from "./policy"
import { creteTermsPage } from "./terms"
import { ThumbnailProps } from "../Components/Thumbnail/Thumbnail"
import { Flex } from "@radix-ui/themes"
import { HeaderBasicItem } from "../Components/Gallery/Header/HeaderBasic/HeaderBasic"
import { SectionHeroSlidesItem } from "../Components/Gallery/Section/SectionHero/SectionHeroSlides/SectionHeroSlides"
import { FooterSimpleItem } from "../Components/Gallery/Footer/FooterSimple/FooterSimple"
import { creteServicesPage } from "./services"
import { SectionHeroVideoItem } from "../Components/Gallery/Section/SectionHero/SectionHeroVideo/SectionHeroVideo"

const createIndexPage = (): { page: PageStruct, templates: TemplateStruct[] } => {
    return {
        page: {
            path: 'index',
            title: "Home Page",
            description: "I am a description edit me!",
        },
        templates: [
            HeaderBasicItem,
            SectionHeroVideoItem,
            FooterSimpleItem
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
                            const Component = template.Component
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
