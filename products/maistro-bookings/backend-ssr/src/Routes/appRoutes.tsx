/* eslint-disable */

export enum RouteName {
  HOME = "HOME",
  BUSINESS_PROFILES = "BUSINESS_PROFILES",
  BUSINESS_PROFILE = "BUSINESS_PROFILE",
  SUBSCRIPTION = "SUBSCRIPTION",
}

export enum Routes {
  HOME = "/*",

  AUTHZ_LOGIN = "/login",
  AUTHZ_LOGOUT = "/logout",
  AUTH_CALLBACK = "/callback",

  ONBOARDING = "/onboarding",

  BUSINESS_PROFILES = "/b",

  BUSINESS_PROFILE = "/b/:businessProfile",

  DASHBOARD = "/dashboard",

  BOOKINGS = "/bookings",

  SUBSCRIPTION = "/subscription",

  EVENTS_2025_SEPTEMBER = "/events/2025-09-27",
  EVENTS_2025_OCTOBER = "/events/2025-10-25"
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

  getBusinessProfiles(pagination?: string) {
    return `/b${pagination ? `?pagination=${pagination}` : ""}`;
  }

  getBusinessProfile(businessProfile: string) {
    return `/b/${businessProfile}`;
  }

  getDashboard() {
    return `${Routes.DASHBOARD}`;
  }

  getBookings() {
    return `${Routes.BOOKINGS}`;
  }

  getSubscription() {
    return `${Routes.SUBSCRIPTION}`
  }

  getEvent(eventId: string) {
    return `events/${eventId}`
  }
}

export const appRoutes = new AppRoutes();
