/* eslint-disable */
export enum Routes {
  HOME = '/*',
  AUTHZ_LOGIN = '/login',
  AUTHZ_LOGOUT = '/logout',
  AUTH_CALLBACK = '/callback',
}

class AppRoutes {
  getHomeRoute() {
    return `/`;
  }

  getLoginRoute() {
    return `${Routes.AUTHZ_LOGIN}`;
  }

  getLogoutRoute() {
    return `${Routes.AUTHZ_LOGOUT}`;
  }
}

export const appRoutes = new AppRoutes();
