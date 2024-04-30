import React from "react"

export enum ContentCategory {
    HEADER = "HEADER",
    FOOTER = "FOOTER",
    HERO = "HERO",
    ABOUT = "ABOUT",
    SERVICES = "SERVICES",
    TEXT = "TEXT",
    CONTACT = "CONTACT",
    SUBSCRIBE = "SUBSCRIBE"
}

export enum TemplateComponentType {
    NONE = "NONE",
    HEADER_BASIC = "HEADER_BASIC",
    HEADER_BURGER = "HEADER_BURGER",
}

export interface TemplateStruct {
    name: TemplateComponentType
    description: string
    categories: ContentCategory[]
    classNames: string[]
    props: any
    Component: React.FC<any>
}
