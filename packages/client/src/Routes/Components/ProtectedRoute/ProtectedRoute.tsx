import React from "react"
import { Navigate } from "react-router-dom";

import { appRoutes } from "../../router";
import { AuthContext } from "../../../Auth/AuthProvider";

interface ProtectedRouteProps {
    children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
    const { isAuthenticated, isLoading, error } = React.useContext(AuthContext)

    if (isLoading) {
        return (
            <div>
                Loading....
            </div>
        )
    }


    if (!isAuthenticated) {
        return (
            <Navigate to={appRoutes.getLoginRoute()} />
        )
    }

    return (
        <>
            {props.children}
        </>
    )
}

export default ProtectedRoute
