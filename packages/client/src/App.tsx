import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

import { defaultColorScheme, defaultFontScheme } from './PageContext';
import { appendColourSchemeToDocument, appendFontSchemeToDocument } from './Utils/appendScheme';
import Projects from './Projects'
import AuthProvider from './Auth/AuthProvider';

const queryClient = new QueryClient()

const App: React.FC = () => {

    React.useEffect(() => {
        appendFontSchemeToDocument(defaultFontScheme)
        appendColourSchemeToDocument(defaultColorScheme)
    }, [])

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <Projects />
            </QueryClientProvider>
        </AuthProvider>
    )
}

export default App
