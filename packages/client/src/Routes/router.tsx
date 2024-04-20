import React from "react"
import {
    createBrowserRouter,
} from "react-router-dom";

import RoutesHome from "./RouteHome/RouteHome";
import RoutesProjects from "./RouteProjects/RouteProjects";

import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import RedirectRoute from "./Components/RedirectRoute/RedirectRoute";
import RouteProjectSettings from "./RouteProject/RouteProjectSettings/RouteProjectSettings";
import RouteProjectTemplates from "./RouteProject/RouteProjectTemplates/RouteProjectTemplates";
import RouteProjectEdit from "./RouteProject/RouteProjectEdit/RouteProjectEdit";
import RouteProjectEditPage from "./RouteProject/RouteProjectEditPage/RouteProjectEditPage";
import RouteProjectPreview from "./RouteProject/RouteProjectPreview/RouteProjectPreview";
import RouteProjectPreviewPage from "./RouteProject/RouteProjectPreviewPage/RouteProjectPreviewPage";
import RouteLogin from "./RouteLogin/RouteLogin";
import RouteLogout from "./RouteLogout/RouteLogout";
import RouteSettings from "./RouteSettings/RouteSettings";
import RouteCallback from "./RoutesCallback/RoutesCallback";

export enum RoutesParams {
    PROJECT_ID = ":projectId",
    PAGE_ID = ":pageId",
    PAGE_PATHNAME = ":pagePathname"
}

export enum Routes {
    HOME = "/*",

    AUTHZ_LOGIN = "/login",
    AUTHZ_LOGOUT = "/logout",
    AUTHZ_CALLBACK = "/callback",

    SETTINGS = `/settings`,
    PROJECTS = `/projects`,

    PROJECT_SETTINGS = `/project/${RoutesParams.PROJECT_ID}/settings`,
    PROJECT_TEMPLATES = `/project/${RoutesParams.PROJECT_ID}/templates`,

    PROJECT_EDIT = `/project/${RoutesParams.PROJECT_ID}/edit`,
    PROJECT_EDIT_PAGE = `/project/${RoutesParams.PROJECT_ID}/edit/${RoutesParams.PAGE_ID}`,

    PROJECT_PREVIEW = `/project/${RoutesParams.PROJECT_ID}/preview`,
    PROJECT_PREVIEW_PAGE = `/project/${RoutesParams.PROJECT_ID}/preview/${RoutesParams.PAGE_PATHNAME}`,
}

export const appRoutes = {
    getHomeRoute() {
        return '/'
    },

    getLoginRoute() {
        return '/login'
    },

    getLogoutRoute() {
        return '/logout'
    },

    getSettingsRoute() {
        return '/settings'
    },

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
        element: (
            <RedirectRoute navigateTo={appRoutes.getProjectsRoute()}>
                <RoutesHome />
            </RedirectRoute>
        ),
    },
    {
        path: Routes.AUTHZ_LOGIN,
        element: (
            <RedirectRoute navigateTo={appRoutes.getProjectsRoute()}>
                <RouteLogin />
            </RedirectRoute>
        ),
    },
    {
        path: Routes.AUTHZ_LOGOUT,
        element: <RouteLogout />,
    },
    {
        path: Routes.AUTHZ_CALLBACK,
        element: (
            <RedirectRoute navigateTo={appRoutes.getProjectsRoute()}>
                <RouteCallback />
            </RedirectRoute>
        ),
    },
    {
        path: Routes.SETTINGS,
        element: (
            <ProtectedRoute>
                <RouteSettings />
            </ProtectedRoute>
        ),
    },
    {
        path: Routes.PROJECTS,
        element: (
            <ProtectedRoute>
                <RoutesProjects />
            </ProtectedRoute>
        ),
    },
    {
        path: Routes.PROJECT_SETTINGS,
        element: (
            <ProtectedRoute>
                <RouteProjectSettings />,
            </ProtectedRoute>
        ),
    },
    {
        path: Routes.PROJECT_TEMPLATES,
        element: (
            <ProtectedRoute>
                <RouteProjectTemplates />,
            </ProtectedRoute>
        ),
    },
    {
        path: Routes.PROJECT_EDIT,
        element: (
            <ProtectedRoute>
                <RouteProjectEdit />,
            </ProtectedRoute>
        ),
    },
    {
        path: Routes.PROJECT_EDIT_PAGE,
        element: (
            <ProtectedRoute>
                <RouteProjectEditPage />
            </ProtectedRoute>
        ),
    },
    {
        path: Routes.PROJECT_PREVIEW,
        element: (
            <ProtectedRoute>
                <RouteProjectPreview />
            </ProtectedRoute>
        ),
    },
    {
        path: Routes.PROJECT_PREVIEW_PAGE,
        element: (
            <ProtectedRoute>
                <RouteProjectPreviewPage />
            </ProtectedRoute>
        ),
    },
]);

export default router
