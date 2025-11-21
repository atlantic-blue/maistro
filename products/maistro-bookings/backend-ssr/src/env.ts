interface Env {
  isBrowser: () => boolean;
  api: {
    onboarding: string;
    me: string;
    meProfile: string;
    businessMe: string;
    businessBySlug: (slug: string) => string;
    businessById: (id: string) => string;
    businesses: string
  };
  auth: {
    baseUrl: string;
    logInUrl: string;
    logOutUrl: string;
    callbackUrl: string;
    clientId: string;
    clientSecret: string;
  };
  appOrigin: string;
}

const isBrowser = () => typeof window !== "undefined";

const createEnv = (): Env => {
  const authBaseUrl = process.env.AUTH_DOMAIN || "";
  const businessesBaseUrl =
    "https://maistro-platform-businesses-api-production.maistroapp.com/v1";
  const usersBaseUrl =
    "https://maistro-platform-users-api-production.maistro.website/v1";
  const business = "https://";

  const appOrigin = isBrowser()
    ? window.location.origin
    : (process.env.APP_ORIGIN ?? "");

  return {
    isBrowser,
    api: {
      me: `${usersBaseUrl}/me`,
      meProfile: `${usersBaseUrl}/me/profile`,

      businesses: `${businessesBaseUrl}/businesses`,
      onboarding: `${businessesBaseUrl}/businesses/onboarding`,
      businessMe: `${businessesBaseUrl}/businesses/me/profile`,
      businessBySlug: (slug: string) =>
        `${businessesBaseUrl}/businesses/slug/${slug}/profile`,
      businessById: (id: string) =>
        `${businessesBaseUrl}/businesses/id/${id}/profile`,
    },

    auth: {
      baseUrl: authBaseUrl,
      logInUrl: `${authBaseUrl}/login`,
      logOutUrl: `${authBaseUrl}/logout`,
      callbackUrl: `${appOrigin}/callback/`,
      clientId: process.env.AUTH_CLIENT_ID || "",
      clientSecret: process.env.AUTH_CLIENT_SECRET || "",
    },
    appOrigin,
  };
};

const env = createEnv();

export default env;
