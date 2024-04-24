import { Subject, Subscription } from "rxjs";

import { Project } from "./Project";
import { ProjectStruct, ProjectsEvent, ProjectsMessageType } from "../types";

interface IProjects {
    unsubscribe(): void

    setProject(id: string, projectStruct: ProjectStruct): void
    getProjects(): Record<string, Project>
    getProjectById(id: string): Project

    deleteProject(id: string): void
}

export class Projects implements IProjects {
    private projects: Record<string, Project> = {}
    private subscription: Subscription

    public event$ = new Subject<ProjectsEvent>()

    constructor() {
        this.subscription = this.createSubscriptions()
    }

    private createSubscriptions() {
        return this.event$.subscribe(event => {
            if (event.type === ProjectsMessageType.SET_PROJECT) {
                this.setProject(event.data.id, event.data)
            }

            if (event.type === ProjectsMessageType.DELETE_PROJECT) {
                this.deleteProject(event.data)
            }
        })
    }

    public unsubscribe(): void {
        this.subscription.unsubscribe()
    }

    public getProjectsStructure(): Record<string, ProjectStruct> {
        const projects = this.getProjects()
        const projectsStructure: Record<string, ProjectStruct> = {}

        return Object.keys(this.getProjects())
            .reduce((acc, nextKey) => {
                acc[nextKey] = projects[nextKey].getStruct()
                return acc
            }, projectsStructure)
    }

    public setProject(id: string, projectStruct: ProjectStruct): void {
        const project = new Project(projectStruct)

        // Reactively update pages content child -> parent
        project.event$.subscribe(() => {
            // SAVES THE PROJECT STATE 
            // INFINITE LOOP
            // this.event$.next({
            //     type: ProjectsMessageType.SET_PROJECT,
            //     data: project.getStruct(),
            // })
        })

        this.projects[id] = project
    }

    public getProjects(): Record<string, Project> {
        return this.projects
    }

    public getProjectById(id: string): Project {
        return this.projects[id]
    }

    public deleteProject(id: string): void {
        delete this.projects[id]
    }
}