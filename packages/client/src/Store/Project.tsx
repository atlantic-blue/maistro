import { Subject, Subscription } from "rxjs"
import { randAnimal } from '@ngneat/falso';

import {
    ProjectContentStruct,
    PageStruct,
    ProjectAssetStruct,
    ProjectEmailListStruct,
    ProjectEvent,
    ProjectMessageType,
    ProjectStruct,
    ProjectThreadStruct,
    ProjectTheme,
    ProjectThemeAccentColour,
    ProjectThemeGrayColour,
    ProductStruct,
    OrderStruct,
} from "../types"

import Page from "./Page"
import { ProjectAsset } from "./ProjectAsset";
import { ProjectEmailList } from "./EmailList";
import ProjectContent from "./ProjectContent";
import ProjectThread from "./ProjectThread";
import { Product } from "./Product";
import { Currency } from "../Utils/currency";
import { Order } from "./Order";

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

    getTheme(): ProjectTheme
    setTheme(theme: ProjectTheme): void

    unsubscribe(): void
}

export class Project implements IProject {
    private id = `${Date.now()}`
    private userId = ""
    private name = `Untitled-${randAnimal().replace(" ", "-")}`
    private url = ""
    private logo = ""
    private email = ""
    private currency: Currency = Currency.GBP

    private pages: Record<string, Page> = {}
    private content: Record<string, ProjectContent> = {}
    private assets: Record<string, ProjectAsset> = {}
    private emailLists: Record<string, ProjectEmailList> = {}
    private threads: Record<string, ProjectThread> = {}
    private products: Record<string, Product> = {}
    private orders: Record<string, Order> = {}

    private theme: ProjectTheme = {
        accentColor: ProjectThemeAccentColour.amber,
        appearance: "light",
        grayColor: ProjectThemeGrayColour.auto,
        radius: "small",
        scaling: "100%",
    }

    private subscriptions: Subscription[] = []
    public event$ = new Subject<ProjectEvent>()

    constructor(project: ProjectStruct) {
        this.set(project)
        this.subscriptions = [this.createSubscriptions()]
    }

    private createSubscriptions() {
        return this.event$.subscribe(event => {
            if (event.type === ProjectMessageType.SET) {
                this.set(event.data)
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

            if (event.type === ProjectMessageType.SET_AI_THREAD) {
                this.setThread(event.data.id, event.data)
            }

            if (event.type === ProjectMessageType.DELETE_AI_THREAD) {
                this.deleteThread(event.data)
            }

            if (event.type === ProjectMessageType.SET_PRODUCT) {
                this.setProduct(event.data.id, event.data)
            }

            if (event.type === ProjectMessageType.DELETE_PRODUCT) {
                this.deleteProduct(event.data)
            }

            if (event.type === ProjectMessageType.SET_ORDER) {
                this.setOrder(event.data.id, event.data)
            }

            if (event.type === ProjectMessageType.DELETE_ORDER) {
                this.deleteOrder(event.data)
            }

            if (event.type === ProjectMessageType.SET_NAME) {
                this.setName(event.data)
            }

            if (event.type === ProjectMessageType.SET_URL) {
                this.setUrl(event.data)
            }

            if (event.type === ProjectMessageType.SET_THEME) {
                this.setTheme(event.data)
            }

            if (event.type === ProjectMessageType.SET_CURRENCY) {
                this.setCurrency(event.data)
            }
        })
    }

    public unsubscribe(): void {
        this.subscriptions.map(s => s.unsubscribe())
    }

    public getStruct(): ProjectStruct {
        return {
            id: this.getId(),
            userId: this.getUserId(),
            name: this.getName(),
            url: this.getUrl(),
            logo: this.getLogo(),
            email: this.getEmail(),
            theme: this.getTheme(),
            currency: this.getCurrency(),

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
            threads: Object.keys(this.getThreads())
                .reduce<Record<string, ProjectThreadStruct>>((acc, key) => {
                    acc[key] = this.getThreadById(key).getStruct()
                    return acc
                }, {}),
            products: Object.keys(this.getProducts())
                .reduce<Record<string, ProductStruct>>((acc, key) => {
                    acc[key] = this.getProductById(key).getStruct()
                    return acc
                }, {}),
            orders: Object.keys(this.getOrders())
                .reduce<Record<string, OrderStruct>>((acc, key) => {
                    acc[key] = this.getOrderById(key).getStruct()
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
        this.setUrl(projectStruct.url)
        this.setLogo(projectStruct.logo)
        this.setEmail(projectStruct.email)
        this.setTheme(projectStruct.theme)
        this.setCurrency(projectStruct.currency)
        this.setUserId(projectStruct.userId)

        Object.keys(projectStruct.assets || {}).map(asset => {
            const assetStruct = projectStruct.assets[asset]
            this.setAsset(assetStruct.id, assetStruct)
        })

        Object.keys(projectStruct.pages || {}).map(pageKey => {
            const pageStruct = projectStruct.pages[pageKey]
            this.setPage(pageStruct.id, pageStruct)
        })

        Object.keys(projectStruct.emailLists || {}).map(key => {
            const struct = projectStruct.emailLists[key]
            this.setEmailList(struct.id, struct)
        })

        Object.keys(projectStruct.threads || {}).map(key => {
            const struct = projectStruct.threads[key]
            this.setThread(struct.id, struct)
        })
    }

    public setCurrency(currency: Currency) {
        this.currency = currency
    }

    public getCurrency() {
        return this.currency
    }

    public setUserId(userId: string) {
        this.userId = userId
    }

    public getUserId() {
        return this.userId
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

    public getPagesMap(): Page[] {
        return [
            this.getPageByPathname("index"),
            ...Object.values(this.pages).filter(page => "index" !== page.getPath())
        ]
    }

    public getPageById(id: string): Page {
        return this.pages[id]
    }

    public getPageByPathname(pathname: string): Page {
        return Object.keys(this.pages)
            .filter(contentKey => contentKey !== "undefined")
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
     * Threads
     */
    public setThread(id: string, struct: ProjectThreadStruct): void {
        const thread = new ProjectThread(struct)
        this.threads[id] = thread
    }

    public getThreads(): Record<string, ProjectThread> {
        return this.threads
    }

    public getThreadById(id: string): ProjectThread {
        return this.threads[id]
    }

    public getThreadByName(name: string): ProjectThread {
        return Object.keys(this.threads)
            .filter(contentKey => contentKey !== "undefined")
            .filter(contentKey => {
                return this.threads[contentKey].getName().includes(name)
            }).map(contentKey => {
                return this.threads[contentKey]
            })[0]
    }

    public deleteThread(id: string): void {
        delete this.threads[id]
    }

    /**
     * Email List
     */
    public setEmailList(id: string, emailListStruct: ProjectEmailListStruct): void {
        const emailList = new ProjectEmailList(emailListStruct)
        this.emailLists[id] = emailList
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

    /**
    * Products
    */
    public setProduct(id: string, struct: ProductStruct): void {
        const product = new Product(struct)
        this.products[id] = product
    }

    public getProducts(): Record<string, Product> {
        return this.products
    }

    public getProductById(id: string): Product {
        return this.products[id]
    }

    public deleteProduct(id: string): void {
        delete this.products[id]
    }

    /**
    * Orders
    */
    public setOrder(id: string, struct: OrderStruct): void {
        const order = new Order(struct)
        this.orders[id] = order
    }

    public getOrders(): Record<string, Order> {
        return this.orders
    }

    public getOrderById(id: string): Order {
        return this.orders[id]
    }

    public deleteOrder(id: string): void {
        delete this.orders[id]
    }

    //
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

    public getLogo(): string {
        return this.logo
    }

    public setLogo(url: string) {
        this.logo = url
    }

    public getEmail(): string {
        return this.email
    }

    public setEmail(email: string) {
        this.email = email
    }

    public setTheme(theme: ProjectTheme): void {
        this.theme = theme
    }

    public getTheme(): ProjectTheme {
        return this.theme
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
            threads: {},
            products: {},
            orders: {},
            theme: {
                accentColor: ProjectThemeAccentColour.amber,
                appearance: "light",
                grayColor: ProjectThemeGrayColour.auto,
                radius: "small",
                scaling: "100%",
            },
            currency: Currency.GBP,
            logo: "",
            email: "",
            userId: ""
        })
    }
}
