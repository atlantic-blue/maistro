import { AuthContext } from '@maistro/auth';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

const getReturnUrlFromState = (state: string): string => {
    try {
        const decoded = JSON.parse(atob(state));
        
        // Validate timestamp
        const maxAge = 10 * 60 * 1000; // 10 minutes
        if (Date.now() - decoded.timestamp > maxAge) {
            return '/';
        }

        // Validate return URL is safe
        if (decoded.returnUrl && decoded.returnUrl.startsWith('/')) {
            return decoded.returnUrl;
        }
    } catch (error) {
        console.error('Invalid state parameter:', error);
    }
    
    return '/';
};

export const AuthCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        handleCallback();
    }, []);

    const handleCallback = async () => {
        try {
            const state = searchParams.get('state');
            const error = searchParams.get('error');

            if (error) {
                throw new Error(`Auth error: ${error}`);
            }

            setStatus('success');

            // Get return URL from state parameter
            const returnUrl = state ? getReturnUrlFromState(state) : '/';
            
            // Redirect to original URL after short delay
            setTimeout(() => {
                window.location.href = returnUrl;
            }, 1000);

        } catch (error) {
            console.error('Auth callback error:', error);
            setStatus('error');
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[#FFF8F6] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3366] mx-auto mb-4"></div>
                    <p className="text-gray-600">Completing login...</p>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-[#FFF8F6] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="text-gray-600">Login successful! Redirecting to your destination...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF8F6] flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <p className="text-gray-600 mb-4">Login failed. Please try again.</p>
                <button 
                    onClick={() => window.location.href = '/'}
                    className="bg-[#FF3366] hover:bg-[#D94A6A] text-white px-6 py-2 rounded-lg"
                >
                    Go Home
                </button>
            </div>
        </div>
    );
};
