import React from "react"
import { Navigate } from "react-router-dom";

import { appRoutes } from "../../router";
import { AuthContext } from "../../../Auth/AuthProvider";
import Loading from "../../../Components/Loading/Loading";

interface ProtectedRouteProps {
    children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
    const { isAuthenticated, isLoading, error } = React.useContext(AuthContext)

    if (isLoading) {
        return (
            <Loading>
                Loading User....
            </Loading>
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
