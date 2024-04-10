import React from 'react'
import { Auth0Provider } from '@auth0/auth0-react';
import { QueryClient, QueryClientProvider } from 'react-query'

import { defaultColorScheme, defaultFontScheme } from './PageContext';
import { appendColourSchemeToDocument, appendFontSchemeToDocument } from './Utils/appendScheme';
import Projects from './Projects'
import env from './env';

const queryClient = new QueryClient()

const App: React.FC = () => {

    React.useEffect(() => {
        appendFontSchemeToDocument(defaultFontScheme)
        appendColourSchemeToDocument(defaultColorScheme)
    }, [])

    return (
        <Auth0Provider
            domain={env.auth.domain}
            clientId={env.auth.clientId}
            authorizationParams={{
                redirect_uri: window.location.origin
            }}
        >
            <QueryClientProvider client={queryClient}>
                <Projects />
            </QueryClientProvider>
        </Auth0Provider>
    )
}

export default App
