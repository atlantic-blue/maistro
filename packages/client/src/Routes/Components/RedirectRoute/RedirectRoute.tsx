import React from "react"
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../../Auth/AuthProvider";
import { Routes, appRoutes } from "../../router";

interface RedirectRouteProps {
    children: React.ReactNode
    navigateTo: string
}

const RedirectRoute: React.FC<RedirectRouteProps> = (props) => {
    const { isAuthenticated, isLoading, error } = React.useContext(AuthContext)

    if (isLoading) {
        return (
            <div>
                Loading....
            </div>
        )
    }

    if (isAuthenticated) {
        return <Navigate to={props.navigateTo} />
    }

    if (error && !window.location.pathname.includes(Routes.AUTHZ_LOGIN)) {
        return <Navigate to={appRoutes.getLoginRoute()} />
    }

    return (
        <>
            {props.children}
        </>
    )
}

export default RedirectRoute
