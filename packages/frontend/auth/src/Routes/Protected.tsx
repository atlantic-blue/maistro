import React, { useEffect } from 'react';
import { AuthContext } from '../AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
  const { isAuthenticated, isLoading, logIn, logOut, isLoggedOut } = React.useContext(AuthContext);

  useEffect(() => {
    if(isLoading) {
      return 
    }

    if(!isAuthenticated || isLoggedOut) {
      logOut().then(logIn)
    }

  }, [isAuthenticated, isLoading, logIn, logOut, isLoggedOut])

  if (isLoading) {
    return <div>Loading User....</div>;
  }

  return <>{props.children}</>;
};
