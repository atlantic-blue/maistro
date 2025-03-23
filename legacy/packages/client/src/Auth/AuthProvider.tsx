import React from "react";
import { User } from "../Store/User";
import env from "../env";
import getAuthzTokens, { GrantTypeCode } from "../Api/Authz/getTokens";
import { UserStorage } from "../Store/utils/Storage";
import { Routes } from "../Routes/router";

interface AuthContextState {
    logIn: () => Promise<void>
    logOut: () => Promise<unknown>
    user: User | null,
    error: Error | null,
    isAuthenticated: boolean
    isLoading: boolean
    isLoggedOut: boolean
}

export const AuthContext = React.createContext<AuthContextState>({
    logIn: () => Promise.resolve(),
    logOut: () => Promise.resolve(),
    user: null,
    error: null,
    isAuthenticated: false,
    isLoading: false,
    isLoggedOut: false,
})

const getSessionUserFromCallbackUrl = async (): Promise<[User | null, Error | null]> => {
    try {
        if (!window.location.pathname.includes(Routes.AUTHZ_CALLBACK)) {
            return [null, null]
        }

        const code = new URLSearchParams(window.location.search).get("code")
        if (!code) {
            // TODO format errors
            return [null, new Error(`AUTH | no params 'code' found in ${window.location.pathname}`)]
        }

        const response = await getAuthzTokens({
            url: `${env.auth.baseUrl}/oauth2/token`,
            redirectUrl: env.auth.callbackUrl,
            code,
            grantType: GrantTypeCode.authorization_code,
            clientId: env.auth.clientId,
            clientSecret: env.auth.clientSecret
        })

        if (!response || !response.accessToken || !response.idToken) {
            // TODO format errors
            return [null, new Error(`AUTH | invalid response: ${JSON.stringify(response)}`)]
        }

        const user = new User()

        user.setTokenAccess(response.accessToken)
        user.setTokenId(response.idToken)
        return [user, null]
    } catch (error: any) {

        return [null, error]
    }
}

interface AuthProps {
    children: React.ReactNode
}

const AuthProvider: React.FC<AuthProps> = ({
    children
}) => {
    const [error, setError] = React.useState<Error | null>(null)
    const [user, setUser] = React.useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = React.useState(false)
    const [isLoading, setIsPreparing] = React.useState(true)
    const [isLoggedOut, setIsLoggedOut] = React.useState(false)

    const setSession = async () => {
        return getSessionUserFromCallbackUrl()
            .then(([user, e]) => {
                setIsPreparing(false)
                if (e) {
                    // TODO format errors
                    // TODO APP LEVEL ERROR what to do when there is an auth level error? 
                    // do we redirect?
                    console.error(e)
                    setError(e)
                }
                if (user) {
                    setUser(user)
                    setIsAuthenticated(true)
                    UserStorage.set(user.getUserStruct())
                }
            })
    }

    /**
     * Get user from auth handshake
     */
    React.useEffect(() => {
        setSession()
    }, [])

    /**
     * Get User from localStorage
     */
    React.useEffect(() => {
        const storedUser = new User(UserStorage.get())
        if (storedUser.hasTokenIdExpired()) {
            return
        }

        setUser(storedUser)
        setIsAuthenticated(true)
        setIsPreparing(false)
    }, [])

    const logIn = async () => {
        const url = new URL(env.auth.logInUrl)
        url.searchParams.append("response_type", "code")
        url.searchParams.append("client_id", env.auth.clientId)
        url.searchParams.append("redirect_uri", env.auth.callbackUrl)

        window.location.href = url.toString()
    }

    const logOut = async () => {
        setUser(null)
        setIsAuthenticated(false)
        setIsLoggedOut(true)
        UserStorage.set(new User().getUserStruct())

        const url = new URL(env.auth.logOutUrl)
        url.searchParams.append("response_type", "code")
        url.searchParams.append("client_id", env.auth.clientId)
        url.searchParams.append("redirect_uri", env.auth.callbackUrl)

        window.location.href = url.toString()
    }

    return (
        <>
            <AuthContext.Provider value={{
                logIn,
                logOut,

                user,
                error,

                isAuthenticated,
                isLoading,
                isLoggedOut,
            }}>
                {children}
            </AuthContext.Provider>
        </>
    )
}

export default AuthProvider
