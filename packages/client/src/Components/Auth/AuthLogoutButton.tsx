import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Button from "../Gallery/Components/Button/Button";

const AuthLogoutButton = () => {
    const { logout } = useAuth0();

    return (
        <Button
            onClick={() => logout()}
        >
            Log out
        </Button>
    );
};

export default AuthLogoutButton;
