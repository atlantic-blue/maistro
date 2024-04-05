import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

import Projects from './Projects'

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Projects />
        </QueryClientProvider>
    )
}

export default App
