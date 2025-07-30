/* eslint-disable */
import React from 'react';
import { Route, Routes as ReactRoutes } from 'react-router';
import { AuthProvider } from '@maistro/auth';

import env from '../env';

import Login from './Login';
import RedirectRoute from './RedirectRoute';
import { appRoutes, Routes } from './appRoutes';

const Router: React.FC = () => {
  return (
    <AuthProvider authCallbackPath={Routes.AUTH_CALLBACK} {...env.auth}>
      <ReactRoutes>
        <Route path="*" element={<div>HELLO WORLD</div>} />
        <Route
          path={Routes.AUTH_CALLBACK}
          element={
            <RedirectRoute navigateTo={appRoutes.getHomeRoute()}>
              <div>Hello World!</div>
            </RedirectRoute>
          }
        />
        <Route path={Routes.AUTHZ_LOGIN} element={<Login />} />
      </ReactRoutes>
    </AuthProvider>
  );
};

export { Router as default, appRoutes, Routes };
