import React from "react"
import {
    createBrowserRouter,
} from "react-router-dom";

import RoutesHome from "./RouteHome/RouteHome";
import RoutesProjects from "./RouteProjects/RouteProjects";

import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import RedirectRoute from "./Components/RedirectRoute/RedirectRoute";
import RouteProjectSettings from "./RouteProject/RouteProjectSettings/RouteProjectSettings";
import RouteProjectTemplates from "./RouteProject/RouteProjectPageCreate/RouteProjectPageCreate";
import RouteProject from "./RouteProject/RouteProject/RouteProject";
import RouteProjectEditPage from "./RouteProject/RouteProjectPage/RouteProjectPage";
import RouteLogin from "./RouteLogin/RouteLogin";
import RouteLogout from "./RouteLogout/RouteLogout";
import RouteSettings from "./RouteSettings/RouteSettings";
import RouteCallback from "./RoutesCallback/RoutesCallback";
import RoutesProjectsNew from "./RouteProjectsCreate/RouteProjectsCreate";
import RouteProjectProvider from "./RouteProject/RouteProjectProvider";

export enum RoutesParams {
    PROJECT_ID = ":projectId",
    PAGE_ID = ":pageId",
    CONTENT_ID = ":contentId"
}

export enum Routes {
    HOME = "/*",

    AUTHZ_LOGIN = "/login",
    AUTHZ_LOGOUT = "/logout",
    AUTHZ_CALLBACK = "/callback",

    SETTINGS = `/settings`,
    PROJECTS = `/projects`,
    PROJECTS_NEW = `/projects/new`,

    PROJECT = `/project/${RoutesParams.PROJECT_ID}`,

    PROJECT_PAGE = `/project/${RoutesParams.PROJECT_ID}/page/${RoutesParams.PAGE_ID}`,
    PROJECT_PAGE_CREATE = `/project/${RoutesParams.PROJECT_ID}/page/create`,

    PROJECT_CONTENT = `/project/${RoutesParams.PROJECT_ID}/content/${RoutesParams.CONTENT_ID}`,
    PROJECT_CONTENT_CREATE = `/project/${RoutesParams.PROJECT_ID}/content/create`,

    PROJECT_SETTINGS = `/project/${RoutesParams.PROJECT_ID}/settings`,
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

    getProjectsNewRoute() {
        return '/projects/new'
    },


    getProjectRoute(projectId: string) {
        return `/project/${projectId}`
    },

    getProjectPageRoute(projectId: string, pageId: string) {
        return `/project/${projectId}/page/${pageId}`
    },

    getProjectSettingsRoute(projectId: string) {
        return `/project/${projectId}/settings`
    },

    getProjectPageTemplatesRoute(projectId: string) {
        return `/project/${projectId}/page/create`
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
        path: Routes.PROJECTS_NEW,
        element: (
            <ProtectedRoute>
                <RoutesProjectsNew />
            </ProtectedRoute>
        ),
    },
    {
        path: Routes.PROJECT_SETTINGS,
        element: (
            <ProtectedRoute>
                <RouteProjectProvider>
                    <RouteProjectSettings />
                </RouteProjectProvider>
            </ProtectedRoute>
        ),
    },
    {
        path: Routes.PROJECT_PAGE_CREATE,
        element: (
            <ProtectedRoute>
                <RouteProjectProvider>
                    <RouteProjectTemplates />
                </RouteProjectProvider>
            </ProtectedRoute>
        ),
    },
    {
        path: Routes.PROJECT,
        element: (
            <ProtectedRoute>
                <RouteProjectProvider>
                    <RouteProject />
                </RouteProjectProvider>
            </ProtectedRoute>
        ),
    },
    {
        path: Routes.PROJECT_PAGE,
        element: (
            <ProtectedRoute>
                <RouteProjectProvider>
                    <RouteProjectEditPage />
                </RouteProjectProvider>
            </ProtectedRoute>
        ),
    },
]);

export default router
