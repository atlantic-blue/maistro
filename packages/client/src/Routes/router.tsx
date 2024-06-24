import React from "react"
import {
    createBrowserRouter,
} from "react-router-dom";
import loadable from "@loadable/component";

import Loading from "../Components/Loading/Loading";
import RouteBrainstorm from "./RouteBrainstorm/RouteBrainstorm";
import RoutesHome from "./RouteHome/RouteHome";

// https://v5.reactrouter.com/web/guides/code-splitting
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

const RoutePaymentsAccounts = loadable(() => import("./RoutePayments/RoutePaymentsAccounts/RoutePaymentsAccounts"), {
    fallback: <Loading />
});

const RoutePaymentsAccountsLinkSuccess = loadable(() => import("./RoutePayments/RoutePaymentsAccounts/RoutePaymentsAccountsLinkSuccess"), {
    fallback: <Loading />
});

const RoutePaymentsPricing = loadable(() => import("./RoutePayments/RoutePaymentsPricing/RoutePaymentsPricing"), {
    fallback: <Loading />
});

const RouteTemplate = loadable(() => import("./RouteTemplate/RouteTemplate"), {
    fallback: <Loading />
});

export enum RoutesParams {
    PROJECT_ID = ":projectId",
    PAGE_ID = ":pageId",
    CONTENT_ID = ":contentId",
    PAYMENTS_ACCOUNT_ID = ":paymentsAccountId",
    TEMPLATE_ID = ":templateId"
}

export enum Routes {
    HOME = "/*",

    AUTHZ_LOGIN = "/login",
    AUTHZ_LOGOUT = "/logout",
    AUTHZ_CALLBACK = "/callback",

    SETTINGS = `/settings`,

    PAYMENTS = `/payments`,
    PAYMENTS_PRICING = `/payments/pricing`,

    PAYMENTS_ACCOUNTS = `/payments/accounts`,
    PAYMENTS_ACCOUNTS_LINK = `/payments/accounts`,
    PAYMENTS_ACCOUNTS_LINK_SUCCESS = `/payments/accounts/success`,

    BRAINSTORM = "/brainstorm",

    TEMPLATES = "/templates",
    TEMPLATE_PAGE = `/templates/${RoutesParams.TEMPLATE_ID}`,

    PROJECTS = `/projects`,
    PROJECTS_NEW = `/projects/new`,

    PROJECT = `/projects/${RoutesParams.PROJECT_ID}`,

    PROJECT_PAGE = `/projects/${RoutesParams.PROJECT_ID}/page/${RoutesParams.PAGE_ID}`,
    PROJECT_PAGE_CREATE = `/projects/${RoutesParams.PROJECT_ID}/page/create`,

    PROJECT_CONTENT = `/projects/${RoutesParams.PROJECT_ID}/content/${RoutesParams.CONTENT_ID}`,
    PROJECT_CONTENT_CREATE = `/projects/${RoutesParams.PROJECT_ID}/content/create`,

    PROJECT_SETTINGS = `/projects/${RoutesParams.PROJECT_ID}/settings`,
}

export const appRoutes = {
    getHomeRoute() {
        return '/'
    },

    getBrainstormRoute() {
        return Routes.BRAINSTORM
    },

    getTemplateRoute(templateId: string) {
        return `${Routes.TEMPLATES}/${templateId}`
    },

    getLoginRoute() {
        return Routes.AUTHZ_LOGIN
    },

    getLogoutRoute() {
        return Routes.AUTHZ_LOGOUT
    },

    getSettingsRoute() {
        return Routes.SETTINGS
    },

    getPaymentsPricing() {
        return Routes.PAYMENTS_PRICING
    },

    getProjectsRoute() {
        return Routes.PROJECTS
    },

    getProjectsNewRoute() {
        return Routes.PROJECTS_NEW
    },

    getProjectRoute(projectId: string) {
        return `${Routes.PROJECTS}/${projectId}`
    },

    getProjectPageRoute(projectId: string, pageId: string) {
        return `${Routes.PROJECTS}/${projectId}/page/${pageId}`
    },

    getProjectSettingsRoute(projectId: string) {
        return `${Routes.PROJECTS}/${projectId}/settings`
    },

    getProjectPageTemplatesRoute(projectId: string) {
        return `${Routes.PROJECTS}/${projectId}/page/create`
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
        path: Routes.BRAINSTORM,
        element: (
            <RedirectRoute navigateTo={appRoutes.getProjectsRoute()}>
                <RouteBrainstorm />
            </RedirectRoute>
        ),
    },
    {
        path: Routes.TEMPLATE_PAGE,
        element: (
            <RouteTemplate />
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
        path: Routes.PAYMENTS_PRICING,
        element: (
            <ProtectedRoute>
                <RoutePaymentsPricing />
            </ProtectedRoute>
        ),
    },
    {
        path: Routes.PAYMENTS_ACCOUNTS,
        element: (
            <ProtectedRoute>
                <RoutePaymentsAccounts />
            </ProtectedRoute>
        ),
    },
    {
        path: Routes.PAYMENTS_ACCOUNTS_LINK_SUCCESS,
        element: (
            <ProtectedRoute>
                <RoutePaymentsAccountsLinkSuccess />
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
