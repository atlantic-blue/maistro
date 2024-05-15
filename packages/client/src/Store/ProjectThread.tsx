import { Subject, Subscription } from "rxjs"

import { ProjectThreadEvent, ProjectThreadMessage, ProjectThreadMessageType, ProjectThreadStruct } from "../types"

interface IProjectThread {
    getStruct(): ProjectThreadStruct
    set(content: ProjectThreadStruct): void

    getId(): string
    setId(id: string): void

    getProjectId(): string
    setProjectId(styles: string): void
}

class ProjectThread implements IProjectThread {
    private id: string = ""
    private name: string = ""
    private projectId: string = ""
    private createdAt: Date = new Date()
    private updatedAt: Date = new Date()
    private messages: ProjectThreadMessage[] = []
    private inputTokens: number = 0
    private outputTokens: number = 0

    private subscription: Subscription
    public event$ = new Subject<ProjectThreadEvent>()

    constructor(content: ProjectThreadStruct) {
        this.set(content)
        this.subscription = this.createSubscriptions()
    }

    public unsubscribe() {
        this.subscription.unsubscribe()
    }

    private createSubscriptions() {
        return this.event$.subscribe(event => {
            if (event.type === ProjectThreadMessageType.PUSH_MESSAGE) {
                this.messages.push(event.data.message)
                this.setInputTokens(event.data.inputTokens)
                this.setOutputTokens(event.data.outputTokens)
            }
        })
    }

    public getStruct(): ProjectThreadStruct {
        return {
            id: this.getId(),
            name: this.getName(),
            createdAt: this.getCreatedAt(),
            projectId: this.getProjectId(),
            messages: this.getMessages(),
            updatedAt: this.getUpdatedAt(),
            inputTokens: this.getInputTokens(),
            outputTokens: this.getOutputTokens(),
        }
    }

    public set = (content: ProjectThreadStruct) => {
        this.setId(content.id)
        this.setName(content.name)
        this.setProjectId(content.projectId)
        this.setCreatedAt(content.createdAt)
        this.setMessages(content.messages)
        this.setUpdatedAt(content.updatedAt)
        this.setInputTokens(content.inputTokens)
        this.setOutputTokens(content.outputTokens)
    }

    public getId(): string {
        return this.id
    }

    public setId(id: string): void {
        this.id = id
    }

    public getName(): string {
        return this.name
    }

    public setName(name: string): void {
        this.name = name
    }

    public setProjectId(projectId: string) {
        this.projectId = projectId
    }

    public getProjectId(): string {
        return this.projectId
    }

    public setInputTokens(inputTokens: number) {
        this.inputTokens = inputTokens
    }

    public getInputTokens(): number {
        return this.inputTokens
    }

    public setOutputTokens(outputTokens: number) {
        this.outputTokens = outputTokens
    }

    public getOutputTokens(): number {
        return this.outputTokens
    }

    public getCreatedAt(): string {
        return this.createdAt.toISOString()
    }

    public setCreatedAt = (createdAt: string): void => {
        this.createdAt = new Date(createdAt)
    }

    public getUpdatedAt(): string {
        return this.updatedAt.toISOString()
    }

    public setUpdatedAt = (updatedAt: string): void => {
        this.updatedAt = new Date(updatedAt)
    }

    public setMessages(messages: ProjectThreadMessage[]) {
        this.messages = [...messages]
    }

    public getMessages(): ProjectThreadMessage[] {
        return this.messages
    }

    public addMessage(message: ProjectThreadMessage) {
        this.messages.push(message)
    }
}

export default ProjectThread

