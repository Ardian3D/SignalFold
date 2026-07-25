import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';

export type AiOperationKind =
  | "incident_triage"
  | "postmortem_generation";

export type AiOperationState =
  | "idle"
  | "pending"
  | "unavailable"
  | "timeout"
  | "invalid_response"
  | "rate_limited"
  | "retry_ready"
  | "fallback_available";

export interface AiOperationMetadata {
  operation: AiOperationKind;
  state: AiOperationState;
  retryAvailable: boolean;
  fallbackAvailable: boolean;
  timeoutTargetMs: number;
  isFrontendPreview: boolean;
  isDismissed: boolean;
}

interface AiOperationContextProps {
  triage: AiOperationMetadata & {
    dismiss: () => void;
    retry: () => void;
    useFallback: () => void;
    reset: () => void;
  };
  postmortem: AiOperationMetadata & {
    dismiss: () => void;
    retry: () => void;
    reset: () => void;
  };
}

const AiOperationContext = createContext<AiOperationContextProps | undefined>(undefined);

interface AiOperationProviderProps {
  children: ReactNode;
}

export function AiOperationProvider({ children }: AiOperationProviderProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Local overrides
  const [triageOverride, setTriageOverride] = useState<AiOperationState | null>(null);
  const [triageDismissed, setTriageDismissed] = useState(false);

  const [postmortemOverride, setPostmortemOverride] = useState<AiOperationState | null>(null);
  const [postmortemDismissed, setPostmortemDismissed] = useState(false);

  const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';

  // Read URL params
  const previewAiOperation = searchParams.get('previewAiOperation');
  const previewAiState = searchParams.get('previewAiState');

  // Validate and map URL state
  const mapUrlState = (op: AiOperationKind): AiOperationState => {
    if (isProduction) return 'idle';

    const isTargetOp =
      (op === 'incident_triage' && previewAiOperation === 'triage') ||
      (op === 'postmortem_generation' && previewAiOperation === 'postmortem');

    if (!isTargetOp) return 'idle';

    switch (previewAiState) {
      case 'pending':
        return 'pending';
      case 'unavailable':
        return 'unavailable';
      case 'timeout':
        return 'timeout';
      case 'invalid':
        return 'invalid_response';
      case 'rate-limited':
        return 'rate_limited';
      case 'fallback':
        return 'fallback_available';
      default:
        return 'idle';
    }
  };

  const initialTriageState = mapUrlState('incident_triage');
  const initialPostmortemState = mapUrlState('postmortem_generation');

  // Reset local overrides and dismissals when search parameters change
  useEffect(() => {
    setTriageOverride(null);
    setTriageDismissed(false);
  }, [initialTriageState]);

  useEffect(() => {
    setPostmortemOverride(null);
    setPostmortemDismissed(false);
  }, [initialPostmortemState]);

  // Determine current effective states
  const triageState = triageOverride || initialTriageState;
  const postmortemState = postmortemOverride || initialPostmortemState;

  // Reset isDismissed whenever the final effective status changes
  useEffect(() => {
    setTriageDismissed(false);
  }, [triageState]);

  useEffect(() => {
    setPostmortemDismissed(false);
  }, [postmortemState]);

  const triageMetadata: AiOperationMetadata = {
    operation: 'incident_triage',
    state: triageState,
    retryAvailable: ['unavailable', 'timeout', 'invalid_response', 'rate_limited'].includes(triageState),
    fallbackAvailable: ['unavailable', 'timeout', 'invalid_response', 'rate_limited', 'fallback_available'].includes(triageState),
    timeoutTargetMs: 20000,
    isFrontendPreview: triageOverride !== null || initialTriageState !== 'idle',
    isDismissed: triageDismissed,
  };

  const postmortemMetadata: AiOperationMetadata = {
    operation: 'postmortem_generation',
    state: postmortemState,
    retryAvailable: ['unavailable', 'timeout', 'invalid_response', 'rate_limited'].includes(postmortemState),
    fallbackAvailable: false, // For Postmortem, do not provide a cached document because no canonical content exists.
    timeoutTargetMs: 30000,
    isFrontendPreview: postmortemOverride !== null || initialPostmortemState !== 'idle',
    isDismissed: postmortemDismissed,
  };

  const dismissTriage = () => {
    setTriageDismissed(true);
  };

  const retryTriage = () => {
    if (triageMetadata.retryAvailable) {
      setTriageOverride('pending');
    }
  };

  const useFallbackTriage = () => {
    if (triageMetadata.fallbackAvailable) {
      setTriageOverride('fallback_available');
    }
  };

  const resetTriage = () => {
    setTriageOverride(null);
    setTriageDismissed(false);
    if (!isProduction && searchParams.has('previewAiOperation') && searchParams.get('previewAiOperation') === 'triage') {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('previewAiOperation');
      nextParams.delete('previewAiState');
      setSearchParams(nextParams);
    }
  };

  const dismissPostmortem = () => {
    setPostmortemDismissed(true);
  };

  const retryPostmortem = () => {
    if (postmortemMetadata.retryAvailable) {
      setPostmortemOverride('pending');
    }
  };

  const resetPostmortem = () => {
    setPostmortemOverride(null);
    setPostmortemDismissed(false);
    if (!isProduction && searchParams.has('previewAiOperation') && searchParams.get('previewAiOperation') === 'postmortem') {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('previewAiOperation');
      nextParams.delete('previewAiState');
      setSearchParams(nextParams);
    }
  };

  return (
    <AiOperationContext.Provider
      value={{
        triage: {
          ...triageMetadata,
          dismiss: dismissTriage,
          retry: retryTriage,
          useFallback: useFallbackTriage,
          reset: resetTriage,
        },
        postmortem: {
          ...postmortemMetadata,
          dismiss: dismissPostmortem,
          retry: retryPostmortem,
          reset: resetPostmortem,
        },
      }}
    >
      {children}
    </AiOperationContext.Provider>
  );
}

export function useAiOperation() {
  const context = useContext(AiOperationContext);
  if (context === undefined) {
    throw new Error('useAiOperation must be used within an AiOperationProvider');
  }
  return context;
}
