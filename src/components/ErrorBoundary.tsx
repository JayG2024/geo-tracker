import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
  errorId: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log to Sentry if available
    if (window.Sentry) {
      window.Sentry.withScope((scope) => {
        scope.setTag('errorBoundary', true);
        scope.setContext('errorInfo', errorInfo);
        scope.setLevel('error');
        const eventId = window.Sentry.captureException(error);
        this.setState({ errorId: eventId });
      });
    }

    // Also log to console with full details
    console.group(`🚨 Error Boundary Caught Error [${this.state.errorId}]`);
    console.error('Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Error Stack:', error.stack);
    console.groupEnd();

    this.setState({
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorId } = this.state;
      const isDevelopment = import.meta.env.DEV;

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-xl shadow-xl p-8 border border-red-100">
              {/* Header */}
              <div className="flex items-center mb-6">
                <div className="bg-red-100 p-3 rounded-lg mr-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Oops! Something went wrong</h1>
                  <p className="text-gray-600 mt-1">We encountered an unexpected error</p>
                </div>
              </div>

              {/* Error ID */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">
                  Error ID: <code className="bg-gray-200 px-2 py-1 rounded text-xs">{errorId}</code>
                </p>
                {window.Sentry && (
                  <p className="text-xs text-gray-500 mt-1">
                    This error has been automatically reported to our team
                  </p>
                )}
              </div>

              {/* Error Details (Development Only) */}
              {isDevelopment && error && (
                <div className="mb-6">
                  <details className="group">
                    <summary className="cursor-pointer flex items-center text-sm text-gray-600 hover:text-gray-900">
                      <Bug className="w-4 h-4 mr-2" />
                      <span>Show error details (Development only)</span>
                    </summary>
                    <div className="mt-4 space-y-4">
                      {/* Error Message */}
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="font-semibold text-red-900 mb-2">Error Message:</h3>
                        <pre className="text-sm text-red-800 whitespace-pre-wrap font-mono">
                          {error.toString()}
                        </pre>
                      </div>

                      {/* Stack Trace */}
                      {error.stack && (
                        <div className="bg-gray-100 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">Stack Trace:</h3>
                          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono overflow-x-auto">
                            {error.stack}
                          </pre>
                        </div>
                      )}

                      {/* Component Stack */}
                      {errorInfo && errorInfo.componentStack && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h3 className="font-semibold text-blue-900 mb-2">Component Stack:</h3>
                          <pre className="text-xs text-blue-800 whitespace-pre-wrap font-mono overflow-x-auto">
                            {errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Again
                </button>
                
                <button
                  onClick={this.handleReload}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Reload Page
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Go Home
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  If this problem persists, please contact support with the error ID above
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;