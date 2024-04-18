import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { ProjectsMessageType, ProjectsState } from "./types";
import { ProjectsStorage } from "./Store/utils/Storage";
import { Projects } from "./Store/Projects";
import router from "./Routes/router";

import "./Project.scss"
import { User } from "./Store/User";
import { AuthContext } from "./Auth/AuthProvider";
import { debounceTime } from "rxjs/operators";
import { projectsCreate } from "./Api/Projects/projectsCreate";

const projectsStore = new Projects()
const user = new User()

export const ProjectsContext = React.createContext<ProjectsState>({
    projects: projectsStore,
    user: user,
    api: {
        projects: {
            create: () => Promise.resolve()
        }
    }
})

interface ProjectsEditProps {
    projects?: Projects
}

const ProjectsEdit: React.FC<ProjectsEditProps> = ({
    projects = projectsStore
}) => {
    const { user } = React.useContext(AuthContext)
    const [key, setKey] = React.useState("")

    useEffect(() => {
        Object.keys(ProjectsStorage.get()).map(projectKey => {
            projectsStore.event$.next({
                type: ProjectsMessageType.SET_PROJECT,
                data: ProjectsStorage.get()[projectKey]
            })
            setKey(`${Date.now()}`)
        })

        const subscription = projectsStore.event$
            .pipe(
                debounceTime(1000) // SAVE EVERY SECOND
            ).subscribe(() => {
                const value = projectsStore.getProjectsStructure()
                ProjectsStorage.set(value)
            })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return (
        <ProjectsContext.Provider
            key={key}
            value={{
                projects,
                user,
                api: {
                    projects: {
                        create: projectsCreate
                    }
                }
            }}
        >
            <RouterProvider router={router} />
        </ProjectsContext.Provider>
    )
}

export default ProjectsEdit