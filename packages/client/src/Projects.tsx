import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { ProjectsMessageType, ProjectsState } from "./types";
import { ProjectsStorage } from "./Store/utils/Storage";
import { Projects } from "./Store/Projects";
import router from "./Routes/router";

import { User } from "./Store/User";
import { AuthContext } from "./Auth/AuthProvider";
import { debounceTime } from "rxjs/operators";
import { projectsCreate } from "./Api/Projects/projectsCreate";
import { projectsRead } from "./Api/Projects/projectsRead";
import { projectsReadById } from "./Api/Projects/projectsReadById";

import "./Project.scss"
import { projectsUpdateById } from "./Api/Projects/projectsUpdateById";

const projectsStore = new Projects()
const user = new User()

export const ProjectsContext = React.createContext<ProjectsState>({
    projects: projectsStore,
    user: user,
    api: {
        projects: {
            create: () => Promise.resolve({ id: "", name: "" }),
            read: () => Promise.resolve([]),
            readById: () => Promise.resolve({}),
            updateById: () => Promise.resolve()
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
    const api: ProjectsState["api"] = {
        projects: {
            create: projectsCreate,
            read: projectsRead,
            readById: projectsReadById,
            updateById: projectsUpdateById,
        }
    }

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
                        setKey(`${Date.now()}`) // TODO force update?
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

    return (
        <ProjectsContext.Provider
            key={key}
            value={{
                projects,
                user,
                api,
            }}
        >
            <RouterProvider router={router} />
        </ProjectsContext.Provider>
    )
}

export default ProjectsEdit