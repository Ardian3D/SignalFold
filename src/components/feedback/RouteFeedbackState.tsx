import React, { useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, AlertCircle, AlertTriangle, RefreshCw, FileQuestion, LayoutGrid, Layers, Loader2 } from 'lucide-react';
import { FeedbackStateKind, FeedbackScope } from '@/context/FeedbackStateContext';

export interface RouteFeedbackStateProps {
  kind: FeedbackStateKind;
  scope: FeedbackScope;
  onRetry?: () => void;
  onResetFilters?: () => void;
  availableMockCount?: number;
  filteredMockCount?: number;
}

/**
 * Loading state skeleton builder.
 */
export function LoadingState({ scope }: { scope: FeedbackScope }) {
  const getLabel = () => {
    switch (scope) {
      case 'dashboard':
        return 'LOADING DASHBOARD';
      case 'incidents':
        return 'LOADING INCIDENT RECORDS';
      case 'incident-room':
        return 'LOADING INCIDENT ROOM';
      case 'resolved-record':
        return 'LOADING RESOLVED RECORD';
      case 'postmortem':
        return 'LOADING POSTMORTEM';
      default:
        return 'LOADING WORKSPACE DATA';
    }
  };

  return (
    <div 
      className="space-y-6 w-full animate-pulse motion-reduce:animate-none" 
      aria-busy="true" 
      role="status"
    >
      {/* HEADER LOADING SKELETON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#242522]">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-[#242522] rounded-[2px]" />
          <div className="h-4 w-64 bg-[#141513] rounded-[2px]" />
        </div>
        <div className="h-10 w-32 bg-[#242522] rounded-[2px] shrink-0" />
      </div>

      {/* SYSTEM/STATUS ANNOUNCEMENT */}
      <div className="flex items-center gap-3 bg-[#141513] border border-[#242522] px-4 py-3 rounded-[2px]">
        <Loader2 className="w-4 h-4 text-[#A8AAA3] animate-spin shrink-0" />
        <span 
          className="font-mono text-xs text-[#A8AAA3] tracking-widest uppercase"
          style={{ fontFamily: 'var(--font-technical)' }}
        >
          {getLabel()}
        </span>
      </div>

      {/* MAIN SKELETON BODY */}
      {scope === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="h-24 bg-[#141513] border border-[#242522] rounded-[2px] p-4 space-y-2">
                <div className="h-3 w-16 bg-[#242522] rounded-[1px]" />
                <div className="h-6 w-12 bg-[#242522] rounded-[1px]" />
              </div>
              <div className="h-24 bg-[#141513] border border-[#242522] rounded-[2px] p-4 space-y-2">
                <div className="h-3 w-16 bg-[#242522] rounded-[1px]" />
                <div className="h-6 w-12 bg-[#242522] rounded-[1px]" />
              </div>
              <div className="h-24 bg-[#141513] border border-[#242522] rounded-[2px] p-4 space-y-2">
                <div className="h-3 w-16 bg-[#242522] rounded-[1px]" />
                <div className="h-6 w-12 bg-[#242522] rounded-[1px]" />
              </div>
            </div>
            <div className="border border-[#242522] bg-[#141513] p-4 rounded-[2px] space-y-4">
              <div className="h-4 w-32 bg-[#242522]" />
              <div className="space-y-2">
                <div className="h-12 bg-[#242522] w-full" />
                <div className="h-12 bg-[#242522] w-full" />
                <div className="h-12 bg-[#242522] w-full" />
              </div>
            </div>
          </div>
          <div className="border border-[#242522] bg-[#141513] p-4 rounded-[2px] space-y-4 h-fit">
            <div className="h-4 w-32 bg-[#242522]" />
            <div className="space-y-3">
              <div className="h-8 bg-[#242522] w-full" />
              <div className="h-8 bg-[#242522] w-full" />
              <div className="h-8 bg-[#242522] w-full" />
            </div>
          </div>
        </div>
      )}

      {scope === 'incidents' && (
        <div className="space-y-4">
          <div className="flex gap-2 p-2 bg-[#141513] border border-[#242522]">
            <div className="h-10 bg-[#242522] flex-1" />
            <div className="h-10 bg-[#242522] w-32" />
          </div>
          <div className="border border-[#242522] bg-[#141513] divide-y divide-[#242522]">
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-40 bg-[#242522]" />
                <div className="h-4 w-20 bg-[#242522]" />
              </div>
              <div className="h-3 w-96 bg-[#242522]" />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-40 bg-[#242522]" />
                <div className="h-4 w-20 bg-[#242522]" />
              </div>
              <div className="h-3 w-96 bg-[#242522]" />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-40 bg-[#242522]" />
                <div className="h-4 w-20 bg-[#242522]" />
              </div>
              <div className="h-3 w-96 bg-[#242522]" />
            </div>
          </div>
        </div>
      )}

      {scope === 'incident-room' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="border border-[#242522] bg-[#141513] p-6 space-y-4">
              <div className="h-6 w-3/4 bg-[#242522]" />
              <div className="h-4 w-1/2 bg-[#242522]" />
              <div className="h-16 w-full bg-[#242522]" />
            </div>
            <div className="border border-[#242522] bg-[#141513] p-6 space-y-4">
              <div className="h-4 w-32 bg-[#242522]" />
              <div className="space-y-3">
                <div className="h-10 bg-[#242522]" />
                <div className="h-10 bg-[#242522]" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="border border-[#242522] bg-[#141513] p-4 space-y-4">
              <div className="h-4 w-24 bg-[#242522]" />
              <div className="h-32 bg-[#242522]" />
            </div>
          </div>
        </div>
      )}

      {scope === 'resolved-record' && (
        <div className="space-y-6">
          <div className="border border-[#242522] bg-[#141513] p-6 space-y-4">
            <div className="h-6 w-1/2 bg-[#242522]" />
            <div className="h-4 w-1/3 bg-[#242522]" />
          </div>
          <div className="border border-[#242522] bg-[#141513] p-6 space-y-4">
            <div className="h-4 w-48 bg-[#242522]" />
            <div className="h-24 w-full bg-[#242522]" />
          </div>
        </div>
      )}

      {scope === 'postmortem' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 border border-[#242522] bg-[#141513] p-4 space-y-3">
            <div className="h-8 bg-[#242522] w-full" />
            <div className="h-8 bg-[#242522] w-full" />
            <div className="h-8 bg-[#242522] w-full" />
          </div>
          <div className="lg:col-span-3 border border-[#242522] bg-[#141513] p-6 space-y-4">
            <div className="h-6 w-1/2 bg-[#242522]" />
            <div className="h-4 w-1/3 bg-[#242522]" />
            <div className="h-48 w-full bg-[#242522]" />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Empty layout state display.
 */
export function EmptyStateView({
  scope,
  isFiltered = false,
  onResetFilters,
  availableMockCount = 3,
  filteredMockCount = 0,
}: {
  scope: FeedbackScope;
  isFiltered?: boolean;
  onResetFilters?: () => void;
  availableMockCount?: number;
  filteredMockCount?: number;
}) {
  const navigate = useNavigate();

  if (isFiltered) {
    return (
      <div 
        className="w-full border border-dashed border-[#242522] bg-[#141513]/30 p-8 sm:p-12 rounded-[2px] flex flex-col items-center text-center space-y-4"
        role="status"
      >
        <div className="w-full max-w-[640px] mx-auto flex flex-col items-center text-center space-y-4 min-w-0">
          <div className="w-10 h-10 rounded-full bg-[#141513] border border-[#242522] flex items-center justify-center text-[#A8AAA3] shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="space-y-2 w-full">
            <h2 className="text-base font-bold text-[#F3F1EA] uppercase tracking-wide break-words">
              NO INCIDENTS MATCH CURRENT FILTERS
            </h2>
            <p className="text-xs sm:text-sm text-[#A8AAA3] leading-relaxed w-full max-w-[520px] mx-auto whitespace-normal break-normal [word-break:normal] [overflow-wrap:break-word]">
              The incident workspace contains records, but none match the current search and filter selection.
            </p>
          </div>

          {/* METADATA REGISTERS */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center py-2 font-mono text-[10px] uppercase tracking-wider text-[#5C5E58] w-full" style={{ fontFamily: 'var(--font-technical)' }}>
            <div className="px-3 py-1 bg-[#141513] border border-[#242522] rounded-[1px] whitespace-nowrap">
              AVAILABLE RECORDS:{' '}
              <span className="text-[#A8AAA3] font-bold">{availableMockCount} MOCK RECORDS</span>
            </div>
            <div className="px-3 py-1 bg-[#141513] border border-[#242522] rounded-[1px] whitespace-nowrap">
              FILTER RESULT:{' '}
              <span className="text-amber-500 font-bold">{filteredMockCount} MATCHES</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full justify-center">
            <button
              onClick={onResetFilters}
              className="w-full sm:w-auto px-6 py-2 bg-[#D6FF3F] hover:bg-[#c3e634] text-[#0A0A0A] text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6FF3F] min-h-[44px] whitespace-nowrap"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              RESET FILTERS
            </button>
            <button
              onClick={() => navigate('/app/incidents/new')}
              className="w-full sm:w-auto px-6 py-2 border border-[#242522] hover:bg-[#141513]/50 text-[#F3F1EA] text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3F1EA] min-h-[44px] whitespace-nowrap"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              CREATE INCIDENT
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (scope === 'dashboard') {
    return (
      <div className="w-full border border-dashed border-[#242522] bg-[#141513]/30 p-8 sm:p-12 rounded-[2px] flex flex-col items-center text-center space-y-4">
        <div className="w-full max-w-[640px] mx-auto flex flex-col items-center text-center space-y-4 min-w-0">
          <div className="w-10 h-10 rounded-full bg-[#141513] border border-[#242522] flex items-center justify-center text-[#A8AAA3] shrink-0">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div className="space-y-2 w-full">
            <h2 className="text-base font-bold text-[#F3F1EA] uppercase tracking-wide break-words">
              NO INCIDENTS YET
            </h2>
            <p className="text-xs sm:text-sm text-[#A8AAA3] leading-relaxed max-w-lg mx-auto break-words">
              Create the first incident to begin organizing reports, response ownership, tasks, Timeline activity, and resolution work.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 w-full justify-center">
            <button
              onClick={() => navigate('/app/incidents/new')}
              className="w-full sm:w-auto px-6 py-2 bg-[#D6FF3F] hover:bg-[#c3e634] text-[#0A0A0A] text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6FF3F] min-h-[44px] whitespace-nowrap"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              CREATE FIRST INCIDENT
            </button>
            <div className="relative group w-full sm:w-auto">
              <button
                disabled
                className="w-full sm:w-auto px-6 py-2 border border-[#242522] text-[#5C5E58] text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] cursor-not-allowed min-h-[44px] bg-[#141513]/30 whitespace-nowrap"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                LOAD DEMO WORKSPACE
              </button>
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 bg-[#141513] border border-rose-500/20 text-rose-500 text-[9px] font-mono tracking-wider rounded-[1px] whitespace-nowrap opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity uppercase z-50">
                ADMIN AUTHORITY REQUIRED
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // default Empty Incident List state
  return (
    <div className="w-full border border-dashed border-[#242522] bg-[#141513]/30 p-8 sm:p-12 rounded-[2px] flex flex-col items-center text-center space-y-4">
      <div className="w-full max-w-[640px] mx-auto flex flex-col items-center text-center space-y-4 min-w-0">
        <div className="w-10 h-10 rounded-full bg-[#141513] border border-[#242522] flex items-center justify-center text-[#A8AAA3] shrink-0">
          <Layers className="w-5 h-5" />
        </div>
        <div className="space-y-2 w-full">
          <h2 className="text-base font-bold text-[#F3F1EA] uppercase tracking-wide break-words">
            NO INCIDENT RECORDS
          </h2>
          <p className="text-xs sm:text-sm text-[#A8AAA3] leading-relaxed max-w-lg mx-auto break-words">
            No incidents are available in the current frontend workspace.
          </p>
        </div>

        {/* METADATA REGISTERS */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center py-2 font-mono text-[10px] uppercase tracking-wider text-[#5C5E58] w-full" style={{ fontFamily: 'var(--font-technical)' }}>
          <div className="px-3 py-1 bg-[#141513] border border-[#242522] rounded-[1px] whitespace-nowrap">
            DATA SOURCE:{' '}
            <span className="text-[#A8AAA3] font-bold">FRONTEND MOCK MODE</span>
          </div>
          <div className="px-3 py-1 bg-[#141513] border border-[#242522] rounded-[1px] whitespace-nowrap">
            BACKEND QUERY:{' '}
            <span className="text-[#A8AAA3] font-bold">NOT CONNECTED</span>
          </div>
        </div>

        <div className="pt-2 w-full flex justify-center">
          <button
            onClick={() => navigate('/app/incidents/new')}
            className="w-full sm:w-auto px-6 py-2 bg-[#D6FF3F] hover:bg-[#c3e634] text-[#0A0A0A] text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6FF3F] min-h-[44px] whitespace-nowrap"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            CREATE INCIDENT
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Shared error states view for: forbidden, not_found, network_error, unexpected_error.
 */
export function ErrorStateView({
  kind,
  onRetry,
  errorCode = 'UNKNOWN',
}: {
  kind: 'forbidden' | 'not_found' | 'network_error' | 'unexpected_error';
  onRetry?: () => void;
  errorCode?: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Focus moves to the feedback heading when state first appears
    headingRef.current?.focus();
  }, [kind]);

  const getDetails = () => {
    switch (kind) {
      case 'forbidden':
        return {
          title: 'ACCESS DENIED',
          code: 'FORBIDDEN',
          description: 'The current authenticated identity does not have verified authority to view this organization record or perform this operation.',
          color: 'rose',
          registers: [
            { label: 'ORGANIZATION MEMBERSHIP', value: 'NOT VERIFIED' },
            { label: 'OPERATING ROLE', value: 'NOT LOADED' },
            { label: 'TENANT ACCESS', value: 'NOT VERIFIED' },
            { label: 'REQUESTED RECORD', value: 'NOT DISPLAYED' },
          ],
          icon: ShieldAlert,
        };
      case 'not_found':
        return {
          title: 'RECORD NOT FOUND',
          code: 'NOT_FOUND',
          description: 'The requested SignalFold record does not exist, is no longer available, or cannot be resolved from the current frontend data source.',
          color: 'amber',
          registers: [
            { label: 'REQUESTED ROUTE', value: location.pathname.toUpperCase() },
            { label: 'RECORD DATA', value: 'NOT AVAILABLE' },
            { label: 'BACKEND LOOKUP', value: 'NOT CONNECTED' },
          ],
          icon: FileQuestion,
        };
      case 'network_error':
        return {
          title: 'WORKSPACE DATA COULD NOT BE LOADED',
          code: 'NETWORK_ERROR',
          description: 'SignalFold could not retrieve the requested workspace data. Previously entered local form content remains preserved where applicable.',
          color: 'amber',
          registers: [
            { label: 'DATA RESULT', value: 'NOT AVAILABLE' },
            { label: 'LOCAL INPUT', value: 'PRESERVED' },
            { label: 'RETRY', value: 'AVAILABLE AS FRONTEND PREVIEW' },
          ],
          icon: AlertTriangle,
        };
      case 'unexpected_error':
      default:
        return {
          title: 'SIGNALFOLD COULD NOT RENDER THIS WORKSPACE',
          code: errorCode || 'UNKNOWN',
          description: 'An unexpected application error occurred. No operational action should be assumed successful.',
          color: 'rose',
          registers: [
            { label: 'INCIDENT MUTATION', value: 'NOT CONFIRMED' },
            { label: 'LOCAL INPUT RECOVERY', value: 'ATTEMPTED' },
            { label: 'TECHNICAL DETAIL', value: 'HIDDEN' },
          ],
          icon: AlertCircle,
        };
    }
  };

  const details = getDetails();
  const Icon = details.icon;

  const isRose = details.color === 'rose';
  const accentBorderColor = isRose ? 'border-rose-500/20' : 'border-amber-500/20';
  const accentBgColor = isRose ? 'bg-rose-500/5' : 'bg-amber-500/5';
  const accentTextColor = isRose ? 'text-rose-500' : 'text-amber-500';

  return (
    <div 
      className="w-full min-w-0 flex flex-col items-center justify-center px-4 py-8 sm:px-6 md:px-8"
      role="alert"
    >
      <div className="w-full max-w-[760px] mx-auto bg-[#141513] border border-[#242522] rounded-[2px] p-6 sm:p-8 space-y-6">
        {/* UPPER STATUS REGISTER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242522] pb-4 min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Icon className={`w-5 h-5 ${accentTextColor} shrink-0`} />
            <span 
              ref={headingRef}
              tabIndex={-1}
              className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-[#F3F1EA] outline-none break-words min-w-0"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              {details.title}
            </span>
          </div>
          <span 
            className={`font-mono text-[10px] font-bold px-1.5 py-0.5 border ${accentBorderColor} ${accentBgColor} ${accentTextColor} rounded-[1px] shrink-0 self-start sm:self-center`}
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            {details.code}
          </span>
        </div>

        {/* EXPLANATORY BODY COPY */}
        <p className="text-xs sm:text-sm text-[#A8AAA3] leading-relaxed font-sans text-left break-words">
          {details.description}
        </p>

        {/* TECHNICAL REGISTER */}
        <div className="space-y-2 border-t border-b border-[#242522] py-4">
          <div className="text-[9px] font-mono text-[#5C5E58] tracking-widest uppercase mb-1" style={{ fontFamily: 'var(--font-technical)' }}>
            METADATA REGISTER
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 font-mono text-[10px] uppercase tracking-wider">
            {details.registers.map((reg, idx) => (
              <div key={idx} className="flex justify-between items-center py-0.5 min-w-0 gap-4">
                <span className="text-[#5C5E58] min-w-0 break-words">{reg.label}</span>
                <span className="text-[#A8AAA3] text-right font-bold min-w-0 break-words" title={reg.value}>
                  {reg.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIONS PANEL */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 pt-2 w-full">
          {kind === 'network_error' && (
            <div className="flex flex-col items-center gap-1 w-full sm:w-auto sm:flex-1 min-w-[180px]">
              <button
                onClick={onRetry}
                className="w-full px-4 py-2 bg-[#D6FF3F] hover:bg-[#c3e634] text-[#0A0A0A] text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6FF3F] min-h-[44px] whitespace-nowrap"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                RETRY DATA LOAD
              </button>
              <div className="text-[8px] font-mono text-[#5C5E58] uppercase tracking-widest whitespace-nowrap" style={{ fontFamily: 'var(--font-technical)' }}>
                FRONTEND PREVIEW / NO NETWORK REQUEST
              </div>
            </div>
          )}

          {kind === 'unexpected_error' && (
            <button
              onClick={onRetry}
              className="w-full sm:w-auto sm:flex-1 min-w-[180px] px-4 py-2 bg-[#D6FF3F] hover:bg-[#c3e634] text-[#0A0A0A] text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6FF3F] min-h-[44px] whitespace-nowrap"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              RETRY APPLICATION VIEW
            </button>
          )}

          <button
            onClick={() => navigate('/app')}
            className="w-full sm:w-auto sm:flex-1 min-w-[180px] px-3 py-2 border border-[#242522] hover:bg-[#141513]/50 text-[#F3F1EA] text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3F1EA] min-h-[44px] whitespace-nowrap"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            BACK TO DASHBOARD
          </button>
          {(kind === 'forbidden' || kind === 'not_found') && (
            <button
              onClick={() => navigate('/app/incidents')}
              className="w-full sm:w-auto sm:flex-1 min-w-[180px] px-3 py-2 border border-[#242522] hover:bg-[#141513]/50 text-[#F3F1EA] text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3F1EA] min-h-[44px] whitespace-nowrap"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              BACK TO INCIDENTS
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Shared RouteFeedbackState component that acts as the entry point and
 * renders the specific feedback state according to priority order.
 */
export const RouteFeedbackState: React.FC<RouteFeedbackStateProps> = ({
  kind,
  scope,
  onRetry,
  onResetFilters,
  availableMockCount = 3,
  filteredMockCount = 0,
}) => {
  if (kind === 'loading') {
    return <LoadingState scope={scope} />;
  }

  if (kind === 'empty' || kind === 'empty_filtered') {
    return (
      <EmptyStateView
        scope={scope}
        isFiltered={kind === 'empty_filtered'}
        onResetFilters={onResetFilters}
        availableMockCount={availableMockCount}
        filteredMockCount={filteredMockCount}
      />
    );
  }

  if (
    kind === 'forbidden' ||
    kind === 'not_found' ||
    kind === 'network_error' ||
    kind === 'unexpected_error'
  ) {
    return (
      <ErrorStateView
        kind={kind}
        onRetry={onRetry}
        errorCode={kind === 'unexpected_error' ? 'UNKNOWN' : kind.toUpperCase()}
      />
    );
  }

  return null;
};
