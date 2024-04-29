import React from "react";

import { AuthContext } from "./AuthProvider";
import Button from "../Templates/Components/Button/Button";

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
