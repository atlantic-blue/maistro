import React from "react"
import { Subject, Subscription } from "rxjs"
import { renderToString } from 'react-dom/server';
import parse from 'html-react-parser'

import { getCssTextByClassName } from "./utils/cssStyles";
import { ContentCategory, ContentStruct, PageContentEvent, PageContentMessageType } from "../types"

interface IPageContent {
    getContentStructure(): ContentStruct
    setContent(content: ContentStruct): void

    getId(): string
    setId(id: string): void

    getDescription(): string
    setDescription(description: string): void

    getCategories(): ContentCategory[]
    setCategories(categories: ContentCategory[]): void

    getClassNames(): string[]
    setClassNames(styles: string[]): void

    getProps(): void
    setProps(props: unknown): void

    getComponent(): React.FC
    setComponent(Component: React.FC): void
}

class PageContent implements IPageContent {
    private id: string = ""
    private description: string = ""
    private categories: ContentCategory[] = []
    private classNames: string[] = []
    private props?: any // TODO what type is this?
    private Component: React.FC = () => (<></>)

    private subscription: Subscription
    public event$ = new Subject<PageContentEvent>()

    constructor(content: ContentStruct) {
        this.setContent(content)
        this.subscription = this.createSubscriptions()
    }

    public unsubscribe() {
        this.subscription.unsubscribe()
    }

    private createSubscriptions() {
        return this.event$.subscribe(event => {
            if (event.type === PageContentMessageType.SET_ID) {
                this.setId(event.data)
            }

            if (event.type === PageContentMessageType.SET_DESCRIPTION) {
                this.setDescription(event.data)
            }

            if (event.type === PageContentMessageType.SET_COMPONENT) {
                this.setComponent(event.data)
            }

            if (event.type === PageContentMessageType.SET_CATEGORIES) {
                this.setCategories(event.data)
            }
        })
    }

    public getContentStructure(): ContentStruct {
        return {
            id: this.getId(),
            description: this.getDescription(),
            categories: this.getCategories(),

            classNames: this.getClassNames(),
            props: this.getProps(),
            Component: renderToString(<this.Component {...this.props} />),
        }
    }

    public setContent = (content: ContentStruct) => {
        this.setId(content.id)
        this.setDescription(content.description)
        this.setCategories(content.categories)

        this.setClassNames(content.classNames)
        this.setProps(content.props)
        this.setComponent(content.Component)
    }

    public getId(): string {
        return this.id
    }

    public setId(id: string): void {
        this.id = id
    }

    public setClassNames(classNames: string[]) {
        this.classNames = classNames

    }

    public getClassNames(): string[] {
        return this.classNames
    }

    public getStylesFromClassNames(): string[] {
        const classNames = this.classNames
        if (!classNames) {
            // TODO app level warning
            console.warn("content doesn't have any styles", this)
            return []
        }

        return classNames.map(className => {
            const cssRule = getCssTextByClassName(`.${className}`)
            return cssRule.reduce((styles, next) => {
                if (!next) {
                    return styles
                }

                return styles.concat(next)
            }, "")
        }).filter(Boolean)
    }

    public getDescription(): string {
        return this.description
    }

    public setDescription(description: string): void {
        this.description = description
    }

    public getComponent(): React.FC {
        return this.Component
    }

    public setComponent(Component: React.FC | string): void {
        let component: React.FC
        if (typeof Component === "string") {
            component = () => parse(Component as string)
        } else {
            component = Component as React.FC
        }

        this.Component = component
    }

    public getProps(): void {
        return this.props
    }

    public setProps(props: unknown): void {
        this.props = props
    }

    public getCategories(): ContentCategory[] {
        return this.categories
    }

    public setCategories(categories: ContentCategory[]): void {
        this.categories = categories
    }
}

export default PageContent

