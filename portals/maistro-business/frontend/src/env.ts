interface Env {
  api: {
    businesses: {
      getBusinesses: string;
      onboarding: string;
      businessBySlug: (slug: string) => string;
      businessById: (id: string) => string;
      postBusinessById: (id: string) => string;
    };
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
  const businessesBaseUrl = 'https://maistro-platform-businesses-api-production.maistroapp.com/v1';

  return {
    api: {
      businesses: {
        getBusinesses: `${businessesBaseUrl}/businesses/me/profile`,
        onboarding: `${businessesBaseUrl}/businesses/onboarding`,
        businessBySlug: (slug: string) => `${businessesBaseUrl}/businesses/slug/${slug}/profile`,
        businessById: (id: string) => `${businessesBaseUrl}/businesses/id/${id}/profile`,
        postBusinessById: (id: string) => `${businessesBaseUrl}//businesses/${id}/profile`
      },
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
