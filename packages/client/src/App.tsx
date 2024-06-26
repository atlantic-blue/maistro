import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Theme } from '@radix-ui/themes';

import Projects from './Projects'
import AuthProvider from './Auth/AuthProvider';
import ApiProvider from './Api/ApiProvider';
import PaymentsProvider from './Payments/PaymentsProvider';

const queryClient = new QueryClient()

const App: React.FC = () => {

    return (
        <Theme accentColor="amber" grayColor="mauve">
            <ApiProvider>
                <AuthProvider>
                    <PaymentsProvider>
                        <QueryClientProvider client={queryClient}>
                                <Projects />
                        </QueryClientProvider>
                    </PaymentsProvider>
                </AuthProvider>
            </ApiProvider>
        </Theme>
    )
}

export default App
