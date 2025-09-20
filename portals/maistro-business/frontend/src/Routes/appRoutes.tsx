/* eslint-disable */
export enum Routes {
  HOME = '/*',

  BUSINESS = '/b/:businessId',

  SETTINGS = '/settings',

  AUTHZ_LOGIN = '/login',
  AUTHZ_LOGOUT = '/logout',
  AUTH_CALLBACK = '/callback',
}

class AppRoutes {
  getHomeRoute() {
    return `/`;
  }

  getBusiness(businessId: string) {
    return `/b/${businessId}`;
  }

  getLoginRoute() {
    return `${Routes.AUTHZ_LOGIN}`;
  }

  getLogoutRoute() {
    return `${Routes.AUTHZ_LOGOUT}`;
  }

  getSettings() {
    return `${Routes.SETTINGS}`;
  }
}

export const appRoutes = new AppRoutes();
