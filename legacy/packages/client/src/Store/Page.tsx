import { Subject, Subscription } from "rxjs";
import { randColor } from '@ngneat/falso';

import {
    PageStruct,
    PageEvent,
    PageMessageType,
    ProjectTheme,
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

    setKeyWords(keyWords: string): void
    getKeyWords(): string

    setContentIds(content: string[]): void

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
            if (event.type === PageMessageType.SET) {
                this.set(event.data)
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

            if (event.type === PageMessageType.SET_CONTENT_IDS) {
                this.setContentIds(event.data)
            }

            if (event.type === PageMessageType.PUSH_CONTENT_IDS) {
                this.setContentIds([
                    ...this.contentIds,
                    ...event.data
                ])
            }

            if (event.type === PageMessageType.DELETE_CONTENT_IDS) {
                this.setContentIds([
                    ...this.contentIds.filter(id => !event.data.includes(id)),
                ])
            }
        })
    }

    public getStruct(): PageStruct {
        return {
            id: this.getId(),
            title: this.getTitle(),
            path: this.getPath(),
            contentIds: this.getContentIds(),
            description: this.getDescription(),
            keywords: this.getKeyWords(),
            projectId: this.getProjectId(),
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
        this.setKeyWords(page.keywords)
        this.setContentIds([...new Set(page.contentIds)])
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

    public setKeyWords(keywords: string) {
        this.keywords = keywords
    }

    public getContentIds(): string[] {
        return [...new Set(this.contentIds.filter(Boolean))]
    }

    public setContentIds(contentIds: string[] = []) {
        this.contentIds = [...new Set(contentIds.filter(Boolean))]
    }

    public getPath(): string {
        return this.path
    }

    public setPath(path: string) {
        const sanitised = path?.replace(" ", "-")
        this.path = sanitised === "home" ? "index" : sanitised
    }

    // HTML PAGE
    // public getFontFamilyLinks() {
    //     return (
    //         Object.values(this.fontScheme).map(fontfamily => {
    //             return (`
    //                 <link
    //                     href=${getFontFamilyHref(fontfamily.family)}
    //                     rel="stylesheet"
    //                 />`
    //             )
    //         })
    //     )
    // }

    public createHtml({
        Css,
        Body,
        state,
        theme,
        favicon,
        url,
    }: {
        Css: () => string,
        Body: () => string,
        state: Object,
        theme: ProjectTheme
        favicon: string
        url: string
    }): string {
        const canonicalUrl = `https://${url}/${this.getPath() === "index" ? "" : this.getPath()}`
        return (
            Html({
                htmlAttributes: `
                lang="en" style="--font-family-body: &quot;Roboto&quot;, sans-serif; --font-family-heading: &quot;Merriweather&quot;, sans-serif; --color-accent: #d9d9d9; --color-background: #f0f0f0; --color-neutral: #e6e6e6; --color-primary: #FFC94A; --color-secondary: #453F78; --color-text: #333333;"
                `,
                head: `
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta httpEquiv="X-UA-Compatible" content="ie=edge" />

                    <link rel="icon" type="image/x-icon" href="${favicon}"></link>
                    <link rel="apple-touch-icon" href="${favicon}"></link>

                    <!-- SEO -->
                    <link rel="canonical" href="${canonicalUrl}" />
                    <title>${this.getTitle()}</title>
                    <meta name="description" content="${this.getDescription()}" />
                    <meta name="keywords" content="${this.getKeyWords()}" />
                    <meta name="author" content="https://maistro.website" />
                    <meta name="robots" content="index, follow">

                    <!-- Open Graph Meta Tags -->
                    <meta property="og:title" content="${this.getTitle()}">
                    <meta property="og:description" content="${this.getDescription()}">
                    <meta property="og:image" content="${favicon}">
                    <meta property="og:url" content="${canonicalUrl}">
                    <meta property="og:type" content="website">

                    <!-- Twitter Meta Tags -->
                    <meta name="twitter:card" content="summary_large_image">
                    <meta name="twitter:title" content="${this.getTitle()}">
                    <meta name="twitter:description" content="${this.getDescription()}">
                    <meta name="twitter:image" content="${favicon}">

                    <!-- Schema org -->
                    <script type="application/ld+json">
                    {
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "${this.getTitle()}",
                        "url": "${canonicalUrl}",
                        "description": "${this.getDescription()}",
                        "isPartOf": {
                            "@type": "WebSite",
                            "url": "https://${url}"
                        },
                        "author": {
                            "@type": "Organization",
                            "url": "https://${url}",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "${favicon}"
                            },
                        },
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id":  "${canonicalUrl}"
                        }
                    }
                    </script>
                    <!-- Generated via https://maistro.website -->

                    <link rel="preconnect" href="https://maistro.website" crossorigin />
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
                        window.__MAISTRO_THEME__ = ${JSON.stringify(theme)};
                    </script>
                    <script src="https://maistro.website/assets/client-js/main.js" defer></script>
                    `,
                },
                bodyAttributes: ``,
            })
        )
    }
}

export default PageStore
