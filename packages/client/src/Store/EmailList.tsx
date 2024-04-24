import { Subject, Subscription } from "rxjs"
import {
    ProjectEmailListEvent,
    ProjectEmailListMessageType,
    ProjectEmailListStruct
} from "../types"

interface IProjectEmailList {
    setId(id: string): void
    getId(): string

    setProjectId(projectId: string): void
    getProjectId(): string

    setTitle(title: string): void
    getTitle(): string

    setDescription(description: string): void
    getDescription(): string

    setStatus(status: string): void
    getStatus(): string

    setCreatedAt(createdAt: string): void
    getCreatedAt(): string

    unsubscribe(): void
}

export class ProjectEmailList implements IProjectEmailList {
    private id: string = ""
    private projectId: string = ""
    private createdAt: string = ""
    private status: string = ""

    private title: string = ""
    private description: string = ""

    private subscriptions: Subscription[] = []
    public event$ = new Subject<ProjectEmailListEvent>()

    constructor(emailListStruct: ProjectEmailListStruct) {
        this.set(emailListStruct)
        this.subscriptions = [this.createSubscriptions()]
    }

    private createSubscriptions() {
        return this.event$.subscribe(event => {
            if (event.type === ProjectEmailListMessageType.SET_TITLE) {
                this.setTitle(event.data)
            }

            if (event.type === ProjectEmailListMessageType.SET_DESCRIPTION) {
                this.setDescription(event.data)
            }

            if (event.type === ProjectEmailListMessageType.SET_STATUS) {
                this.setStatus(event.data)
            }
        })
    }

    public unsubscribe(): void {
        this.subscriptions.map(s => s.unsubscribe())
    }

    public getStruct(): ProjectEmailListStruct {
        return {
            id: this.getId(),
            projectId: this.getProjectId(),

            title: this.getTitle(),
            status: this.getStatus(),
            createdAt: this.getCreatedAt(),
            description: this.getDescription(),
        }
    }

    public get() {
        return this
    }

    public set(emailListStruct: ProjectEmailListStruct) {
        this.setId(emailListStruct.id)
        this.setTitle(emailListStruct.title)
        this.setProjectId(emailListStruct.projectId)
        this.setDescription(emailListStruct.description)
        this.setCreatedAt(emailListStruct.createdAt)
        this.setStatus(emailListStruct.status)
    }

    public setId(id: string) {
        this.id = id
    }

    public getId() {
        return this.id
    }

    public setProjectId(projectId: string) {
        this.projectId = projectId
    }

    public getProjectId() {
        return this.projectId
    }

    public getTitle() {
        return this.title
    }

    public setTitle(title: string) {
        this.title = title
    }

    public getDescription() {
        return this.description
    }

    public setDescription(description: string) {
        this.description = description
    }

    public getCreatedAt(): string {
        return this.createdAt
    }

    public setCreatedAt(createdAt: string): void {
        this.createdAt = createdAt
    }

    public getStatus(): string {
        return this.status
    }

    public setStatus(status: string): void {
        this.status = status
    }
}