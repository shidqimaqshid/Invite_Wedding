import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    const { children } = this.props;
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-red-100">
            <h2 className="text-2xl font-serif text-red-600 mb-4">Waduh, ada kendala teknis!</h2>
            <p className="text-gray-600 mb-6">
              Terjadi kesalahan saat memuat halaman. Silakan coba segarkan (refresh) halaman ini.
            </p>
            <div className="bg-red-50 p-4 rounded-lg mb-6 overflow-auto max-h-40">
              <code className="text-xs text-red-800">
                {this.state.error?.toString() || 'Script error.'}
              </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Segarkan Halaman
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
