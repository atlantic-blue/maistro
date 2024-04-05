import React from "react"
import {
    createBrowserRouter,
} from "react-router-dom";

import RoutesHome from "./RouteHome/Home";
import RoutesProjects from "./RouteProjects/Projects";

import RoutesProjectSettings from "./RouteProject/RouteSettings/Settings";
import RoutesProjectTemplates from "./RouteProject/RouteTemplates/Templates";
import RoutesProjectEdit from "./RouteProject/RouteEdit/Edit";
import RoutesProjectEditPage from "./RouteProject/RouteEditPage/EditPage";
import RoutesProjectPreview from "./RouteProject/RoutePreview/Preview";
import RoutesProjectPreviewPage from "./RouteProject/RoutePreviewPage/PreviewPage";

export enum RoutesParams {
    PROJECT_ID = ":projectId",
    PAGE_ID = ":pageId",
    PAGE_PATHNAME = ":pagePathname"
}

export enum Routes {
    HOME = "/*",

    PROJECTS = `/projects`,

    PROJECT_SETTINGS = `/project/${RoutesParams.PROJECT_ID}/settings`,
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

    getProjectSettingsRoute(projectId: string) {
        return `/project/${projectId}/settings`
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
        path: Routes.PROJECT_SETTINGS,
        element: <RoutesProjectSettings />,
    },
    {
        path: Routes.PROJECT_TEMPLATES,
        element: <RoutesProjectTemplates />,
    },
    {
        path: Routes.PROJECT_EDIT,
        element: <RoutesProjectEdit />,
    },
    {
        path: Routes.PROJECT_EDIT_PAGE,
        element: <RoutesProjectEditPage />
    },
    {
        path: Routes.PROJECT_PREVIEW,
        element: <RoutesProjectPreview />,
    },
    {
        path: Routes.PROJECT_PREVIEW_PAGE,
        element: <RoutesProjectPreviewPage />,
    },
]);

export default router
