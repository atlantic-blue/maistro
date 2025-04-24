import React from "react"
import { Navigate } from "react-router"

import { AuthContext } from "@maistro/auth";
import { appRoutes } from "./appRoutes";

interface ProtectedRouteProps {
    children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
    const { isAuthenticated, isLoading, error } = React.useContext(AuthContext)

    if (!isAuthenticated && !isLoading) {
        return <Navigate to={appRoutes.getLoginRoute()} />
    }

    if (isLoading) {
        return (
            <div>
                Loading User....
            </div>
        )
    }

    return (
        <>
            {props.children}
        </>
    )
}

export default ProtectedRoute
