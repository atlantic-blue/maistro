import React from "react"
import ErrorMessage from "./ErrorMessage";

interface ErrorBoundaryProps {
    children: React.ReactNode
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        // TODO observability logging
        console.log(error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <div>ERROR!</div>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary
