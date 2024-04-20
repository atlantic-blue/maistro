import React from "react";
import { useNavigate } from "react-router-dom";

import Button from "../Components/Gallery/Components/Button/Button";
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
            onClick={() => logOutAndNavigate()}
            className={styles.button}
        >
            Log out
        </Button>
    );
};

export default AuthLogoutButton;
