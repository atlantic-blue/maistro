import React from "react";

import Button from "../Gallery/Components/Button/Button";
import { AuthContext } from "../../Auth/AuthProvider";

const AuthLoginButton = () => {
    const { logIn, isAuthenticated } = React.useContext(AuthContext)

    if (isAuthenticated) {
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

export default AuthLoginButton;
