import React from 'react';

import { AuthContext } from '@maistro/auth';
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
  const { isAuthenticated, isLoading, logIn } = React.useContext(AuthContext);

  if (!isAuthenticated && !isLoading) {
    logIn();
    return null;
  }

  if (isLoading) {
    return <div>Loading User....</div>;
  }

  return <>{props.children}</>;
};

export default ProtectedRoute;
