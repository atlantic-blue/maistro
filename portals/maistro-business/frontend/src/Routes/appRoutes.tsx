/* eslint-disable */
export enum Routes {
  HOME = '/*',
  CUSTOMERS = '/customers',
  CUSTOMER = '/customers/:customerId',
  ANALYTICS = '/analytics',
  PLUGINS = '/plugins',
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

  getCustomers() {
    return `${Routes.CUSTOMERS}`;
  }

  getCustomer(customerId: string) {
    return `${Routes.CUSTOMERS}/${customerId}`;
  }

  getAnalytics() {
    return `${Routes.ANALYTICS}`;
  }

  getPlugins() {
    return `${Routes.PLUGINS}`;
  }

  getSettings() {
    return `${Routes.SETTINGS}`;
  }

  getUserSettings() {
    return `${Routes.USER_SETTINGS}`;
  }
}

export const appRoutes = new AppRoutes();
