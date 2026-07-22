import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Application Error Boundary for catching unexpected render errors gracefully.
 */
export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <main
          id="main-content"
          role="main"
          className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6"
        >
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-semibold text-slate-100">Application Error</h1>
            <p className="text-sm text-slate-400">
              An unexpected error occurred while rendering the page.
            </p>
            {this.state.error && (
              <div className="text-left bg-slate-950 p-3 rounded text-xs font-mono text-rose-300 overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm font-medium rounded transition-colors focus:ring-2 focus:ring-sky-400"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Return to Foundation Setup
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
