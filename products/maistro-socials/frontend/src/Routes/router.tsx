/* eslint-disable */
import React from 'react';
import { Route, Routes as ReactRoutes } from 'react-router';
import { AuthCallback, AuthProvider, Login, ProtectedRoute } from '@maistro/auth';

import env from '../env';
import Helmet from '../Components/Helmet';

import { appRoutes, Routes } from './appRoutes';

const Router: React.FC = () => {
  return (
    <AuthProvider authCallbackPath={Routes.AUTH_CALLBACK} {...env.auth}>
      <ReactRoutes>
        <Route
          path={Routes.HOME}
          element={
            <ProtectedRoute>
            <Helmet>
              <div>Hello World!</div>
            </Helmet>
            </ProtectedRoute>
          }
        />
        <Route
          path={Routes.AUTH_CALLBACK}
          element={<AuthCallback />}
        />
        <Route path={Routes.AUTHZ_LOGIN} element={<Login />} />
      </ReactRoutes>
    </AuthProvider>
  );
};

export { Router as default, appRoutes, Routes };
