import React from "react";

import {
    Button
} from "@maistro/ui";
import {AuthContext} from "@maistro/auth";


const Login = () => {
    const { logIn, isAuthenticated, isLoading } = React.useContext(AuthContext)

    if (isAuthenticated) {
        return null
    }

    if(!isAuthenticated && !isLoading) {
        logIn()
        return null
    }

    return (
        <Button
            onClick={() => logIn()}
        >
            Log In
        </Button>
    );
};

export default Login;
