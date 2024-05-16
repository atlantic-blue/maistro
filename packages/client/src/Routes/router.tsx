import React from "react"
import {
    createBrowserRouter,
} from "react-router-dom";
import loadable from "@loadable/component";

import Loading from "../Components/Loading/Loading";

// https://v5.reactrouter.com/web/guides/code-splitting
const RoutesHome = loadable(() => import("./RouteHome/RouteHome"), {
    fallback: <Loading />
});

const RoutesProjects = loadable(() => import("./RouteProjects/RouteProjects"), {
    fallback: <Loading />
});

const ProtectedRoute = loadable(() => import("./Components/ProtectedRoute/ProtectedRoute"), {
    fallback: <Loading />
});

const RedirectRoute = loadable(() => import("./Components/RedirectRoute/RedirectRoute"), {
    fallback: <Loading />
});

const RouteProjectSettings = loadable(() => import("./RouteProject/RouteProjectSettings/RouteProjectSettings"), {
    fallback: <Loading />
});

const RouteProjectTemplates = loadable(() => import("./RouteProject/RouteProjectPageCreate/RouteProjectPageCreate"), {
    fallback: <Loading />
});

const RouteProject = loadable(() => import("./RouteProject/RouteProject/RouteProject"), {
    fallback: <Loading />
});

const RouteProjectEditPage = loadable(() => import("./RouteProject/RouteProjectPage/RouteProjectPage"), {
    fallback: <Loading />
});

const RouteLogin = loadable(() => import("./RouteLogin/RouteLogin"), {
    fallback: <Loading />
});

const RouteLogout = loadable(() => import("./RouteLogout/RouteLogout"), {
    fallback: <Loading />
});

const RouteSettings = loadable(() => import("./RouteSettings/RouteSettings"), {
    fallback: <Loading />
});

const RouteCallback = loadable(() => import("./RoutesCallback/RoutesCallback"), {
    fallback: <Loading />
});

const RoutesProjectsNew = loadable(() => import("./RouteProjectsCreate/RouteProjectsCreate"), {
    fallback: <Loading />
});

const RouteProjectProvider = loadable(() => import("./RouteProject/RouteProjectProvider"), {
    fallback: <Loading />
});

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
