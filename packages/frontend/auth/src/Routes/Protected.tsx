import React from 'react';
import { AuthContext } from '../AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
  const { isAuthenticated, isLoading, logIn } = React.useContext(AuthContext);

  if (isLoading) {
    return <div>Loading User....</div>;
  }

  if (!isAuthenticated && !isLoading) {
    logIn();
    return null;
  }

  return <>{props.children}</>;
};
