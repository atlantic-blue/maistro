interface Env {
  api: {
    onboarding: string;
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

const createEnv = (): Env => {
  const authBaseUrl = process.env.AUTH_DOMAIN || '';

  return {
    api: {
      onboarding: 'https://maistro-platform-users-api-production.maistro.website/v1/onboarding',
    },

    auth: {
      baseUrl: authBaseUrl,
      logInUrl: `${authBaseUrl}/login`,
      logOutUrl: `${authBaseUrl}/logout`,
      callbackUrl: `${window.location.origin}/callback/`,
      clientId: process.env.AUTH_CLIENT_ID || '',
      clientSecret: process.env.AUTH_CLIENT_SECRET || '',
    },
  };
};

export default createEnv();
