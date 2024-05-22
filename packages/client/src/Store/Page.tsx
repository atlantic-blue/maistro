import { Subject, Subscription } from "rxjs";
import { randColor } from '@ngneat/falso';

import { defaultColorScheme, defaultFontScheme } from "../PageContext";
import {
    ColourScheme,
    FontScheme,
    PageStruct,
    PageEvent,
    PageMessageType,
} from "../types";

import { getFontFamilyHref } from "../Components/FontScheme/FontScheme";
import { resetCss } from "./utils/cssStyles";
import Html from "./utils/html";

interface IPage {
    setId(id: string): void
    getId(): string

    getStruct(): PageStruct

    get(): PageStore
    set(page: PageStruct): void

    getPath(): string
    setPath(path: string): void

    setTitle(title: string): void
    getTitle(): string

    getDescription(): string
    setDescription(description: string): void

    setKeyWords(keyWords: string[]): void
    getKeyWords(): string

    setContentIds(content: string[]): void

    getColourScheme(): ColourScheme
    setColourScheme(colourScheme: ColourScheme): void

    getFontScheme(): FontScheme
    setFontScheme(fontScheme: FontScheme): void

    createHtml({
        Css,
        Body
    }: {
        Css: () => string,
        Body: () => string,
    }): string

}

class PageStore implements IPage {
    private id = `${Date.now()}`
    private projectId: string = ""
    private title = `Untitled-${Date.now()}`
    private path = `path-${randColor().replaceAll(" ", "-")}`
    private description = "I am a Page description, edit me!"
    private keywords = ""
    private contentIds: string[] = []
    private colourScheme: ColourScheme = defaultColorScheme
    private fontScheme: FontScheme = defaultFontScheme

    private subscription: Subscription
    public event$ = new Subject<PageEvent>()

    constructor(page: PageStruct) {
        this.set(page)
        this.subscription = this.createSubscriptions()
    }

    public unsubscribe() {
        this.subscription.unsubscribe()
    }

    private createSubscriptions() {
        return this.event$.subscribe(event => {
            if (event.type === PageMessageType.SET_TITLE) {
                this.setTitle(event.data)
            }

            if (event.type === PageMessageType.SET_PATH) {
                this.setPath(event.data)
            }

            if (event.type === PageMessageType.SET_DESCRIPTION) {
                this.setDescription(event.data)
            }

            if (event.type === PageMessageType.SET_CONTENT_IDS) {
                this.setContentIds(event.data)
            }

            if (event.type === PageMessageType.PUSH_CONTENT_IDS) {
                this.setContentIds([
                    ...this.contentIds,
                    ...event.data
                ])
            }

            if (event.type === PageMessageType.SET_COLOUR_SCHEME) {
                this.setColourScheme(event.data)
            }

            if (event.type === PageMessageType.SET_FONT_SCHEME) {
                this.setFontScheme(event.data)
            }
        })
    }

    public getStruct(): PageStruct {
        return {
            id: this.getId(),
            title: this.getTitle(),
            path: this.getPath(),
            colourScheme: this.getColourScheme(),
            contentIds: this.getContentIds(),
            description: this.getDescription(),
            fontScheme: this.getFontScheme(),
            projectId: this.getProjectId()
        }
    }

    public get() {
        return this
    }

    public set = (page: PageStruct) => {
        this.setId(page.id)
        this.setTitle(page.title)
        this.setPath(page.path)
        this.setDescription(page.description)
        this.setColourScheme(page.colourScheme)
        this.setFontScheme(page.fontScheme)
        this.setContentIds(page.contentIds)
    }

    public getId(): string {
        return this.id
    }

    public setId(id: string) {
        this.id = id
    }

    public setProjectId(projectId: string) {
        this.projectId = projectId
    }

    public getProjectId(): string {
        return this.projectId
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

    public getFavicon(): string {
        // TODO
        return ""
    }

    public setFavicon(url: string) {
        // TODO
    }

    public getKeyWords(): string {
        return this.keywords
    }

    public setKeyWords(keywords: string[]) {
        this.keywords = keywords.join(", ")
    }

    public getContentIds(): string[] {
        return [...new Set(this.contentIds.filter(Boolean))]
    }

    public setContentIds(contentIds: string[] = []) {
        this.contentIds = [...new Set(contentIds.filter(Boolean))]
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
        const sanitised = path?.replace("/", "").replace(" ", "-")
        this.path = sanitised === "home" ? "index" : sanitised
    }

    // HTML PAGE
    public getFontFamilyLinks() {
        return (
            Object.values(this.fontScheme).map(fontfamily => {
                return (`
                    <link
                        href=${getFontFamilyHref(fontfamily.family)}
                        rel="stylesheet"
                    />`
                )
            })
        )
    }

    public createHtml({
        Css,
        Body,
        state,
    }: {
        Css: () => string,
        Body: () => string,
        state: Object
    }): string {
        return (
            Html({
                htmlAttributes: `
                lang="en" style="--font-family-body: &quot;Roboto&quot;, sans-serif; --font-family-heading: &quot;Merriweather&quot;, sans-serif; --color-accent: #d9d9d9; --color-background: #f0f0f0; --color-neutral: #e6e6e6; --color-primary: #FFC94A; --color-secondary: #453F78; --color-text: #333333;"
                `,
                head: `
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
                    <meta httpEquiv="X-UA-Compatible" content="ie=edge" />

                    <title>${this.getTitle()}</title>
                    <link rel="icon" type="image/x-icon" href=${this.getFavicon()}></link>
                    <meta name="description" content=${this.getDescription()} />
                    <meta name="keywords" content=${this.getKeyWords()} />
                    <meta name="author" content="https://maistro.website" />

                    ${this.getFontFamilyLinks().join('\n')}

                    <link href="https://maistro.website/assets/radix-styles.css" rel="stylesheet" />

                    <style>
                        ${resetCss()}
                    </style>
                    <style>
                        ${Css()}
                    </style>
                `,
                body: {
                    main: `${Body()}`,
                    scripts: `
                    <script id="hydration-sate">
                        window.__STATE__ = ${JSON.stringify(state)};
                    </script>
                    <script src="https://maistro.website/assets/client-js/main.js"></script>
                    `,
                },
                bodyAttributes: ``,
            })
        )
    }
}

export default PageStore
