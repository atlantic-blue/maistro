/* eslint-disable */
export enum Routes {
  HOME = '/*',
  COURSES = '/courses',
  ANALYTICS = '/analytics',
  SETTINGS = '/settings',

  AUTHZ_LOGIN = '/login',
  AUTHZ_LOGOUT = '/logout',
  AUTH_CALLBACK = '/callback',

  USER_SETTINGS = '/user/settings',
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

  getCourses() {
    return `${Routes.COURSES}`;
  }

  getAnalytics() {
    return `${Routes.ANALYTICS}`;
  }

  getSettings() {
    return `${Routes.SETTINGS}`;
  }

  getUserSettings() {
    return `${Routes.USER_SETTINGS}`;
  }
}

export const appRoutes = new AppRoutes();
