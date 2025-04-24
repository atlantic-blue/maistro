/* eslint-disable */
import React from 'react';
import { Route, Routes as ReactRoutes } from 'react-router';
import {AuthProvider} from '@maistro/auth';
import Login from './Login';
import RedirectRoute from './RedirectRoute';
import Helmet from '../Components/Helmet';
import { appRoutes, Routes } from './appRoutes';
import env from '../env';

const Router: React.FC = () => {
  return (
    <AuthProvider
      {...env.auth}
      authCallbackPath={Routes.AUTH_CALLBACK}
      >
      <ReactRoutes>      
        <Route path={Routes.HOME}
            element={  
              <Helmet>
                <div>Hello World!</div>
                </Helmet>        
            }  
          />
        <Route path={Routes.AUTH_CALLBACK} element={
            <RedirectRoute navigateTo={appRoutes.getHomeRoute()}>
            <div>Hello World!</div>
            </RedirectRoute>
            } />
        <Route path={Routes.AUTHZ_LOGIN} element={
            <Login />
          } />
        </ReactRoutes>
    </AuthProvider>
  );
};

export {
  Router as default,
  appRoutes,
  Routes,
};
