import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';

export type ConnectionStatus = 'connected' | 'offline' | 'reconnecting' | 'restored';

export interface ConnectionMetadata {
  status: ConnectionStatus;
  retryAvailable: boolean;
  attemptNumber: number;
  snapshotRefreshRequired: boolean;
  isFrontendPreview: boolean;
  isDismissed: boolean;
}

interface ConnectionContextProps extends ConnectionMetadata {
  dismiss: () => void;
  retryConnection: () => void;
  resetPreview: () => void;
}

const ConnectionContext = createContext<ConnectionContextProps | undefined>(undefined);

interface ConnectionProviderProps {
  children: ReactNode;
}

export function ConnectionProvider({ children }: ConnectionProviderProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localOverride, setLocalOverride] = useState<ConnectionStatus | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [attemptNumber, setAttemptNumber] = useState(1);

  const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';

  // Read URL parameter in development or mock mode
  const rawParam = searchParams.get('previewConnection');
  const urlParam =
    !isProduction &&
    (rawParam === 'offline' || rawParam === 'reconnecting' || rawParam === 'restored')
      ? (rawParam as ConnectionStatus)
      : null;

  // Determine current effective status
  const status: ConnectionStatus = localOverride || urlParam || 'connected';

  // Reset local override and dismiss state when URL param changes
  useEffect(() => {
    setLocalOverride(null);
    setIsDismissed(false);
    setAttemptNumber(1);
  }, [urlParam]);

  // Reset isDismissed whenever the final effective status changes
  useEffect(() => {
    setIsDismissed(false);
  }, [status]);

  const isFrontendPreview = urlParam !== null || localOverride !== null;

  const retryAvailable = status === 'offline';
  const snapshotRefreshRequired = status === 'restored' || status === 'reconnecting';

  const dismiss = () => {
    setIsDismissed(true);
  };

  const retryConnection = () => {
    if (status === 'offline') {
      // In mock mode, change local status override to reconnecting
      if (isFrontendPreview) {
        setLocalOverride('reconnecting');
        setAttemptNumber((prev) => prev + 1);
      }
    }
  };

  const resetPreview = () => {
    setLocalOverride(null);
    setIsDismissed(false);
    setAttemptNumber(1);
    if (!isProduction && searchParams.has('previewConnection')) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('previewConnection');
      setSearchParams(nextParams);
    }
  };

  return (
    <ConnectionContext.Provider
      value={{
        status,
        retryAvailable,
        attemptNumber,
        snapshotRefreshRequired,
        isFrontendPreview,
        isDismissed,
        dismiss,
        retryConnection,
        resetPreview,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return context;
}
