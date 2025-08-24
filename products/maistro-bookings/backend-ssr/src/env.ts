interface Env {
  isBrowser: () => boolean;
  api: {
    onboarding: string;
    me: string;
    meProfile: string;
  };
  auth: {
    baseUrl: string;
    logInUrl: string;
    logOutUrl: string;
    callbackUrl: string;
    clientId: string;
    clientSecret: string;
  };
}

const isBrowser = () => typeof window !== 'undefined';

const createEnv = (): Env => {
  const authBaseUrl = process.env.AUTH_DOMAIN || '';
  const usersBaseUrl = 'https://maistro-platform-users-api-production.maistro.website/v1';
  const appOrigin = isBrowser() ? window.location.origin : process.env.APP_ORIGIN ?? ""

  return {
    isBrowser,
    api: {
      onboarding: `${usersBaseUrl}/onboarding`,
      me: `${usersBaseUrl}/me`,
      meProfile: `${usersBaseUrl}/me/profile`,
    },

    auth: {
      baseUrl: authBaseUrl,
      logInUrl: `${authBaseUrl}/login`,
      logOutUrl: `${authBaseUrl}/logout`,
      callbackUrl: `${appOrigin}/callback/`,
      clientId: process.env.AUTH_CLIENT_ID || '',
      clientSecret: process.env.AUTH_CLIENT_SECRET || '',
    },
  };
};

const env = createEnv()

export default env;
