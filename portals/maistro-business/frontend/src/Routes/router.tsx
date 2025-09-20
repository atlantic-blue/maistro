/* eslint-disable */
import React from 'react';
import { Route, Routes as ReactRoutes } from 'react-router';
import { AuthCallback, AuthProvider, Login, ProtectedRoute } from '@maistro/auth';

import env from '../env';
import Helmet from '../Components/Helmet';

import { appRoutes, Routes } from './appRoutes';
import { BusinessesPage } from './Businesses';
import { BusinessProfilePage } from './Business';

const Router: React.FC = () => {
  return (
    <AuthProvider authCallbackPath={Routes.AUTH_CALLBACK} {...env.auth}>
      <ReactRoutes>
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Helmet>
                <ReactRoutes>
                  <Route path={Routes.HOME} element={<BusinessesPage language="es" />} />
                  <Route path={Routes.BUSINESS} element={<BusinessProfilePage language="es" />} />
                </ReactRoutes>
              </Helmet>
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
