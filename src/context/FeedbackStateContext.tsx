import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';

export type FeedbackStateKind =
  | "loading"
  | "empty"
  | "empty_filtered"
  | "forbidden"
  | "not_found"
  | "network_error"
  | "unexpected_error";

export type FeedbackScope =
  | "dashboard"
  | "incidents"
  | "incident-room"
  | "resolved-record"
  | "postmortem"
  | "services"
  | "team"
  | "settings";

export interface FeedbackState {
  isActive: boolean;
  kind: FeedbackStateKind;
  isFrontendPreview: boolean;
  retry: () => void;
}

interface FeedbackStateContextProps {
  getFeedbackState: (scope: FeedbackScope) => FeedbackState | null;
  resetPreview: (scope?: FeedbackScope) => void;
  isProduction: boolean;
}

const FeedbackStateContext = createContext<FeedbackStateContextProps | undefined>(undefined);

interface FeedbackStateProviderProps {
  children: ReactNode;
}

export function FeedbackStateProvider({ children }: FeedbackStateProviderProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [overrides, setOverrides] = useState<Record<FeedbackScope, FeedbackStateKind | null>>({
    dashboard: null,
    incidents: null,
    "incident-room": null,
    "resolved-record": null,
    postmortem: null,
    services: null,
    team: null,
    settings: null,
  });

  const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';

  // Reset local overrides whenever URL preview params change
  const rawState = searchParams.get('previewUiState');
  const rawScope = searchParams.get('previewUiScope');

  useEffect(() => {
    setOverrides({
      dashboard: null,
      incidents: null,
      "incident-room": null,
      "resolved-record": null,
      postmortem: null,
      services: null,
      team: null,
      settings: null,
    });
  }, [rawState, rawScope]);

  const getFeedbackState = (scope: FeedbackScope): FeedbackState | null => {
    if (isProduction) return null;

    // Local override has highest priority
    const overrideState = overrides[scope];
    if (overrideState) {
      return {
        isActive: true,
        kind: overrideState,
        isFrontendPreview: true,
        retry: () => {},
      };
    }

    if (rawScope !== scope) return null;

    let kind: FeedbackStateKind | null = null;
    if (rawState === 'loading') kind = 'loading';
    else if (rawState === 'empty') kind = 'empty';
    else if (rawState === 'empty-filtered') kind = 'empty_filtered';
    else if (rawState === 'forbidden') kind = 'forbidden';
    else if (rawState === 'not-found') kind = 'not_found';
    else if (rawState === 'network-error') kind = 'network_error';
    else if (rawState === 'unexpected-error') kind = 'unexpected_error';

    if (!kind) return null;

    return {
      isActive: true,
      kind,
      isFrontendPreview: true,
      retry: () => {
        if (kind === 'network_error') {
          setOverrides(prev => ({ ...prev, [scope]: 'loading' }));
        }
      },
    };
  };

  const resetPreview = (scope?: FeedbackScope) => {
    if (scope) {
      setOverrides(prev => ({ ...prev, [scope]: null }));
    } else {
      setOverrides({
        dashboard: null,
        incidents: null,
        "incident-room": null,
        "resolved-record": null,
        postmortem: null,
        services: null,
        team: null,
        settings: null,
      });
    }

    if (!isProduction && (searchParams.has('previewUiState') || searchParams.has('previewUiScope'))) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('previewUiState');
      nextParams.delete('previewUiScope');
      setSearchParams(nextParams);
    }
  };

  return (
    <FeedbackStateContext.Provider
      value={{
        getFeedbackState,
        resetPreview,
        isProduction,
      }}
    >
      {children}
    </FeedbackStateContext.Provider>
  );
}

export function useFeedbackState() {
  const context = useContext(FeedbackStateContext);
  if (context === undefined) {
    throw new Error('useFeedbackState must be used within a FeedbackStateProvider');
  }
  return context;
}
