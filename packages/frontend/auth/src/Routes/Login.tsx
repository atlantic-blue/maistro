import React from 'react';

import { AuthContext } from '../AuthContext';

export const Login = () => {
  const { logIn, isAuthenticated, isLoading } = React.useContext(AuthContext);

  if (isAuthenticated) {
    return null;
  }

  if (!isAuthenticated && !isLoading) {
    logIn();
    return null;
  }

  return (
    <button
        className="bg-[#FF3366] hover:bg-[#D94A6A] text-white px-6 py-2 rounded-lg"
        onClick={() => logIn()}
        >
      Log In
    </button>
  )
};

