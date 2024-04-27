import { Subject, Subscription } from "rxjs"
import { faker } from '@faker-js/faker';

import {
    ColourScheme,
    ProjectContentStruct,
    FontScheme,
    PageStruct,
    ProjectAssetStruct,
    ProjectEmailListStruct,
    ProjectEvent,
    ProjectMessageType,
    ProjectStruct,
} from "../types"
import { defaultColorScheme, defaultFontScheme } from "../PageContext"

import Page from "./Page"
import { ProjectAsset } from "./ProjectAsset";
import { ProjectEmailList } from "./EmailList";
import ProjectContent from "./ProjectContent";

interface IProject {
    setId(id: string): void
    getId(): string

    setName(name: string): void
    getName(): string

    setUrl(url: string): void
    getUrl(): string

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
    private name = `Untitled-${faker.animal.bird().replace(" ", "-")}`
    private url = ""
    private pages: Record<string, Page> = {}
    private content: Record<string, ProjectContent> = {}
    private assets: Record<string, ProjectAsset> = {}
    private emailLists: Record<string, ProjectEmailList> = {}

    private colourScheme: ColourScheme = defaultColorScheme
    private fontScheme: FontScheme = defaultFontScheme

    private subscriptions: Subscription[] = []
    public event$ = new Subject<ProjectEvent>()

    constructor(project: ProjectStruct) {
        this.set(project)
        this.subscriptions = [this.createSubscriptions()]
    }

    private createSubscriptions() {
        return this.event$.subscribe(event => {
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

            if (event.type === ProjectMessageType.SET_CONTENT) {
                this.setContent(event.data.id, event.data)
            }

            if (event.type === ProjectMessageType.DELETE_CONTENT) {
                this.deleteContent(event.data)
            }

            if (event.type === ProjectMessageType.SET_EMAIL_LIST) {
                this.setEmailList(event.data.id, event.data)
            }

            if (event.type === ProjectMessageType.DELETE_EMAIL_LIST) {
                this.deleteEmailList(event.data)
            }

            if (event.type === ProjectMessageType.SET_COLOUR_SCHEME) {
                this.setColourScheme(event.data)
            }

            if (event.type === ProjectMessageType.SET_FONT_SCHEME) {
                this.setFontScheme(event.data)
            }

            if (event.type === ProjectMessageType.SET_NAME) {
                this.setName(event.data)
            }

            if (event.type === ProjectMessageType.SET_URL) {
                this.setUrl(event.data)
            }
        })
    }

    public unsubscribe(): void {
        this.subscriptions.map(s => s.unsubscribe())
    }

    public getStruct(): ProjectStruct {
        return {
            id: this.getId(),
            name: this.getName(),
            url: this.getUrl(),
            fontScheme: this.getFontScheme(),
            colourScheme: this.getColourScheme(),
            pages: Object.keys(this.getPages())
                .reduce<Record<string, PageStruct>>((acc, key) => {
                    acc[key] = this.getPageById(key).getStruct()
                    return acc
                }, {}),
            assets: Object.keys(this.getAssets())
                .reduce<Record<string, ProjectAssetStruct>>((acc, key) => {
                    acc[key] = this.getAssetById(key).getStruct()
                    return acc
                }, {}),
            content: Object.keys(this.getContent())
                .reduce<Record<string, ProjectContentStruct>>((acc, key) => {
                    acc[key] = this.getContentById(key).getStruct()
                    return acc
                }, {}),
            emailLists: Object.keys(this.getEmailLists())
                .reduce<Record<string, ProjectEmailListStruct>>((acc, key) => {
                    acc[key] = this.getEmailListById(key).getStruct()
                    return acc
                }, {}),
        }
    }

    public get() {
        return this
    }

    public set = (projectStruct: ProjectStruct) => {
        this.setId(projectStruct.id)
        this.setName(projectStruct.name)
        this.setColourScheme(projectStruct.colourScheme)
        this.setFontScheme(projectStruct.fontScheme)
        this.setUrl(projectStruct.url)

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
        this.assets[id] = asset
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

    /**
     * Content
     */
    public setContent(id: string, contentStruct: ProjectContentStruct): void {
        const content = new ProjectContent(contentStruct)
        this.content[id] = content
    }

    public getContent(): Record<string, ProjectContent> {
        return this.content
    }

    public getContentById(id: string): ProjectContent {
        return this.content[id]
    }

    public deleteContent(id: string): void {
        delete this.content[id]
    }

    /**
     * Email List
     */
    public setEmailList(id: string, emailListStruct: ProjectEmailListStruct): void {
        const emailList = new ProjectEmailList(emailListStruct)
        this.emailLists[id] = emailList
    }

    public assetEmailList(id: string): void {
        delete this.assets[id]
    }

    public getEmailLists(): Record<string, ProjectEmailList> {
        return this.emailLists
    }

    public getEmailListById(id: string): ProjectEmailList {
        return this.emailLists[id]
    }

    public deleteEmailList(id: string): void {
        delete this.emailLists[id]
    }

    public getId(): string {
        return this.id
    }

    public setId(id: string) {
        this.id = id
    }

    public getName(): string {
        return this.name
    }

    public setName(name: string) {
        this.name = name
    }

    public getUrl(): string {
        return this.url
    }

    public setUrl(url: string) {
        this.url = url
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

    static createEmptyProject(id: string, title: string, url: string) {
        return new Project({
            id,
            name: title,
            url,
            pages: {},
            assets: {},
            content: {},
            emailLists: {},
            colourScheme: defaultColorScheme,
            fontScheme: defaultFontScheme,
        })
    }
}
