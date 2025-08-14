/* eslint-disable */
export enum Routes {
  HOME = '/*',

  AUTHZ_LOGIN = '/login',
  AUTHZ_LOGOUT = '/logout',
  AUTH_CALLBACK = '/callback',

  ONBOARDING = '/onboarding',

  BUSINESS_PROFILE = '/b/:businessProfile',

  DASHBOARD = '/dashboard',
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

  getOnboardingRoute() {
    return `${Routes.ONBOARDING}`;
  }

  getBusinessProfile(businessProfile: string) {
    return `/b/${businessProfile}`;
  }

  getDashboard() {
    return `${Routes.DASHBOARD}`;
  }
}

export const appRoutes = new AppRoutes();
