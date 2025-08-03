import React from "react"
import getAuthzTokens, { GetAuthzTokensOutput, GrantTypeCode } from "./Api/Authz/getTokens"
import { User } from "./Store/User"
import { UserStorage } from "./Store/utils/LocalStorage"

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

interface LogInArgs {
    logInUrl: string
    clientId: string
    callbackUrl: string
    returnUrl?: string
}

const logIn = async ({
    logInUrl,
    clientId,
    callbackUrl,
    returnUrl,
}: LogInArgs) => {
    const url = new URL(logInUrl)
    url.searchParams.append("response_type", "code")
    url.searchParams.append("client_id", clientId)
    url.searchParams.append("redirect_uri", callbackUrl)

    // Add state parameter with return URL
    const originalUrl = returnUrl || window.location.pathname + window.location.search;
    const state = btoa(JSON.stringify({ 
        returnUrl: originalUrl,
        timestamp: Date.now()
    }));
    
    url.searchParams.append("state", state);

    window.location.href = url.toString()
}


interface LogoutArgs {
    logOutUrl: string
    clientId: string
    callbackUrl: string
}

const logOut = async ({
    logOutUrl,
    clientId,
    callbackUrl,
}: LogoutArgs) => {
    const url = new URL(logOutUrl)
    url.searchParams.append("response_type", "code")
    url.searchParams.append("client_id", clientId)
    url.searchParams.append("redirect_uri", callbackUrl)

    window.location.href = url.toString()
}

interface GetSessionUserFromCallbackUrlArgs {
    baseUrl: string 
    callbackUrl: string
    clientId: string
    clientSecret: string
    authCallbackPath: string
}

const getSessionUserFromCallbackUrl = async ({
    baseUrl, 
    callbackUrl,
    clientId,
    clientSecret,
    authCallbackPath,
}: GetSessionUserFromCallbackUrlArgs): Promise<[GetAuthzTokensOutput | null, Error | null]> => {
    try {
        if (!window.location.pathname.includes(authCallbackPath)) {
            return [null, null]
        }

        const code = new URLSearchParams(window.location.search).get("code")
        if (!code) {
            // TODO format errors
            return [null, new Error(`AUTH | no params 'code' found in ${window.location.pathname}`)]
        }

        const response = await getAuthzTokens({
            url: `${baseUrl}/oauth2/token`,
            redirectUrl: callbackUrl,
            code,
            grantType: GrantTypeCode.authorization_code,
            clientId: clientId,
            clientSecret: clientSecret
        })

        if (!response || !response.accessToken || !response.idToken) {
            // TODO format errors
            return [null, new Error(`AUTH | invalid response: ${JSON.stringify(response)}`)]
        }

        return [response, null]
    } catch (error: any) {

        return [null, error]
    }
}

interface AuthProps {
    children: React.ReactNode
    baseUrl: string
    callbackUrl: string
    clientId: string
    clientSecret: string
    logInUrl: string
    logOutUrl: string
    authCallbackPath: string
}

export const AuthProvider: React.FC<AuthProps> = ({
    children,
    baseUrl,
    callbackUrl,
    clientId,
    clientSecret,
    logInUrl,
    logOutUrl,
    authCallbackPath,
}) => {
    const [error, setError] = React.useState<Error | null>(null)
    const [user, setUser] = React.useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true)
    const [isLoggedOut, setIsLoggedOut] = React.useState(false)

    const setSession = async () => {
        return getSessionUserFromCallbackUrl({
            baseUrl,
            callbackUrl,
            clientId,
            clientSecret,
            authCallbackPath,
        })
            .then(([tokenOutput, e]) => {
                setIsLoading(false)
                if (e) {
                    // TODO format errors
                    // TODO APP LEVEL ERROR what to do when there is an auth level error? 
                    // do we redirect?
                    console.error(e)
                    setError(e)
                }

                if(!tokenOutput || !tokenOutput.accessToken || !tokenOutput.idToken) {
                    return 
                }
                const user = new User()
                user.setTokenAccess(tokenOutput.accessToken)
                user.setTokenId(tokenOutput.idToken)
                setUser(user)
                setIsAuthenticated(true)
                UserStorage.set(user.getUserStruct())
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
        setIsLoading(false)
    }, [])

    return (
        <>
            <AuthContext.Provider value={{
                logIn: async () => {
                    await logIn({
                        callbackUrl,
                        clientId,
                        logInUrl,
                    })
                },
                logOut: async () => {
                    setUser(null)
                    setIsAuthenticated(false)
                    setIsLoggedOut(true)
                    await logOut({
                        callbackUrl,
                        clientId,
                        logOutUrl
                    })
                },

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
