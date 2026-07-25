import { useConnection } from '@/context/ConnectionContext';
import { X, RefreshCw, AlertTriangle, ShieldAlert } from 'lucide-react';

export function SystemConnectivityBanner() {
  const {
    status,
    retryAvailable,
    attemptNumber,
    snapshotRefreshRequired,
    isFrontendPreview,
    isDismissed,
    dismiss,
    retryConnection,
  } = useConnection();

  if (status === 'connected' || isDismissed) {
    return null;
  }

  const isOffline = status === 'offline';
  const isReconnecting = status === 'reconnecting';
  const isRestored = status === 'restored';

  // Semantic styles
  const borderColor = isRestored ? 'border-emerald-500/30' : 'border-amber-500/30';
  const bgStyle = isRestored ? 'bg-[#0E110F]' : 'bg-[#11100E]';
  const textColor = isRestored ? 'text-emerald-500' : 'text-amber-500';
  const indicatorColor = isRestored ? 'bg-emerald-500' : 'bg-amber-500';

  const role = isOffline ? 'alert' : 'status';
  const live = isOffline ? 'assertive' : 'polite';

  return (
    <div
      role={role}
      aria-live={live}
      id="system-connectivity-banner"
      className={`border-b ${borderColor} ${bgStyle} px-4 py-5 sm:px-6 relative transition-colors duration-200 select-none`}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-stretch justify-between">
        {/* LEFT COLUMN: Message and Description */}
        <div className="flex-1 space-y-3.5 text-left">
          <div className="flex items-center gap-3">
            {/* Pulsing signal indicator for reconnecting state */}
            <span className="relative flex h-2 w-2 shrink-0">
              {isReconnecting && (
                <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${indicatorColor}`} />
            </span>

            <h2
              className={`font-mono text-xs font-bold tracking-widest uppercase ${textColor}`}
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              {isOffline && 'NETWORK CONNECTION LOST'}
              {isReconnecting && 'REALTIME DISCONNECTED — RETRYING'}
              {isRestored && 'CONNECTION RESTORED'}
            </h2>

            {isFrontendPreview && (
              <span
                className="font-mono text-[8px] tracking-wider uppercase border border-amber-500/20 px-1 py-0.5 bg-amber-500/5 text-amber-500/80 rounded-[2px]"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                FRONTEND CONNECTIVITY PREVIEW
              </span>
            )}
          </div>

          <p className="text-xs sm:text-[13px] font-sans leading-relaxed text-[#A8AAA3] max-w-[70ch]">
            {isOffline &&
              'Realtime updates and authoritative operations are unavailable. Previously loaded information remains visible while SignalFold waits for a connection.'}
            {isReconnecting &&
              'SignalFold is waiting for connectivity. Current content remains visible, but task claims, status transitions, assignments, and other authoritative changes must wait for server confirmation.'}
            {isRestored &&
              'Connectivity has returned. SignalFold must re-fetch authoritative incident, task, Timeline, and membership data before treating the interface as current.'}
          </p>

          {isOffline && (
            <div className="flex items-center gap-2 border border-amber-500/20 bg-amber-500/5 px-3 py-2 rounded-[2px] max-w-max">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" aria-hidden="true" />
              <span
                className="font-mono text-[10px] font-bold text-amber-500 tracking-wider uppercase"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                DO NOT TREAT DISPLAYED DATA AS THE LATEST SERVER STATE.
              </span>
            </div>
          )}
        </div>

        {/* MIDDLE COLUMN: Technical Metadata Grid */}
        <div className="flex flex-col sm:flex-row lg:flex-col justify-center gap-4 border-t border-b border-[#242522]/40 lg:border-0 py-4 lg:py-0 min-w-0 sm:min-w-[280px] lg:min-w-[320px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 w-full text-left">
            {isOffline && (
              <>
                <div className="flex justify-between items-center text-[11px] font-mono border-b border-[#242522]/40 pb-1 w-full">
                  <span className="text-[#5C5E58] uppercase">REALTIME</span>
                  <span className="text-amber-500 font-bold uppercase">DISCONNECTED</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono border-b border-[#242522]/40 pb-1 w-full">
                  <span className="text-[#5C5E58] uppercase">SERVER AUTHORITY</span>
                  <span className="text-[#A8AAA3] font-bold uppercase">UNAVAILABLE</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono lg:border-b lg:border-[#242522]/40 pb-1 w-full">
                  <span className="text-[#5C5E58] uppercase">SNAPSHOT</span>
                  <span className="text-[#A8AAA3] font-mono text-[9px] tracking-tight uppercase">
                    LAST LOADED FRONTEND STATE
                  </span>
                </div>
              </>
            )}

            {isReconnecting && (
              <>
                <div className="flex justify-between items-center text-[11px] font-mono border-b border-[#242522]/40 pb-1 w-full">
                  <span className="text-[#5C5E58] uppercase">CONNECTION</span>
                  <span className="text-amber-500 font-bold uppercase">RECONNECTING</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono border-b border-[#242522]/40 pb-1 w-full">
                  <span className="text-[#5C5E58] uppercase">AUTHORITATIVE DATA</span>
                  <span className="text-[#A8AAA3] font-bold uppercase">REFRESH PENDING</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono lg:border-b lg:border-[#242522]/40 pb-1 w-full">
                  <span className="text-[#5C5E58] uppercase">CURRENT VIEW</span>
                  <span className="text-[#A8AAA3] font-mono text-[9px] tracking-tight uppercase">
                    LAST LOADED SNAPSHOT
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono lg:border-b lg:border-[#242522]/40 pb-1 w-full">
                  <span className="text-[#5C5E58] uppercase">RETRY ATTEMPT</span>
                  <span className="text-amber-500 font-bold uppercase">FRONTEND PREVIEW</span>
                </div>
              </>
            )}

            {isRestored && (
              <>
                <div className="flex justify-between items-center text-[11px] font-mono border-b border-[#242522]/40 pb-1 w-full">
                  <span className="text-[#5C5E58] uppercase">REALTIME</span>
                  <span className="text-emerald-500 font-bold uppercase">
                    AVAILABLE FOR RECONNECTION
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono border-b border-[#242522]/40 pb-1 w-full">
                  <span className="text-[#5C5E58] uppercase">AUTHORITATIVE SNAPSHOT</span>
                  <span className="text-amber-500 font-bold uppercase">REFRESH REQUIRED</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono lg:border-b lg:border-[#242522]/40 pb-1 w-full">
                  <span className="text-[#5C5E58] uppercase">REFRESH STATE</span>
                  <span className="text-amber-500 font-bold uppercase">NOT EXECUTED</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Actions Area */}
        <div className="flex flex-col justify-center items-stretch sm:items-start lg:items-end gap-3 min-w-0 sm:min-w-[200px] lg:min-w-[240px]">
          {isOffline && (
            <div className="space-y-1.5 w-full text-left lg:text-right">
              <button
                type="button"
                onClick={retryConnection}
                disabled={!isFrontendPreview}
                aria-disabled={!isFrontendPreview}
                className={`w-full sm:w-auto px-4 py-2 text-xs font-mono font-bold tracking-wider rounded-[2px] transition-colors border ${
                  isFrontendPreview
                    ? 'border-amber-500 text-[#0A0A0A] bg-amber-500 hover:bg-amber-600 hover:border-amber-600 cursor-pointer'
                    : 'border-[#242522] bg-[#141513] text-[#5C5E58] cursor-not-allowed'
                }`}
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                RETRY CONNECTION
              </button>
              <div
                className="text-[9px] font-mono text-[#5C5E58] tracking-widest uppercase block"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                {isFrontendPreview
                  ? 'FRONTEND PREVIEW / NO NETWORK REQUEST'
                  : 'RETRY HANDLER NOT CONNECTED'}
              </div>
            </div>
          )}

          {isRestored && (
            <div className="space-y-1.5 w-full text-left lg:text-right">
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="w-full sm:w-auto px-4 py-2 text-xs font-mono font-bold tracking-wider rounded-[2px] border border-[#242522] bg-[#141513] text-[#5C5E58] cursor-not-allowed"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                REFRESH AUTHORITATIVE SNAPSHOT
              </button>
              <div
                className="text-[9px] font-mono text-[#5C5E58] tracking-widest uppercase block"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                BACKEND REPOSITORY REQUIRED
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DISMISS CONTROL (Top Right) */}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss connectivity notice"
        className="absolute top-3.5 right-3.5 p-1 text-[#5C5E58] hover:text-[#A8AAA3] border border-[#242522]/60 hover:border-[#242522] bg-transparent rounded-[2px] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4B78FF]"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
