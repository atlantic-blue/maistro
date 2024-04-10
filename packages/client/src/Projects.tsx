import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import * as uuid from "uuid"

import { ProjectsMessageType, ProjectsState } from "./types";
import { ProjectsStorage } from "./Store/utils/Storage";
import { Projects } from "./Store/Projects";
import router from "./Routes/router";

import "./Project.scss"
import { useAuth0 } from "@auth0/auth0-react";
import env from "./env";
import { User } from "./Store/User";

const projectsStore = new Projects()
const user = new User({
    id: "",
    avatar: "",
    email: "",
    name: "",
})

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
    const { user: userAuth0, isLoading } = useAuth0()
    const [key, setKey] = React.useState("")

    useEffect(() => {
        Object.keys(ProjectsStorage.get()).map(projectKey => {
            projectsStore.event$.next({
                type: ProjectsMessageType.SET_PROJECT,
                data: ProjectsStorage.get()[projectKey]
            })
            setKey(`${Date.now()}`)
        })

        const subscription = projectsStore.event$.subscribe(() => {
            const value = projectsStore.getProjectsStructure()
            ProjectsStorage.set(value)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const user = new User({
        id: !isLoading && userAuth0 && userAuth0.email && uuid.v5(userAuth0.email, env.app.uuid) || "",
        email: userAuth0?.email || "",
        avatar: userAuth0?.picture || "",
        name: userAuth0?.name || "",
    })

    return (
        <ProjectsContext.Provider
            key={key}
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