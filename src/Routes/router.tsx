import React from "react"
import {
    createBrowserRouter,
} from "react-router-dom";

import RoutesHome from "./RouteHome/Home";
import RoutesTemplates from "./RouteProject/RouteTemplates/Templates";

import RoutesEdit from "./RouteProject/RouteEdit/Edit";
import RoutesEditPage from "./RouteProject/RouteEditPage/EditPage";

import RoutesPreview from "./RouteProject/RoutePreview/Preview";
import RoutesPreviewPage from "./RouteProject/RoutePreviewPage/PreviewPage";
import RoutesProjects from "./RouteProjects/Projects";

export enum RoutesParams {
    PROJECT_ID = ":projectId",
    PAGE_ID = ":pageId",
    PAGE_PATHNAME = ":pagePathname"
}

export enum Routes {
    HOME = "/*",

    PROJECTS = `/projects`,

    PROJECT_TEMPLATES = `/project/${RoutesParams.PROJECT_ID}/templates`,

    PROJECT_EDIT = `/project/${RoutesParams.PROJECT_ID}/edit`,
    PROJECT_EDIT_PAGE = `/project/${RoutesParams.PROJECT_ID}/edit/${RoutesParams.PAGE_ID}`,

    PROJECT_PREVIEW = `/project/${RoutesParams.PROJECT_ID}/preview`,
    PROJECT_PREVIEW_PAGE = `/project/${RoutesParams.PROJECT_ID}/preview/${RoutesParams.PAGE_PATHNAME}`,
}

export const appRoutes = {
    getProjectsRoute() {
        return '/projects'
    },

    getProjectTemplateRoute(projectId: string) {
        return `/project/${projectId}/templates`
    },

    getProjectEditRoute(projectId: string) {
        return `/project/${projectId}/edit`
    },

    getProjectEditPageRoute(projectId: string, pageId: string) {
        return `/project/${projectId}/edit/${pageId}`
    },

    getProjectPreviewRoute(projectId: string) {
        return `/project/${projectId}/preview`
    },

    getProjectPreviewPageRoute(projectId: string, pathname: string) {
        return `/project/${projectId}/preview/${pathname.replace("/", "")}`
    },
}

const router = createBrowserRouter([
    {
        path: Routes.HOME,
        element: <RoutesHome />,
    },
    {
        path: Routes.PROJECTS,
        element: <RoutesProjects />,
    },
    {
        path: Routes.PROJECT_TEMPLATES,
        element: <RoutesTemplates />,
    },
    {
        path: Routes.PROJECT_EDIT,
        element: <RoutesEdit />,
    },
    {
        path: Routes.PROJECT_EDIT_PAGE,
        element: <RoutesEditPage />
    },
    {
        path: Routes.PROJECT_PREVIEW,
        element: <RoutesPreview />,
    },
    {
        path: Routes.PROJECT_PREVIEW_PAGE,
        element: <RoutesPreviewPage />,
    },
]);

export default router
