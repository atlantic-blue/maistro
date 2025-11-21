import React from "react";
import { Route, Routes as ReactRoutes } from "react-router";
import {
  AuthCallback,
  AuthProvider,
  Login,
  ProtectedRoute,
} from "@maistro/auth";
import { Theme } from "@maistro/ui";

import env from "../env";

import { appRoutes, Routes } from "./appRoutes";
import Homepage from "./Home";
import BusinessProfilePage from "./BusinessProfile";
import Onboarding from "./Onboarding";

import Dashboard from "./Dahsboard";
import Helmet from "../Components/Helmet";
import MaistroSubscriptionLanding from "./Subscription";
import MaistroEventSep2025 from "./Events/2025-09-27";
import MaistroEventOct2025 from "./Events/2025-10-25";
import BusinessProfilesPage from "./BusinessProfiles";

const Router: React.FC = () => {
  // TODO implement multiple languages
  const language = "es";

  return (
    <Theme
      appearance="light"
      accentColor="crimson"
      grayColor="sand"
      radius="large"
      scaling="100%"
    >
      <AuthProvider authCallbackPath={Routes.AUTH_CALLBACK} {...env.auth}>
        <ReactRoutes>
          <Route path="*" element={<Homepage />} />
          <Route
            path={Routes.BUSINESS_PROFILES}
            element={<BusinessProfilesPage />}
          />
          <Route
            path={Routes.BUSINESS_PROFILE}
            element={<BusinessProfilePage />}
          />
          <Route
            path={Routes.ONBOARDING}
            element={
              <ProtectedRoute>
                <Onboarding language={language} />
              </ProtectedRoute>
            }
          />

          <Route
            path={Routes.DASHBOARD}
            element={
              <ProtectedRoute>
                <Helmet>
                  <Dashboard />
                </Helmet>
              </ProtectedRoute>
            }
          />

          <Route
            path={Routes.BOOKINGS}
            element={
              <ProtectedRoute>
                <Helmet>
                  <div>Proximamente...</div>
                </Helmet>
              </ProtectedRoute>
            }
          />

          <Route
            path={Routes.SUBSCRIPTION}
            element={
              <MaistroSubscriptionLanding />
            }
          />


          <Route
            path={Routes.EVENTS_2025_SEPTEMBER}
            element={
              <MaistroEventSep2025 />
            }
          />

          <Route
            path={Routes.EVENTS_2025_OCTOBER}
            element={
              <MaistroEventOct2025 />
            }
          />

          <Route path={Routes.AUTH_CALLBACK} element={<AuthCallback />} />
          <Route path={Routes.AUTHZ_LOGIN} element={<Login />} />
        </ReactRoutes>
      </AuthProvider>
    </Theme>
  );
};

export { Router as default, appRoutes, Routes };
