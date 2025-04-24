import {AuthContext} from "@maistro/auth"
import React from "react"
import { Navigate } from "react-router"
import { appRoutes, Routes } from "./appRoutes"

interface RedirectRouteProps {
    children: React.ReactNode
    navigateTo: string
}

const RedirectRoute: React.FC<RedirectRouteProps> = (props) => {
    const { isAuthenticated, isLoading, error } = React.useContext(AuthContext)

    if (isLoading) {
        return (
            <div>
                Loading User....
            </div>
        )
    }

    if (isAuthenticated && !isLoading) {
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
