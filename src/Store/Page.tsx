import { Subject, Subscription } from "rxjs";
import { faker } from '@faker-js/faker';

import { defaultColorScheme, defaultFontScheme } from "../PageContext";
import {
    ColourScheme,
    FontScheme,
    PageStruct,
    PageEvent,
    PageMessageType,
} from "../types";

import PageContent from "./PageContent";

interface IPage {
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
        this.setPath(page.path)
        this.setDescription(page.description)
        this.setColourScheme(page.colourScheme)
        this.setFontScheme(page.fontScheme)
        this.setContent(page.content.map(c => new PageContent(c)))
    }

    getId(): string {
        return this.id
    }

    setId(id: string) {
        this.id = id
    }

    getDescription(): string {
        return this.description
    }

    setDescription(description: string) {
        this.description = description
    }


    getContent(): PageContent[] {
        return this.content
    }

    private contentSubscriptions: Subscription[] = []
    setContent(content: PageContent[] = []) {
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

    getContentActive(): PageContent | null {
        return this.contentActive
    }

    setContentActive(content: PageContent | null) {
        this.contentActive = content
    }

    getColourScheme(): ColourScheme {
        return this.colourScheme
    }

    setColourScheme(colourScheme: ColourScheme) {
        this.colourScheme = colourScheme || defaultColorScheme
    }

    getFontScheme(): FontScheme {
        return this.fontScheme
    }

    setFontScheme(fontScheme: FontScheme) {
        this.fontScheme = fontScheme || defaultFontScheme
    }

    getPath(): string {
        return this.path
    }

    setPath(path: string) {
        this.path = path
    }
}

export default PageStore
