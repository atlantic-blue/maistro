import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Button from "../Gallery/Components/Button/Button";
import { appRoutes } from "../../Routes/router";

const AuthLoginButton = () => {
    const { loginWithRedirect, isAuthenticated, isLoading, loginWithPopup } = useAuth0();

    if (isLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    if (isAuthenticated) {
        return null
    }

    return (
        <Button
            onClick={() => loginWithRedirect({ appState: { returnTo: appRoutes.getProjectsRoute() } })}
        >
            Log In
        </Button>
    );
};

export default AuthLoginButton;
