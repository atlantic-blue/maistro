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

export interface TemplateStruct {
    name: string
    description: string
    categories: ContentCategory[]

    classNames: string[]
    props: any
    Component: React.FC<any>
    ComponentEditor: React.FC<any>
}

