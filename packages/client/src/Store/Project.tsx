import * as uuid from "uuid"
import { Subject, Subscription } from "rxjs"
import { faker } from '@faker-js/faker';

import { ColourScheme, FontScheme, PageStruct, ProjectEvent, ProjectMessageType, ProjectStruct } from "../types"
import { defaultColorScheme, defaultFontScheme } from "../PageContext"
import Page from "./Page"

interface IProject {
    setId(id: string): void
    getId(): string

    setTitle(title: string): void
    getTitle(): string

    setPage(id: string, page: PageStruct): void
    getPageById(id: string): Page
    getPageByPathname(pathname: string): Page

    deletePage(id: string): void
    unsubscribe(): void

    getColourScheme(): ColourScheme
    setColourScheme(colourScheme: ColourScheme): void

    getFontScheme(): FontScheme
    setFontScheme(fontScheme: FontScheme): void
}

export class Project implements IProject {
    private id = `${Date.now()}`
    private title = `Untitled-${faker.animal.bird().replace(" ", "-")}`
    private pages: Record<string, Page> = {}
    private subscription: Subscription
    private colourScheme: ColourScheme = defaultColorScheme
    private fontScheme: FontScheme = defaultFontScheme

    public event$ = new Subject<ProjectEvent>()

    constructor(project: ProjectStruct) {
        this.setProject(project)
        this.subscription = this.createSubscriptions()
    }

    private createSubscriptions() {
        return this.event$.subscribe(event => {
            if (event.type === ProjectMessageType.SET_PAGE) {
                this.setPage(event.data.id, event.data)
            }

            if (event.type === ProjectMessageType.READ_PAGE) {
                this.getPageById(event.data)
            }

            if (event.type === ProjectMessageType.DELETE_PAGE) {
                this.deletePage(event.data)
            }

            if (event.type === ProjectMessageType.SET_COLOUR_SCHEME) {
                this.setColourScheme(event.data)
            }

            if (event.type === ProjectMessageType.SET_FONT_SCHEME) {
                this.setFontScheme(event.data)
            }

            if (event.type === ProjectMessageType.SET_TITLE) {
                this.setTitle(event.data)
            }
        })
    }

    public unsubscribe(): void {
        this.subscription.unsubscribe()
    }

    public getProjectStructure(): ProjectStruct {
        return {
            id: this.getId(),
            title: this.getTitle(),
            fontScheme: this.getFontScheme(),
            colourScheme: this.getColourScheme(),
            pages: Object.keys(this.getPages())
                .reduce<Record<string, PageStruct>>((acc, pageKey) => {
                    acc[pageKey] = this.getPageById(pageKey).getPageStructure()
                    return acc
                }, {}),

        }
    }

    public getProject() {
        return this
    }

    public setProject = (projectStruct: ProjectStruct) => {
        this.setId(projectStruct.id)
        this.setTitle(projectStruct.title)
        this.setColourScheme(projectStruct.colourScheme)
        this.setFontScheme(projectStruct.fontScheme)

        Object.keys(projectStruct.pages).map(pageKey => {
            const pageStruct = projectStruct.pages[pageKey]
            this.setPage(pageStruct.id, pageStruct)
        })
    }

    public setPage(id: string, pageStruct: PageStruct): void {
        const page = new Page(pageStruct)

        // Reactively update pages content child -> parent
        page.event$.subscribe(() => {
            this.event$.next({
                type: ProjectMessageType.SET_PAGE,
                data: page.getPageStructure(),
            })
        })

        this.pages[id] = page
    }

    public getPages(): Record<string, Page> {
        return this.pages
    }

    public getPageById(id: string): Page {
        return this.pages[id]
    }

    public getPageByPathname(pathname: string): Page {
        return Object.keys(this.pages)
            .filter(contentKey => {
                return this.pages[contentKey].getPath().includes(pathname)
            }).map(contentKey => {
                return this.pages[contentKey]
            })[0]
    }

    public deletePage(id: string): void {
        delete this.pages[id]
    }

    getId(): string {
        return this.id
    }

    setId(id: string) {
        this.id = id
    }

    getTitle(): string {
        return this.title
    }

    setTitle(title: string) {
        this.title = title
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

    static createEmptyProject() {
        return new Project({
            id: uuid.v4(),
            title: `Untitled-${faker.animal.bird().replace(" ", "-")}`,
            pages: {},
            colourScheme: defaultColorScheme,
            fontScheme: defaultFontScheme,
        })
    }

}
