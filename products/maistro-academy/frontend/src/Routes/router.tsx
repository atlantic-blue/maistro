/* eslint-disable */
import React from 'react';
import { Route, Routes as ReactRoutes } from 'react-router';
import { AuthProvider } from '@maistro/auth';

import env from '../env';
import Helmet from '../Components/Helmet';

import Login from './Login';
import RedirectRoute from './RedirectRoute';
import { appRoutes, Routes } from './appRoutes';
import Dashboard from './Dashboard';
import CourseLayout from './CourseLayout';
import ModuleLayout from './ModuleLayout';
import Payments from './Payments';

const Router: React.FC = () => {
  return (
    <AuthProvider authCallbackPath={Routes.AUTH_CALLBACK} {...env.auth}>
      <ReactRoutes>
        <Route
          path="*"
          element={
            <Helmet>
              <ReactRoutes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/courses/:courseId" element={<CourseLayout />} />
                <Route path="/courses/:courseId/:moduleId" element={<ModuleLayout />} />
                <Route path={Routes.PAYMENTS} element={<Payments />} />
              </ReactRoutes>
            </Helmet>
          }
        />

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
