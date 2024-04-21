import React from "react"
import { Subject, Subscription } from "rxjs";
import { faker } from '@faker-js/faker';

import { defaultColorScheme, defaultFontScheme } from "../PageContext";
import {
    ColourScheme,
    FontScheme,
    PageStruct,
    PageEvent,
    PageMessageType,
    ColourPalette,
    FontFamily,
} from "../types";

import PageContent from "./PageContent";
import Html from "../Components/Html/Html";
import { getFontFamilyHref } from "../Components/FontScheme/FontScheme";
import { resetCss } from "./utils/cssStyles";
import { withExtension } from "../Utils/url";

interface IPage {
    getHtml(): React.ReactNode

    setId(id: string): void
    getId(): string

    getPageStructure(): PageStruct

    getPage(): PageStore
    setPage(page: PageStruct): void

    getPath(): string
    setPath(path: string): void

    setTitle(title: string): void
    getTitle(): string

    getDescription(): string
    setDescription(description: string): void

    setKeyWords(keyWords: string[]): void
    getKeyWords(): string

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
    private path = `path-${faker.color.human().replace(" ", "-")}`
    private description = "I am a Page description, edit me!"
    private keywords = ""
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

    public getKeyWords(): string {
        return this.keywords
    }

    public setKeyWords(keywords: string[]) {
        this.keywords = keywords.join(", ")
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
        return withExtension(this.path, ".html")
    }

    public setPath(path: string) {
        this.path = withExtension(path.replace("/", "").replace(" ", "-"), ".html")
    }

    // HTML PAGE
    public getFontFamilyLinks() {
        return (
            Object.values(this.fontScheme).map(fontfamily => {
                return (
                    <link
                        href={getFontFamilyHref(fontfamily.family)}
                        rel="stylesheet"
                    />
                )
            })
        )
    }

    public getCss() {
        return (
            this.getContent().map(content => {
                const styles = content.getStylesFromClassNames()
                if (!styles) {
                    return null
                }

                return (
                    <style>
                        {content.getStylesFromClassNames()}
                    </style>
                )
            })
        )
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
                    lang: "eng",
                    style: {
                        [ColourPalette.ACCENT]: this.getColourScheme().accent,
                        [ColourPalette.BACKGROUND]: this.getColourScheme().background,
                        [ColourPalette.NEUTRAL]: this.getColourScheme().neutral,
                        [ColourPalette.PRIMARY]: this.getColourScheme().primary,
                        [ColourPalette.SECONDARY]: this.getColourScheme().secondary,
                        [ColourPalette.TEXT]: this.getColourScheme().text,

                        [FontFamily.BODY]: this.getFontScheme().body.css,
                        [FontFamily.HEADING]: this.getFontScheme().heading.css,
                    }
                }}
            >
                <head>
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta httpEquiv="X-UA-Compatible" content="ie=edge" />

                    <title>{this.getTitle()}</title>
                    <link rel="icon" type="image/x-icon" href="/TODO/favicon.png"></link>
                    <meta name="description" content={this.getDescription()} />
                    <meta name="keywords" content={this.getKeyWords()} />
                    <meta name="author" content="https://maistro.website" />

                    <style>
                        {resetCss()}
                    </style>
                    {this.getCss()}
                    {this.getFontFamilyLinks()}
                </head>
                <body>
                    <main id="main">
                        {this.getHtmlBody()}
                    </main>

                </body>
            </Html>
        )
    }
}

export default PageStore
