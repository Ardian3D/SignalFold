import { Component, ReactNode, ErrorInfo } from 'react';
import { ErrorStateView } from './RouteFeedbackState';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Route-level Error Boundary to catch unexpected rendering errors
 * on authenticated dashboard and incident pages.
 */
export class RouteErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In development, log sanitized technical information to console
    if (import.meta.env.DEV) {
      console.error('[RouteErrorBoundary] Caught unexpected layout error:', error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <ErrorStateView
          kind="unexpected_error"
          errorCode="UNKNOWN"
          onRetry={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}
