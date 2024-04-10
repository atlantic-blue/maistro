import React from "react"
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

interface RedirectRouteProps {
    children: React.ReactNode
    navigateTo: string
}

const RedirectRoute: React.FC<RedirectRouteProps> = (props) => {
    const { isAuthenticated, isLoading } = useAuth0();

    const isLoggedIn = !isLoading && isAuthenticated

    if (isLoading) {
        return (
            // TODO create a loading template
            <div>Loading...</div>
        )
    }

    if (isLoggedIn) {
        return <Navigate to={props.navigateTo} />
    }

    return (
        <>
            {props.children}
        </>
    )
}

export default RedirectRoute
