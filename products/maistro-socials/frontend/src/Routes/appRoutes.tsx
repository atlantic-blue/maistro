export enum Routes {
    HOME = '/*',
    SOCIALS = '/socials',
    TEMPLATES = '/templates',
    ANALYTICS = '/analytics',
    SETTINGS = '/settings',
  
    AUTHZ_LOGIN = "/login",
    AUTHZ_LOGOUT = "/logout",
    AUTH_CALLBACK = "/callback",

    USER_SETTINGS = "/user/settings"
  }
  
  class AppRoutes {
    getHomeRoute() {
      return `/`
    }
  
    getLoginRoute() {
      return `${Routes.AUTHZ_LOGIN}`
    }
  
    getLogoutRoute() {
        return `${Routes.AUTHZ_LOGOUT}`
    }
  
    getSocials() {
      return `${Routes.SOCIALS}`
    }

    getTemplates() {
      return `${Routes.TEMPLATES}`
    }

    getAnalytics() {
      return `${Routes.ANALYTICS}`
    }

    getSettings() {
      return `${Routes.SETTINGS}`
    }

    getUserSettings() {
      return `${Routes.USER_SETTINGS}`
    }
  }
  
export const appRoutes = new AppRoutes()
  