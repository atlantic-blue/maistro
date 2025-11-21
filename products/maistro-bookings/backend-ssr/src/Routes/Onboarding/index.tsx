import React from "react";
import { AuthContext } from "@maistro/auth";
import env from "../../env";
import { MaistroOnboarding } from "@maistro/ui";

interface OnboardingProps {
  language: "en" | "es" | "fr";
}

const Onboarding: React.FC<OnboardingProps> = (props): React.ReactNode => {
  const { isAuthenticated, isLoading, user } = React.useContext(AuthContext);

  if (!user) {
    return null
  }

  return (
    <MaistroOnboarding
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      language="es"
      onboardingUrl={env.api.onboarding}
      token={user?.getTokenAccess()}
    />
  )
};

export default Onboarding;
