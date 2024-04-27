import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { ProjectMessageType, ProjectsMessageType, ProjectsState } from "./types";
import { Projects } from "./Store/Projects";
import router from "./Routes/router";

import { User } from "./Store/User";
import { AuthContext } from "./Auth/AuthProvider";
import { filter } from "rxjs/operators";

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
    const [isLoading, setIsLoading] = React.useState(true)

    const getProjects = async (user: User) => {
        if (!user) {
            return
        }

        const projects = await api.projects.read({ token: user.getTokenId() })
        if (!projects || !projects.length) {
            return
        }

        projects.map(async project => {
            if (!project) {
                return
            }

            projectsStore.event$.next({
                type: ProjectsMessageType.SET_PROJECT,
                data: project,
            })
        })
    }

    useObservable(
        projectsStore.event$
            .pipe(
                filter(e => e.type === ProjectsMessageType.SET_PROJECT)
            )
    )

    useEffect(() => {
        if (!user) {
            return
        }

        getProjects(user).finally(() => {
            setIsLoading(false)
        })

    }, [user])


    // move to projectsprovider
    if (user && isLoading) {
        return (
            <div>Loading Projects...</div>
        )
    }

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