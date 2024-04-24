import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { ProjectsMessageType, ProjectsState } from "./types";
import { ProjectsStorage } from "./Store/utils/Storage";
import { Projects } from "./Store/Projects";
import router from "./Routes/router";

import { User } from "./Store/User";
import { AuthContext } from "./Auth/AuthProvider";
import { debounceTime, filter } from "rxjs/operators";

import "./Project.scss"
import { ApiContext } from "./Api/ApiProvider";
import useObservable from "./Utils/Hooks/UseObservable";

const projectsStore = new Projects()
const user = new User()

export const ProjectsContext = React.createContext<ProjectsState>({
    projects: projectsStore,
    user: user,
})

interface ProjectsEditProps {
    projects?: Projects
}

const ProjectsEdit: React.FC<ProjectsEditProps> = ({
    projects = projectsStore
}) => {
    const { api } = React.useContext(ApiContext)
    const { user } = React.useContext(AuthContext)

    const data = useObservable(
        projectsStore.event$
            .pipe(
                filter(e => e.type === ProjectsMessageType.SET_PROJECT)
            )
    )

    useEffect(() => {
        if (!user) {
            return
        }

        // TODO enable offline mode
        // Object.keys(ProjectsStorage.get()).map(projectKey => {
        //     projectsStore.event$.next({
        //         type: ProjectsMessageType.SET_PROJECT,
        //         data: ProjectsStorage.get()[projectKey]
        //     })
        //     setKey(`${Date.now()}`)
        // })

        api.projects
            .read({ token: user.getTokenId() })
            .then(projects => {
                projects.map(project => {
                    try {
                        const projectData = ProjectsStorage.get()[project.id]
                        if (!projectData) {
                            return
                        }
                        projectsStore.event$.next({
                            type: ProjectsMessageType.SET_PROJECT,
                            data: projectData
                        })
                    } catch (error) {
                        console.log(error)
                    }
                })
            })

        const subscription = projectsStore.event$
            .pipe(
                // debounceTime(1000 * 6 * 5), // TODO SAVE EVERY 5 MINUTES?
                debounceTime(1000) // SAVE EVERY SECOND
            ).subscribe(() => {
                const value = projectsStore.getProjectsStructure()
                ProjectsStorage.set(value)
            })

        return () => {
            subscription.unsubscribe()
        }
    }, [user])

    console.log(data)
    return (
        <ProjectsContext.Provider
            value={{
                projects,
                user,
            }}
        >
            <RouterProvider router={router} />
        </ProjectsContext.Provider>
    )
}

export default ProjectsEdit