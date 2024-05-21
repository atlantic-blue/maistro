import React from "react"

export enum TemplateCategory {
    HEADER = "HEADER",
    HERO = "HERO",
    TEXT = "TEXT",
    SUBSCRIBE = "SUBSCRIBE",
    TESTIMONIALS = "TESTIMONIALS"
    // ABOUT = "ABOUT",
    // SERVICES = "SERVICES",
    // CONTACT = "CONTACT",
    // FOOTER = "FOOTER",
}

export enum TemplateComponentType {
    NONE = "NONE",
    HEADER_BASIC = "HEADER_BASIC",
    HEADER_BURGER = "HEADER_BURGER",
    HEADER_STICKY = "HEADER_STICKY",

    SECTION_BLANK = "SECTION_BLANK",

    HERO_BASIC = "HERO_BASIC",
    HERO_IMAGE = "HERO_IMAGE",
    HERO_SLIDES = "HERO_SLIDES",
    HERO_VIDEO = "HERO_VIDEO",
    HERO_SUBSCRIBE = "HERO_SUBSCRIBE",

    TESTIMONIALS_BASIC = "TESTIMONIALS_BASIC",

    SUBSCRIBE_BASIC = "SUBSCRIBE_BASIC",
}

export interface TemplateStruct<Props> {
    name: TemplateComponentType
    description: string
    categories: TemplateCategory[]
    classNames: string[]
    props: Props
    Component: React.FC<any>
}
