import { Subject, Subscription } from "rxjs"
import { ProjectAssetEvent, ProjectAssetMessageType, ProjectAssetStruct } from "../types"
import _ from "lodash"

interface IProjectAsset {
    setId(id: string): void
    getId(): string

    getDescription(): string
    setDescription(description: string): void

    getSrc(): string
    setSrc(src: string): void

    getExtension(): string
    setExtension(extension: string): void

    unsubscribe(): void
}

export class ProjectAsset implements IProjectAsset {
    private id = `${Date.now()}`
    private src = `NOT_SET`
    private description = `description to be added`
    private extension = "NOT_SET"

    private subscription: Subscription
    public event$ = new Subject<ProjectAssetEvent>()

    constructor(asset: ProjectAssetStruct) {
        this.setAsset(asset)
        this.subscription = this.createSubscriptions()
    }

    public unsubscribe() {
        this.subscription.unsubscribe()
    }

    private createSubscriptions() {
        return this.event$.subscribe(event => {
            if (event.type === ProjectAssetMessageType.SET_ID) {
                this.setId(event.data)
            }

            if (event.type === ProjectAssetMessageType.SET_SRC) {
                this.setExtension(event.data)
            }

            if (event.type === ProjectAssetMessageType.SET_DESCRIPTION) {
                this.setDescription(event.data)
            }

            if (event.type === ProjectAssetMessageType.SET_EXTENSION) {
                this.setExtension(event.data)
            }
        })
    }

    public setAsset(assetStruct: ProjectAssetStruct) {
        this.setId(assetStruct.id)
        this.setDescription(assetStruct.description)
        this.setExtension(assetStruct.contentType)
        this.setSrc(assetStruct.src)
    }

    public getStruct(): ProjectAssetStruct {
        return {
            id: this.getId(),
            src: this.getSrc(),
            description: this.getDescription(),
            contentType: this.getExtension()
        }
    }

    public getAsset() {
        return this
    }

    public getId(): string {
        return this.id
    }

    public setId(id: string) {
        this.id = id
    }

    public getDescription(): string {
        return this.description
    }

    public setDescription(description: string) {
        this.description = description
    }

    public getSrc(): string {
        return this.src
    }

    public setSrc(src: string) {
        this.src = src
    }

    public getExtension(): string {
        return this.extension
    }

    public setExtension(extension: string) {
        this.extension = extension
    }
}
