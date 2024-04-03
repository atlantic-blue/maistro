import React from "react"
import { renderToString } from 'react-dom/server';
import parse from 'html-react-parser'
import { Subject, Subscription } from "rxjs"

import { ContentCategory, ContentStruct, PageContentEvent, PageContentMessageType } from "../types"

interface IPageContent {
    getContentStructure(): ContentStruct
    setContent(content: ContentStruct): void

    getId(): string
    setId(id: string): void

    getDescription(): string
    setDescription(description: string): void

    getComponent(): React.FC
    setComponent(Component: React.FC): void

    getProps(): void
    setProps(props: unknown): void

    getCategories(): ContentCategory[]
    setCategories(categories: ContentCategory[]): void
}

class PageContent implements IPageContent {
    private id: string = ""
    private description: string = ""
    private html: string = ""
    private Component: React.FC = () => (<></>)
    private categories: ContentCategory[] = []
    private props?: any // TODO

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
            Component: renderToString(<this.Component {...this.props} />),
            props: this.getProps(),
        }
    }

    public setContent = (content: ContentStruct) => {
        this.setId(content.id)
        this.setDescription(content.description)
        this.setComponent(content.Component)
        this.setCategories(content.categories)
        this.setProps(content.props)
    }

    public getId(): string {
        return this.id
    }

    public setId(id: string): void {
        this.id = id
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

