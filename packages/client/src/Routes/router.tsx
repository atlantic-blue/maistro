import React from "react"
import {
    createBrowserRouter,
} from "react-router-dom";

import RoutesHome from "./RouteHome/Home";
import RoutesProjects from "./RouteProjects/Projects";

import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import RedirectRoute from "./Components/RedirectRoute/RedirectRoute";
import RoutesProjectSettings from "./RouteProject/RouteSettings/Settings";
import RoutesProjectTemplates from "./RouteProject/RouteTemplates/Templates";
import RoutesProjectEdit from "./RouteProject/RouteEdit/Edit";
import RoutesProjectEditPage from "./RouteProject/RouteEditPage/EditPage";
import RoutesProjectPreview from "./RouteProject/RoutePreview/Preview";
import RoutesProjectPreviewPage from "./RouteProject/RoutePreviewPage/PreviewPage";
import RoutesLogin from "./RouteLogin/RoutesLogin";
import RoutesLogout from "./RouteLogout/RoutesLogout";
import RoutesSettings from "./RouteSettings/Settings";
import RoutesCallback from "./RoutesCallback/Callback";

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
                <RoutesLogin />
            </RedirectRoute>
        ),
    },
    {
        path: Routes.AUTHZ_LOGOUT,
        element: <RoutesLogout />,
    },
    {
        path: Routes.AUTHZ_CALLBACK,
        element: (
            <RedirectRoute navigateTo={appRoutes.getProjectsRoute()}>
                <RoutesCallback />
            </RedirectRoute>
        ),
    },
    {
        path: Routes.SETTINGS,
        element: (
            <ProtectedRoute>
                <RoutesSettings />
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
                <RoutesProjectSettings />,
            </ProtectedRoute>
        ),
    },
    {
        path: Routes.PROJECT_TEMPLATES,
        element: (
            <ProtectedRoute>
                <RoutesProjectTemplates />,
            </ProtectedRoute>
        ),
    },
    {
        path: Routes.PROJECT_EDIT,
        element: (
            <ProtectedRoute>
                <RoutesProjectEdit />,
            </ProtectedRoute>
        ),
    },
    {
        path: Routes.PROJECT_EDIT_PAGE,
        element: (
            <ProtectedRoute>
                <RoutesProjectEditPage />
            </ProtectedRoute>
        ),
    },
    {
        path: Routes.PROJECT_PREVIEW,
        element: (
            <ProtectedRoute>
                <RoutesProjectPreview />
            </ProtectedRoute>
        ),
    },
    {
        path: Routes.PROJECT_PREVIEW_PAGE,
        element: (
            <ProtectedRoute>
                <RoutesProjectPreviewPage />
            </ProtectedRoute>
        ),
    },
]);

export default router
