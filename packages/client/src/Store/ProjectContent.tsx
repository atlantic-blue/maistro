import React from "react"
import { Subject, Subscription } from "rxjs"
import { renderToString } from 'react-dom/server';
import parse from 'html-react-parser'

import { getCssTextByClassName } from "./utils/cssStyles";
import { ContentCategory, PageContentEvent, PageContentMessageType, ProjectContentStruct as ProjectContentStruct } from "../types"
import { templates } from "../Templates";

interface IProjectContent {
    getStruct(): ProjectContentStruct
    set(content: ProjectContentStruct): void

    getId(): string
    setId(id: string): void

    getDescription(): string
    setDescription(description: string): void

    getCategories(): string[]
    setCategories(categories: string[]): void

    getProjectId(): string
    setProjectId(styles: string): void

    getData(): Object | undefined
    setData(data: Object): void

    getTemplateName(): string
    setTemplateName(template: string): void
}

class ProjectContent implements IProjectContent {
    private id: string = ""
    private description: string = ""
    private categories: string[] = []
    private projectId: string = ""
    private data?: Object | undefined
    private template: string = ""
    private createdAt: Date = new Date()

    private subscription: Subscription
    public event$ = new Subject<PageContentEvent>()

    constructor(content: ProjectContentStruct) {
        this.set(content)
        this.subscription = this.createSubscriptions()
    }

    public unsubscribe() {
        this.subscription.unsubscribe()
    }

    private createSubscriptions() {
        return this.event$.subscribe(event => {
            if (event.type === PageContentMessageType.SET_DESCRIPTION) {
                this.setDescription(event.data)
            }
        })
    }

    public getStruct(): ProjectContentStruct {
        return {
            id: this.getId(),
            description: this.getDescription(),
            categories: this.getCategories(),
            data: this.getData(),
            createdAt: this.getCreatedAt(),
            projectId: this.getProjectId(),
            template: this.getTemplateName(),
        }
    }

    public set = (content: ProjectContentStruct) => {
        this.setId(content.id)
        this.setProjectId(content.projectId)
        this.setDescription(content.description)
        this.setCategories(content.categories)
        this.setData(content.data)
        this.setTemplateName(content.template)
    }

    public getId(): string {
        return this.id
    }

    public setId(id: string): void {
        this.id = id
    }

    public setProjectId(projectId: string) {
        this.projectId = projectId

    }

    public getProjectId(): string {
        return this.projectId
    }

    public getDescription(): string {
        return this.description
    }

    public setDescription(description: string): void {
        this.description = description
    }


    public setTemplateName(template: string): void {
        this.template = template
    }

    public getTemplateName(): string {
        return this.template
    }

    public getData(): Object | undefined {
        return this.data
    }

    public setData(data: Object | undefined): void {
        this.data = data
    }

    public getCategories(): string[] {
        return this.categories
    }

    public setCategories(categories: string[]): void {
        this.categories = categories
    }

    public getCreatedAt(): string {
        return this.createdAt.toISOString()
    }

    public setCreatedAt = (createdAt: string): void => {
        this.createdAt = new Date(createdAt)
    }

    public Component = (): React.ReactNode | null => {
        const template = templates[this.getTemplateName()]
        if (!template) {
            return null
        }

        const Component = template?.Component

        if (!Component) {
            return null
        }

        const props = this.getData() || {}
        return <Component
            {...props}
            data-hydration-id={`${this.getTemplateName()}:${this.getId()}`}
        />
    }

    public ComponentEditor = (): React.ReactNode | null => {
        const template = templates[this.getTemplateName()]
        if (!template) {
            return null
        }

        const ComponentEditor = template?.ComponentEditor

        if (!ComponentEditor) {
            return null
        }

        const props = this.getData() || {}
        return (
            <ComponentEditor {...props} />
        )
    }

    public getStylesFromClassNames = (): string[] => {
        const template = templates[this.getTemplateName()]
        if (!template) {
            // TODO app level warning
            console.warn("content doesn't have any styles", this)
            return []
        }

        const classNames = template.classNames
        if (!classNames || !Array.isArray(classNames)) {
            // TODO app level warning
            console.warn("content doesn't have any styles", this)
            return []
        }

        return classNames.map(className => {
            const cssRule = getCssTextByClassName(`.${className}`)
            return cssRule.reduce((styles, next) => {
                if (!next) {
                    return styles
                }

                return styles.concat(next)
            }, "")
        }).filter(Boolean)
    }
}

export default ProjectContent

