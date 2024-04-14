import React from "react";

import Button from "../Gallery/Components/Button/Button";
import { AuthContext } from "../../Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { appRoutes } from "../../Routes/router";

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
