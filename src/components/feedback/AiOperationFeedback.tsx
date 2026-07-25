import React from 'react';
import { X, RefreshCw, AlertTriangle, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';
import { useAiOperation, AiOperationKind, AiOperationState } from '@/context/AiOperationContext';

interface AiOperationFeedbackProps {
  operation: 'triage' | 'postmortem';
}

export function AiOperationFeedback({ operation }: AiOperationFeedbackProps) {
  const context = useAiOperation();
  const opData = operation === 'triage' ? context.triage : context.postmortem;

  if (opData.state === 'idle' || opData.isDismissed) {
    return null;
  }

  const {
    state,
    retryAvailable,
    fallbackAvailable,
    timeoutTargetMs,
    isFrontendPreview,
    dismiss,
    retry,
  } = opData;

  const isPending = state === 'pending';
  const isFallback = state === 'fallback_available';
  const isErrorState = ['unavailable', 'timeout', 'invalid_response', 'rate_limited'].includes(state);

  // Set accessibility attributes
  const role = isPending || isFallback ? 'status' : 'alert';
  const ariaLive = isPending ? 'polite' : undefined;

  // Visual formatting
  let headerText = '';
  let errorCode: string | null = null;
  let descriptionText = '';
  let statusText = '';

  const metadataList: { label: string; value: string; isHighlighted?: boolean }[] = [];

  if (isPending) {
    headerText = operation === 'triage' ? 'AI TRIAGE REQUEST IN PROGRESS' : 'POSTMORTEM DRAFT REQUEST IN PROGRESS';
    descriptionText = 'SignalFold is waiting for a structured AI response. The incident and existing human-authored data remain available throughout this operation.';
    statusText = 'NO REAL REQUEST EXISTS';

    metadataList.push(
      { label: 'PROVIDER', value: 'DEEPSEEK' },
      { label: 'MODEL TARGET', value: 'DEEPSEEK-V4-FLASH' },
      { label: 'OPERATION', value: opData.operation.toUpperCase() },
      { label: 'CONNECTION', value: 'FRONTEND PREVIEW' },
      { label: 'RESULT', value: 'NOT AVAILABLE' },
      { label: 'AUTHORITY', value: 'NO INCIDENT MUTATION' },
      { label: 'TIMEOUT TARGET', value: operation === 'triage' ? 'APPROXIMATELY 20 SECONDS' : 'APPROXIMATELY 30 SECONDS' }
    );
  } else if (state === 'unavailable') {
    headerText = 'AI SERVICE UNAVAILABLE';
    errorCode = 'AI_UNAVAILABLE';
    descriptionText = 'DeepSeek cannot currently be reached. The incident remains available and all manual response workflows continue to work.';
    
    metadataList.push(
      { label: 'INCIDENT RECORD', value: 'PRESERVED' },
      { label: 'MANUAL WORKFLOW', value: 'AVAILABLE' },
      { label: 'AI RESULT', value: 'NOT CREATED' },
      { label: 'RETRY', value: 'AVAILABLE AS FRONTEND PREVIEW' }
    );

    if (operation === 'postmortem') {
      metadataList.push(
        { label: 'APPROVED POSTMORTEM', value: 'UNCHANGED' },
        { label: 'DOCUMENT CONTENT', value: 'NOT GENERATED' }
      );
    }
  } else if (state === 'timeout') {
    headerText = 'AI REQUEST TIMED OUT';
    errorCode = 'AI_TIMEOUT';
    descriptionText = operation === 'triage'
      ? 'No structured triage response was received within the expected operation window.'
      : 'No structured Postmortem draft was received within the expected operation window.';

    metadataList.push(
      { label: 'SOURCE RECORD', value: 'PRESERVED' },
      { label: 'PARTIAL RESULT', value: 'DISCARDED' },
      { label: 'INCIDENT OR POSTMORTEM STATE', value: 'UNCHANGED' },
      { label: 'RETRY', value: 'AVAILABLE' }
    );
  } else if (state === 'invalid_response') {
    headerText = 'AI RESPONSE COULD NOT BE VALIDATED';
    errorCode = 'AI_INVALID_RESPONSE';
    descriptionText = 'The provider response did not satisfy SignalFold’s required structured-output contract. No AI result has been accepted.';

    metadataList.push(
      { label: 'RAW RESPONSE', value: 'NOT EXPOSED' },
      { label: 'REPAIR ATTEMPT', value: 'BACKEND CONTROLLED' },
      { label: 'ACCEPTED RESULT', value: 'NOT CREATED' },
      { label: 'INCIDENT DATA', value: 'UNCHANGED' }
    );

    if (operation === 'postmortem') {
      metadataList.push(
        { label: 'DOCUMENT CONTENT', value: 'NOT GENERATED' }
      );
    }
  } else if (state === 'rate_limited') {
    headerText = 'AI REQUEST RATE LIMITED';
    errorCode = 'RATE_LIMITED';
    descriptionText = 'The AI provider cannot accept another request yet. Continue the manual workflow or retry later.';

    metadataList.push(
      { label: 'RETRY TIMING', value: 'NOT AVAILABLE' },
      { label: 'MANUAL WORKFLOW', value: 'AVAILABLE' },
      { label: 'CURRENT RECORD', value: 'PRESERVED' }
    );
  } else if (isFallback) {
    headerText = 'CACHED TRIAGE RESULT AVAILABLE';
    descriptionText = 'SignalFold is showing the existing cached demonstration result so the response workflow can continue while DeepSeek is unavailable.';

    metadataList.push(
      { label: 'SOURCE', value: 'FRONTEND DEMO FALLBACK' },
      { label: 'PROVIDER REQUEST', value: 'NOT COMPLETED' },
      { label: 'INCIDENT MUTATION', value: 'NONE' },
      { label: 'HUMAN REVIEW', value: 'REQUIRED' }
    );
  }

  // Restrained colors following PRD specs
  const borderStyle = 'border-[#242522]';
  const bgStyle = 'bg-[#0E0F0D]';
  
  // Theme highlights
  const titleColor = isPending
    ? 'text-[#D6FF3F]' // Restrained lime
    : isFallback
    ? 'text-emerald-500' // Restrained green
    : 'text-amber-500'; // Restrained amber

  const iconColorClass = isPending
    ? 'text-[#D6FF3F]'
    : isFallback
    ? 'text-emerald-500'
    : 'text-amber-500';

  const indicatorBg = isPending
    ? 'bg-[#D6FF3F]'
    : isFallback
    ? 'bg-emerald-500'
    : 'bg-amber-500';

  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={`border ${borderStyle} ${bgStyle} p-4 sm:p-5 relative transition-colors duration-200 select-none flex flex-col gap-4 text-left`}
    >
      {/* Dismiss button */}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss AI operation notice"
        className="absolute top-3.5 right-3.5 p-1 text-[#5C5E58] hover:text-[#D6FF3F] rounded-[1px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6FF3F] cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-5 items-stretch justify-between pr-6">
        {/* Left column: Status, header and description */}
        <div className="flex-1 space-y-3 text-left">
          <div className="flex items-center gap-2.5">
            {/* Signal animation or badge icon */}
            <span className="relative flex h-2 w-2 shrink-0">
              {isPending && (
                <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D6FF3F] opacity-75" />
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${indicatorBg}`} />
            </span>

            <h4
              className={`font-mono text-xs font-bold tracking-widest uppercase ${titleColor}`}
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              {headerText}
            </h4>

            {isFrontendPreview && (
              <span
                className="font-mono text-[8px] tracking-wider uppercase border border-amber-500/10 px-1 py-0.5 bg-amber-500/5 text-amber-500/60 rounded-[2px]"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                FRONTEND PREVIEW
              </span>
            )}
          </div>

          <p className="text-xs sm:text-[13px] font-sans leading-relaxed text-[#A8AAA3] max-w-[70ch]">
            {descriptionText}
          </p>

          {/* Visible rule for fallback */}
          {isFallback && (
            <div className="flex items-center gap-2 border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 rounded-[2px] max-w-max">
              <ShieldAlert className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
              <span
                className="font-mono text-[9px] font-bold text-emerald-500 tracking-wider uppercase"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                CACHED AI OUTPUT REMAINS A SUGGESTION, NOT A DECISION.
              </span>
            </div>
          )}
        </div>

        {/* Right column: Compact metadata grid */}
        <div className="flex flex-col justify-center min-w-full lg:min-w-[280px] lg:max-w-[340px] border-t lg:border-t-0 lg:border-l border-[#242522]/40 pt-4 lg:pt-0 lg:pl-5 font-mono text-[10px]" style={{ fontFamily: 'var(--font-technical)' }}>
          <div className="space-y-2 w-full text-left">
            {metadataList.map((m) => (
              <div key={m.label} className="flex justify-between items-baseline gap-2 border-b border-[#242522]/20 pb-1.5 last:border-b-0 last:pb-0">
                <span className="text-[#5C5E58] font-bold uppercase shrink-0">{m.label}</span>
                <span className="text-[#A8AAA3] font-bold text-right truncate max-w-[160px]">{m.value}</span>
              </div>
            ))}

            {errorCode && (
              <div className="flex justify-between items-baseline gap-2 border-t border-[#242522]/30 pt-1.5">
                <span className="text-[#5C5E58] font-bold uppercase">DETAIL</span>
                <span className="text-amber-500 font-bold uppercase">{errorCode}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions row */}
      {(retryAvailable || isPending) && (
        <div className="border-t border-[#242522]/40 pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {isPending ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                <button
                  type="button"
                  disabled
                  className="px-4 py-2 bg-[#242522]/30 border border-[#242522] text-[#5C5E58] rounded-[2px] text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 cursor-not-allowed select-none w-full sm:w-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5 motion-safe:animate-spin" />
                  CANCEL REQUEST
                </button>
                <span className="text-[10px] font-mono text-[#5C5E58] uppercase font-bold tracking-wider text-center sm:text-left">
                  {statusText}
                </span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={retry}
                    aria-label="Retry AI Operation as Frontend Preview"
                    className="px-4 py-2.5 bg-[#D6FF3F]/10 border border-[#D6FF3F]/30 hover:bg-[#D6FF3F]/20 text-[#D6FF3F] rounded-[2px] text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6FF3F] w-full sm:w-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    RETRY AI OPERATION
                  </button>
                  <span className="text-[8px] font-mono text-[#5C5E58] text-center uppercase tracking-wider">
                    FRONTEND PREVIEW / NO PROVIDER REQUEST
                  </span>
                </div>

                {/* Fallback button (triage only) */}
                {fallbackAvailable && operation === 'triage' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (operation === 'triage') {
                        context.triage.useFallback();
                      }
                    }}
                    aria-label="Use Cached Demo Result"
                    className="px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 rounded-[2px] text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 w-full sm:w-auto"
                  >
                    USE CACHED DEMO RESULT
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
