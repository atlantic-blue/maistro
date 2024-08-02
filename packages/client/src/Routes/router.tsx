import React from "react"
import {
    RouteObject,
    createBrowserRouter,
} from "react-router-dom";
import loadable from "@loadable/component";

import Loading from "../Components/Loading/Loading";
import RouteBrainstorm from "./RouteBrainstorm/RouteBrainstorm";
import RoutesHome from "./RouteHome/RouteHome";
import { ResourceStringLanguage } from "../ResourceStrings";
import { getCurrentLanguage } from "../ResourceStrings/ResourceStringsProvider";
import RouteProjectProducts from "./RouteProject/RouteProjectProducts/RouteProjectProducts";
import RouteProjectSettingsOrders from "./RouteProject/RouteProjectOrders/RouteProjectOrders";
import RouteProjectSettingsContent from "./RouteProject/RouteProjectContents/RouteProjectContents";
import RouteProjectSettingsTheme from "./RouteProject/RouteProjectTheme/RouteProjectTheme";
import RouteProjectSettingsMailList from "./RouteProject/RouteProjectMailList/RouteProjectMailList";
import RouteProjectPageSettings from "./RouteProject/RouteProjectPageSettings/RouteProjectSettings";

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
    PROJECT_PAGE_SETTINGS = `/projects/${RoutesParams.PROJECT_ID}/page/${RoutesParams.PAGE_ID}/settings`,
    PROJECT_PAGE_CREATE = `/projects/${RoutesParams.PROJECT_ID}/page/create`,

    // TODO delete? 
    PROJECT_CONTENT = `/projects/${RoutesParams.PROJECT_ID}/content/${RoutesParams.CONTENT_ID}`,
    // TODO delete? 
    PROJECT_CONTENT_CREATE = `/projects/${RoutesParams.PROJECT_ID}/content/create`,

    PROJECT_SETTINGS = `/projects/${RoutesParams.PROJECT_ID}/settings`,
    PROJECT_THEME = `/projects/${RoutesParams.PROJECT_ID}/theme`,
    PROJECT_CONTACTS = `/projects/${RoutesParams.PROJECT_ID}/contacts`,
    PROJECT_PRODUCTS = `/projects/${RoutesParams.PROJECT_ID}/products`,
    PROJECT_ORDERS = `/projects/${RoutesParams.PROJECT_ID}/orders`,
    PROJECT_CONTENTS = `/projects/${RoutesParams.PROJECT_ID}/contents`,
}

class AppRoutes {
    private language = ResourceStringLanguage.ENGLISH

    constructor(language: ResourceStringLanguage) {
        this.setLanguage(language)
    }

    setLanguage(language: ResourceStringLanguage) {
        this.language = language
    }

    getHomeRoute() {
        return `/${this.language}/`
    }

    getLoginRoute() {
        return `/${this.language}${Routes.AUTHZ_LOGIN}`
    }

    getLogoutRoute() {
        return `/${this.language}${Routes.AUTHZ_LOGOUT}`
    }

    getSettingsRoute() {
        return `/${this.language}${Routes.SETTINGS}`
    }

    /**Payments */
    getPaymentsRoute() {
        return `/${this.language}${Routes.PAYMENTS}`
    }

    getPaymentsPricingRoute() {
        return `/${this.language}${Routes.PAYMENTS_PRICING}`
    }

    getPaymentsAccountsRoute() {
        return `/${this.language}${Routes.PAYMENTS_ACCOUNTS}`
    }

    getBrainstormRoute() {
        return `/${this.language}${Routes.BRAINSTORM}`
    }

    getTemplateRoute(templateId: string) {
        return `/${this.language}${Routes.TEMPLATES}/${templateId}`
    }
    getProjectsRoute() {
        return `/${this.language}${Routes.PROJECTS}`
    }

    /**
     * Project
     */
    getProjectsNewRoute() {
        return `/${this.language}${Routes.PROJECTS_NEW}`
    }

    getProjectRoute(projectId: string,) {
        return `/${this.language}${Routes.PROJECTS}/${projectId}`
    }

    /**
     * Project Pages
     */
    getProjectPageRoute(projectId: string, pageId: string,) {
        return `/${this.language}${Routes.PROJECTS}/${projectId}/page/${pageId}`
    }

    getProjectPageSettingsRoute(projectId: string, pageId: string,) {
        return `/${this.language}${Routes.PROJECTS}/${projectId}/page/${pageId}/settings`
    }

    getProjectPageTemplatesRoute(projectId: string,) {
        return `/${this.language}${Routes.PROJECTS}/${projectId}/page/create`
    }

    getProjectSettingsRoute(projectId: string,) {
        return `/${this.language}${Routes.PROJECTS}/${projectId}/settings`
    }

    getProjectProductsRoute(projectId: string,) {
        return `/${this.language}${Routes.PROJECTS}/${projectId}/products`
    }

    getProjectOrdersRoute(projectId: string,) {
        return `/${this.language}${Routes.PROJECTS}/${projectId}/orders`
    }

    getProjectContactsRoute(projectId: string,) {
        return `/${this.language}${Routes.PROJECTS}/${projectId}/contacts`
    }

    getProjectThemeRoute(projectId: string,) {
        return `/${this.language}${Routes.PROJECTS}/${projectId}/theme`
    }

    getProjectContentsRoute(projectId: string,) {
        return `/${this.language}${Routes.PROJECTS}/${projectId}/contents`
    }
}

export const appRoutes = new AppRoutes(getCurrentLanguage())

const routes: RouteObject[] = [
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
    {
        path: Routes.PROJECT_PAGE_SETTINGS,
        element: (
            <ProtectedRoute>
                <RouteProjectProvider>
                    <RouteProjectPageSettings />
                </RouteProjectProvider>
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
        path: Routes.PROJECT_PRODUCTS,
        element: (
            <ProtectedRoute>
                <RouteProjectProvider>
                    <RouteProjectProducts />
                </RouteProjectProvider>
            </ProtectedRoute>
        ),
    },
    {
        path: Routes.PROJECT_ORDERS,
        element: (
            <ProtectedRoute>
                <RouteProjectProvider>
                    <RouteProjectSettingsOrders />
                </RouteProjectProvider>
            </ProtectedRoute>
        ),
    },
    {
        path: Routes.PROJECT_CONTENTS,
        element: (
            <ProtectedRoute>
                <RouteProjectProvider>
                    <RouteProjectSettingsContent />
                </RouteProjectProvider>
            </ProtectedRoute>
        ),
    },
    {
        path: Routes.PROJECT_THEME,
        element: (
            <ProtectedRoute>
                <RouteProjectProvider>
                    <RouteProjectSettingsTheme />
                </RouteProjectProvider>
            </ProtectedRoute>
        ),
    },
    {
        path: Routes.PROJECT_CONTACTS,
        element: (
            <ProtectedRoute>
                <RouteProjectProvider>
                    <RouteProjectSettingsMailList />
                </RouteProjectProvider>
            </ProtectedRoute>
        ),
    },
]

const languageRoutes = Object.values(ResourceStringLanguage).map(language => {
    return routes.map(route => {
        return {
            ...route,
            path: `/${language}${route.path}`,
        } as RouteObject
    })
}).flat()

const router = createBrowserRouter(
    [
        ...routes,
        ...languageRoutes,
    ]
);

export default router
