import React from "react"
import { Subject, Subscription } from "rxjs";
import { faker } from '@faker-js/faker';
import { renderToString } from 'react-dom/server';

import { defaultColorScheme, defaultFontScheme } from "../PageContext";
import {
    ColourScheme,
    FontScheme,
    PageStruct,
    PageEvent,
    PageMessageType,
} from "../types";

import PageContent from "./PageContent";
import Html from "../Components/Html/Html";

interface IPage {
    getHtml(): React.ReactNode

    setId(id: string): void
    getId(): string

    getPageStructure(): PageStruct

    getPage(): PageStore
    setPage(page: PageStruct): void

    getPath(): string
    setPath(path: string): void

    getDescription(): string
    setDescription(description: string): void

    getContent(): PageContent[]
    setContent(content: PageContent[]): void

    getColourScheme(): ColourScheme
    setColourScheme(colourScheme: ColourScheme): void

    getFontScheme(): FontScheme
    setFontScheme(fontScheme: FontScheme): void
}

class PageStore implements IPage {
    private id = `${Date.now()}`
    private title = `Untitled-${Date.now()}`
    private path = `/path-${faker.color.human().replace(" ", "-")}`
    private description = "I am a Page description, edit me!"
    private content: PageContent[] = []
    private contentActive: PageContent | null = null
    private colourScheme: ColourScheme = defaultColorScheme
    private fontScheme: FontScheme = defaultFontScheme

    private subscription: Subscription
    public event$ = new Subject<PageEvent>()

    constructor(page: PageStruct) {
        this.setPage(page)
        this.subscription = this.createSubscriptions()
    }

    public unsubscribe() {
        this.subscription.unsubscribe()
    }

    private createSubscriptions() {
        return this.event$.subscribe(event => {
            if (event.type === PageMessageType.SET_ID) {
                this.setId(event.data)
            }

            if (event.type === PageMessageType.SET_TITLE) {
                this.setTitle(event.data)
            }

            if (event.type === PageMessageType.SET_PATH) {
                this.setPath(event.data)
            }

            if (event.type === PageMessageType.SET_DESCRIPTION) {
                this.setDescription(event.data)
            }

            if (event.type === PageMessageType.SET_CONTENT) {
                this.setContent(event.data)
            }

            if (event.type === PageMessageType.PUT_CONTENT) {
                this.setContent([
                    ...this.getContent(),
                    ...event.data,
                ])
            }

            if (event.type === PageMessageType.SET_CONTENT_ACTIVE) {
                this.setContentActive(event.data)
            }

            if (event.type === PageMessageType.SET_COLOUR_SCHEME) {
                this.setColourScheme(event.data)
            }

            if (event.type === PageMessageType.SET_FONT_SCHEME) {
                this.setFontScheme(event.data)
            }
        })
    }

    public getPageStructure(): PageStruct {
        return {
            id: this.getId(),
            title: this.getTitle(),
            path: this.getPath(),
            colourScheme: this.getColourScheme(),
            content: this.getContent().map(c => c.getContentStructure()),
            contentActive: this.getContentActive()?.getContentStructure() || null,
            description: this.getDescription(),
            fontScheme: this.getFontScheme(),
        }
    }

    public getPage() {
        return this
    }

    public setPage = (page: PageStruct) => {
        this.setId(page.id)
        this.setTitle(page.title)
        this.setPath(page.path)
        this.setDescription(page.description)
        this.setColourScheme(page.colourScheme)
        this.setFontScheme(page.fontScheme)
        this.setContent(page.content.map(c => new PageContent(c)))
    }

    public getId(): string {
        return this.id
    }

    public setId(id: string) {
        this.id = id
    }

    public getTitle(): string {
        return this.title
    }

    public setTitle(title: string) {
        this.title = title
    }

    public getDescription(): string {
        return this.description
    }

    public setDescription(description: string) {
        this.description = description
    }


    public getContent(): PageContent[] {
        return this.content
    }

    private contentSubscriptions: Subscription[] = []
    public setContent(content: PageContent[] = []) {
        this.contentSubscriptions.map(s => s.unsubscribe())

        const subscriptions = content.map(c => {
            return c.event$.subscribe(() => {
                this.event$.next({
                    type: PageMessageType.NOTIFY_CONTENT_UPDATED,
                })
            })
        })

        this.content = content
        this.contentSubscriptions = subscriptions
    }

    public getContentActive(): PageContent | null {
        return this.contentActive
    }

    public setContentActive(content: PageContent | null) {
        this.contentActive = content
    }

    public getColourScheme(): ColourScheme {
        return this.colourScheme
    }

    public setColourScheme(colourScheme: ColourScheme) {
        this.colourScheme = colourScheme || defaultColorScheme
    }

    public getFontScheme(): FontScheme {
        return this.fontScheme
    }

    public setFontScheme(fontScheme: FontScheme) {
        this.fontScheme = fontScheme || defaultFontScheme
    }

    public getPath(): string {
        return this.path
    }

    public setPath(path: string) {
        this.path = path
    }

    public getHtmlBody(): React.JSX.Element {
        return (
            <>
                {
                    this.getContent().map((content) => {
                        const Component = content.getComponent()
                        return <Component />
                    })
                }
            </>
        )
    }

    public getHtml(): React.ReactNode {
        return (
            <Html
                htmlAttributes={{
                    lang: "eng"
                }}
            >
                <body>
                    {this.getHtmlBody()}
                </body>
            </Html>
        )
    }
}

export default PageStore
