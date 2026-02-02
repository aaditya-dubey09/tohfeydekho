import React from 'react';
import ReactGA from 'react-ga4';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    ReactGA.event('exception', {
      description: `Error: ${error.message} | Component: ${errorInfo.componentStack.split('\n')[1]}`,
      fatal: true // true if the whole page/app crashed
    });

    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="text-6xl">😕</div>
            <h1 className="text-3xl font-bold">Oops! Something went wrong</h1>
            <p className="text-gray-600">
              We're sorry for the inconvenience. Our team has been notified and is working on a fix.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800"
              >
                Go Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 border-2 border-black rounded-xl font-bold hover:bg-black hover:text-white"
              >
                Reload Page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer font-semibold">Error Details (Dev Only)</summary>
                <pre className="mt-4 p-4 bg-red-50 rounded-lg text-xs overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
