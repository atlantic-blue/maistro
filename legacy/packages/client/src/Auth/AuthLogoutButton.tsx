import React from "react";
import { useNavigate } from "react-router-dom";

import Button from "../Templates/Components/Button/Button";
import { AuthContext } from "./AuthProvider";
import { appRoutes } from "../Routes/router";

import * as styles from "./AuthLogoutButton.scss"

const AuthLogoutButton = () => {
    const navigate = useNavigate()
    const { logOut } = React.useContext(AuthContext)

    const logOutAndNavigate = () => {
        return logOut().then(() => {
            navigate(appRoutes.getHomeRoute())
        })
    }

    return (
        <Button
            size="2"
            variant="outline"
            onClick={() => logOutAndNavigate()}
        >
            Log out
        </Button>
    );
};

export default AuthLogoutButton;
