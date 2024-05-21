import React from "react"
import { Navigate, useParams } from "react-router-dom"

import { ProjectsContext } from "../../../Projects";

import { appRoutes } from "../../router";
import { ApiContext } from "../../../Api/ApiProvider";
import { ProjectMessageType } from "../../../types";

const RouteProject: React.FC = () => {
    const { api } = React.useContext(ApiContext)
    const { projects, user } = React.useContext(ProjectsContext)
    const { projectId } = useParams()
    const project = projects.getProjectById(projectId || "")

    if (!project || !projectId) {
        return (
            <Navigate to={appRoutes.getProjectsRoute()} />
        )
    }

    const pagesList = Object.keys(project.getPages())
    if (pagesList.length < 1) {
        return (
            <Navigate to={appRoutes.getProjectPageTemplatesRoute(projectId)} />
        )
    }

    const index = project.getPageByPathname("index")
    if (index) {
        return (
            <Navigate to={appRoutes.getProjectPageRoute(projectId, index.getId())} />
        )
    }

    const firstAvailablePage = Object.values(project.getPages())[0]
    return (
        <Navigate to={appRoutes.getProjectPageRoute(projectId, firstAvailablePage.getId())} />
    )
}

export default RouteProject