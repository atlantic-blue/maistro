import { Subject, Subscription } from "rxjs"
import { faker } from '@faker-js/faker';

import {
    ColourScheme,
    FontScheme,
    PageMessageType,
    PageStruct,
    ProjectAssetStruct,
    ProjectEvent,
    ProjectMessageType,
    ProjectStruct,
} from "../types"
import { defaultColorScheme, defaultFontScheme } from "../PageContext"

import Page from "./Page"
import { ProjectAsset } from "./ProjectAsset";

interface IProject {
    setId(id: string): void
    getId(): string

    setTitle(title: string): void
    getTitle(): string

    setPage(id: string, page: PageStruct): void
    getPageById(id: string): Page
    getPageByPathname(pathname: string): Page

    deletePage(id: string): void

    setAsset(id: string, asset: ProjectAssetStruct): void
    getAssetById(id: string): ProjectAsset

    getColourScheme(): ColourScheme
    setColourScheme(colourScheme: ColourScheme): void

    getFontScheme(): FontScheme
    setFontScheme(fontScheme: FontScheme): void

    unsubscribe(): void
}

export class Project implements IProject {
    private id = `${Date.now()}`
    private title = `Untitled-${faker.animal.bird().replace(" ", "-")}`
    private pages: Record<string, Page> = {}
    private subscriptions: Subscription[] = []
    private colourScheme: ColourScheme = defaultColorScheme
    private fontScheme: FontScheme = defaultFontScheme
    private assets: Record<string, ProjectAsset> = {}

    public event$ = new Subject<ProjectEvent>()

    constructor(project: ProjectStruct) {
        this.setProject(project)
        this.subscriptions = [this.createSubscriptions()]
    }

    private createSubscriptions() {
        return this.event$.subscribe(event => {
            if (event.type === ProjectMessageType.READ_PAGE) {
                this.getPageById(event.data)
            }

            if (event.type === ProjectMessageType.SET_PAGE) {
                this.setPage(event.data.id, event.data)
            }

            if (event.type === ProjectMessageType.DELETE_PAGE) {
                this.deletePage(event.data)
            }

            if (event.type === ProjectMessageType.SET_ASSET) {
                this.setAsset(event.data.id, event.data)
            }

            if (event.type === ProjectMessageType.DELETE_ASSET) {
                this.deleteAsset(event.data)
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
        this.subscriptions.map(s => s.unsubscribe())
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
            assets: Object.keys(this.getAssets())
                .reduce<Record<string, ProjectAssetStruct>>((acc, assetKey) => {
                    acc[assetKey] = this.getAssetById(assetKey).getAssetStructure()
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

        Object.keys(projectStruct.assets || {}).map(asset => {
            const assetStruct = projectStruct.assets[asset]
            this.setAsset(assetStruct.id, assetStruct)
        })

        Object.keys(projectStruct.pages || {}).map(pageKey => {
            const pageStruct = projectStruct.pages[pageKey]
            this.setPage(pageStruct.id, pageStruct)
        })
    }

    /**
     * Pages
     */
    public setPage(id: string, pageStruct: PageStruct): void {
        const page = new Page(pageStruct)

        // Reactively update pages content child -> parent
        this.subscriptions.push(
            page.event$.subscribe(() => {
                this.event$.next({
                    type: ProjectMessageType.SET_PAGE,
                    data: page.getPageStructure(),
                })
            })
        )

        // Reactively update pages content parent -> child
        this.subscriptions.push(
            this.event$.subscribe((event) => {
                if (event.type === ProjectMessageType.SET_COLOUR_SCHEME) {
                    page.event$.next({
                        type: PageMessageType.SET_COLOUR_SCHEME,
                        data: event.data
                    })
                }

                if (event.type === ProjectMessageType.SET_FONT_SCHEME) {
                    page.event$.next({
                        type: PageMessageType.SET_FONT_SCHEME,
                        data: event.data
                    })
                }
            })
        )

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

    /**
     * Asset
     */
    public setAsset(id: string, assetStruct: ProjectAssetStruct): void {
        const asset = new ProjectAsset(assetStruct)

        // Reactively update pages content child -> parent
        this.subscriptions.push(
            asset.event$.subscribe(() => {
                this.event$.next({
                    type: ProjectMessageType.SET_ASSET,
                    data: asset.getAssetStructure(),
                })
            })
        )

        this.assets[id] = asset
    }

    public assetPage(id: string): void {
        delete this.assets[id]
    }

    public getAssets(): Record<string, ProjectAsset> {
        return this.assets
    }

    public getAssetById(id: string): ProjectAsset {
        return this.assets[id]
    }

    public deleteAsset(id: string): void {
        delete this.assets[id]
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

    static createEmptyProject(id: string, title: string) {
        return new Project({
            id,
            title,
            pages: {},
            assets: {},
            colourScheme: defaultColorScheme,
            fontScheme: defaultFontScheme,
        })
    }
}
