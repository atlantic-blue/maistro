import React from 'react';
import { Route, Routes as ReactRoutes } from 'react-router';
import { AuthProvider } from '@maistro/auth';

import env from '../env';

import Login from './Login';
import { appRoutes, Routes } from './appRoutes';
import Homepage from './Home';
import BusinessProfile from './BusinessProfile';
import Onboarding from './Onboarding';
import ProtectedRoute from './ProtectedRoute';
import { AuthCallback } from './AuthCallback';

const Router: React.FC = () => {
  // TODO implement multiple languages
  const language = 'es';

  return (
    <AuthProvider authCallbackPath={Routes.AUTH_CALLBACK} {...env.auth}>
      <ReactRoutes>
        <Route path="*" element={<Homepage />} />
        <Route path="/b/:businessProfile" element={<BusinessProfile />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding language={language} />
            </ProtectedRoute>
          }
        />
        <Route path={Routes.AUTH_CALLBACK} element={<AuthCallback />} />
        <Route path={Routes.AUTHZ_LOGIN} element={<Login />} />
      </ReactRoutes>
    </AuthProvider>
  );
};

export { Router as default, appRoutes, Routes };
