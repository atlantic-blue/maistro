import React from "react"
import TemplateView from "../Components/TemplateView/TemplateView"
import { PageStruct } from "../types"
import { creteAboutPage } from "./about"
import { creteContactPage } from "./contact"
import { cretePolicyPage } from "./policy"
import { creteTermsPage } from "./terms"
import { ThumbnailProps } from "../Components/Thumbnail/Thumbnail"
import { Flex, Grid } from "@radix-ui/themes"
import { creteServicesPage } from "./services"

const createIndexPage = (): PageStruct => {
    return {
        path: 'index',
        title: "Home Page",
        description: "I am a description edit me!",
    }
}

export const createPages = () => {
    return [
        createIndexPage(),
        creteContactPage(),
        creteAboutPage(),
        cretePolicyPage(),
        creteTermsPage(),
        creteServicesPage(),
    ]
}

interface PageViewsProps {
    className?: string
    onClick: (items: PageStruct) => void
    thumbnail?: Partial<ThumbnailProps>
}

export const PageViews: React.FC<PageViewsProps> = (props) => {
    const pages = createPages()

    return (
        <Flex gap="3" wrap="wrap" justify="center" align="center">
            {pages.map(page => {
                return (
                    <TemplateView
                        key={`${page.id}-${Math.random()}`}
                        onClick={() => props.onClick(page)}
                        title={page.title}
                        className={props.className}
                        thumbnail={props.thumbnail}
                    >
                        {page.content?.map(content => {
                            const Component = content.Component
                            return (
                                <Component
                                    key={`${content.name}-${Math.random()}`}
                                    {...content.props}
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
