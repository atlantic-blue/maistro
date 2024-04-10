import React from "react"
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { appRoutes } from "../../router";

interface ProtectedRouteProps {
    children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
    const { isAuthenticated, isLoading } = useAuth0();

    const isLoggedIn = !isLoading && isAuthenticated

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    if (!isLoggedIn) {
        return <Navigate to={appRoutes.getLoginRoute()} />
    }

    return (
        <>
            {props.children}
        </>
    )
}

export default ProtectedRoute
