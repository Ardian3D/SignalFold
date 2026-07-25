import { useSearchParams, useNavigate } from 'react-router-dom';
import { useFeedbackState } from '@/context/FeedbackStateContext';
import { RouteFeedbackState } from '@/components/feedback/RouteFeedbackState';
import { Users, Lock, ExternalLink, HelpCircle, UserPlus, ShieldAlert } from 'lucide-react';

export function TeamPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getFeedbackState } = useFeedbackState();
  const feedback = getFeedbackState('team');

  if (feedback && feedback.isActive) {
    return (
      <RouteFeedbackState
        kind={feedback.kind}
        scope="team"
        onRetry={feedback.retry}
      />
    );
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#242522]">
        <div className="space-y-1.5 text-left flex-1 min-w-0 w-full">
          <div 
            className="text-[9px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            TEAM DIRECTORY / READ-ONLY WORKSPACE PREVIEW
          </div>
          <h2 
            className="text-3xl font-extrabold tracking-tight text-[#F3F1EA] uppercase"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            TEAM & MEMBERSHIP
          </h2>
          <p className="text-sm text-[#A8AAA3] w-full max-w-[640px] min-w-0 font-sans leading-relaxed break-normal whitespace-normal text-left">
            Review the operational roles and directory foundations configured for the Northstar Commerce workspace. Modifying team rosters, inviting members, or changing authority permissions requires backend connection.
          </p>
        </div>

        {/* Operational Status Box */}
        <div 
          className="shrink-0 flex items-center gap-2 border border-[#242522] bg-[#141513]/30 px-3 py-2 rounded-[2px] self-start"
          aria-label="Workspace Status Information"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#5C5E58]" aria-hidden="true" />
          <div className="space-y-0.5 text-left">
            <div 
              className="text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              ROSTER STATE
            </div>
            <div className="text-[10px] font-mono font-bold text-[#A8AAA3] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
              READ-ONLY PREVIEW
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Header Status Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-[#242522] bg-[#141513]/40 p-4 rounded-[2px] space-y-1.5 text-left">
          <div className="text-[8px] font-mono text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            MEMBERSHIP DIRECTORY
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>
            NOT LOADED
          </div>
        </div>
        <div className="border border-[#242522] bg-[#141513]/40 p-4 rounded-[2px] space-y-1.5 text-left">
          <div className="text-[8px] font-mono text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            ACTIVE MEMBERS
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-amber-500" style={{ fontFamily: 'var(--font-technical)' }}>
            NOT AVAILABLE
          </div>
        </div>
        <div className="border border-[#242522] bg-[#141513]/40 p-4 rounded-[2px] space-y-1.5 text-left">
          <div className="text-[8px] font-mono text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            PRESENCE
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-amber-500" style={{ fontFamily: 'var(--font-technical)' }}>
            REALTIME NOT CONNECTED
          </div>
        </div>
        <div className="border border-[#242522] bg-[#141513]/40 p-4 rounded-[2px] space-y-1.5 text-left">
          <div className="text-[8px] font-mono text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            ROLE MANAGEMENT
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-[#5C5E58]" style={{ fontFamily: 'var(--font-technical)' }}>
            ADMIN AUTHORITY REQUIRED
          </div>
        </div>
      </div>

      {/* 3. Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column Area: Member Directory & Organization Role Reference */}
        <div className="lg:col-span-2 space-y-6">
          {/* Member Directory Panel */}
          <div className="border border-[#242522] bg-[#0A0A0A] p-6 rounded-[2px] text-left space-y-6">
            <div className="flex items-center justify-between border-b border-[#242522] pb-3">
              <h3 
                className="text-sm font-mono font-extrabold tracking-wide text-[#F3F1EA]"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                MEMBER DIRECTORY
              </h3>
              <span className="text-[8px] font-mono px-2 py-0.5 border border-amber-500/20 bg-amber-500/5 text-amber-500 rounded-[1px] font-bold">
                NOT CONNECTED
              </span>
            </div>

            <div className="p-4 bg-[#141513]/40 border border-[#242522] rounded-[2px] space-y-4">
              <div className="space-y-1">
                <div className="text-[9px] font-mono text-amber-500 tracking-wider uppercase font-bold">
                  STATE
                </div>
                <div className="text-lg font-mono font-extrabold text-[#F3F1EA]">
                  MEMBERSHIP DATA NOT LOADED
                </div>
              </div>

              <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed">
                The canonical workspace may contain multiple responders with distinct roles, but no member identities are provided by the frontend seed specification.
              </p>

              <div className="border-t border-[#242522] pt-3">
                <div className="text-[9px] font-mono text-[#5C5E58] tracking-widest uppercase font-bold mb-1.5">
                  VISIBLE RULE
                </div>
                <div className="text-xs font-mono font-bold text-[#D6FF3F] bg-[#141513] p-2 border border-[#242522] inline-block w-full">
                  SIGNALFOLD DOES NOT INVENT ORGANIZATION MEMBERS.
                </div>
              </div>
            </div>

            {/* Display list of details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-wider">
              <div className="flex justify-between items-center py-0.5 border-b border-[#141513]">
                <span className="text-[#5C5E58]">MEMBER IDENTITIES</span>
                <span className="text-amber-500 font-bold">NOT AVAILABLE</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#141513]">
                <span className="text-[#5C5E58]">MEMBERSHIP RECORDS</span>
                <span className="text-amber-500 font-bold">NOT CONNECTED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#141513]">
                <span className="text-[#5C5E58]">ACTIVE MEMBER COUNT</span>
                <span className="text-amber-500 font-bold">NOT AVAILABLE</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#141513]">
                <span className="text-[#5C5E58]">INCIDENT PARTICIPATION</span>
                <span className="text-amber-500 font-bold">NOT LOADED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#141513]">
                <span className="text-[#5C5E58]">PRESENCE</span>
                <span className="text-amber-500 font-bold">REALTIME NOT CONNECTED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#141513]">
                <span className="text-[#5C5E58]">DIRECTORY AUTHORITY</span>
                <span className="text-amber-500 font-bold">BACKEND REQUIRED</span>
              </div>
            </div>
          </div>

          {/* Organization Role Reference Panel */}
          <div className="border border-[#242522] bg-[#0A0A0A] p-6 rounded-[2px] text-left space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#242522] pb-3">
              <h3 
                className="text-sm font-mono font-extrabold tracking-wide text-[#F3F1EA]"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                ORGANIZATION ROLE REFERENCE
              </h3>
              <span className="text-[9px] font-mono px-2 py-0.5 border border-[#D6FF3F]/20 bg-[#D6FF3F]/5 text-[#D6FF3F] rounded-[1px] font-bold">
                SCHEMA AND AUTHORITY REFERENCE ONLY
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 01 / REPORTER */}
              <div className="border border-[#242522] bg-[#141513]/20 p-4 rounded-[2px] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#F3F1EA]">01 / REPORTER</span>
                  <span className="text-[8px] font-mono text-[#5C5E58] uppercase">READ-ONLY</span>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] font-mono text-[#5C5E58] uppercase">PURPOSE</div>
                  <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed">
                    Reports incidents and adds relevant operational context.
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] font-mono text-[#5C5E58] uppercase">AUTHORITY REFERENCE</div>
                  <ul className="list-disc list-inside text-[10px] font-mono text-[#A8AAA3] space-y-1 uppercase">
                    <li>Create incidents</li>
                    <li>View organization incidents</li>
                    <li>Add internal notes</li>
                    <li className="text-[#5C5E58]">Cannot confirm final severity</li>
                    <li className="text-[#5C5E58]">Cannot resolve incidents</li>
                  </ul>
                </div>
              </div>

              {/* 02 / RESPONDER */}
              <div className="border border-[#242522] bg-[#141513]/20 p-4 rounded-[2px] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#F3F1EA]">02 / RESPONDER</span>
                  <span className="text-[8px] font-mono text-[#5C5E58] uppercase">INVESTIGATOR</span>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] font-mono text-[#5C5E58] uppercase">PURPOSE</div>
                  <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed">
                    Participates directly in incident investigation and response work.
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] font-mono text-[#5C5E58] uppercase">AUTHORITY REFERENCE</div>
                  <ul className="list-disc list-inside text-[10px] font-mono text-[#A8AAA3] space-y-1 uppercase">
                    <li>Reporter capabilities</li>
                    <li>Claim and update eligible tasks</li>
                    <li>Create response tasks</li>
                    <li>Add incident updates</li>
                    <li className="text-[#5C5E58]">Cannot resolve unless also authorized as Incident Manager</li>
                  </ul>
                </div>
              </div>

              {/* 03 / INCIDENT MANAGER */}
              <div className="border border-[#242522] bg-[#141513]/20 p-4 rounded-[2px] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#F3F1EA]">03 / INCIDENT MANAGER</span>
                  <span className="text-[8px] font-mono text-[#5C5E58] uppercase">COMMANDER</span>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] font-mono text-[#5C5E58] uppercase">PURPOSE</div>
                  <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed">
                    Directs incident response and controls authoritative incident decisions.
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] font-mono text-[#5C5E58] uppercase">AUTHORITY REFERENCE</div>
                  <ul className="list-disc list-inside text-[10px] font-mono text-[#A8AAA3] space-y-1 uppercase">
                    <li>Responder capabilities</li>
                    <li>Confirm severity</li>
                    <li>Change incident status</li>
                    <li>Assign commander and assignees</li>
                    <li>Run approved AI-assisted workflows</li>
                    <li>Resolve incidents</li>
                    <li>Generate and approve Postmortems</li>
                  </ul>
                </div>
              </div>

              {/* 04 / ORGANIZATION ADMIN */}
              <div className="border border-[#242522] bg-[#141513]/20 p-4 rounded-[2px] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#F3F1EA]">04 / ORGANIZATION ADMIN</span>
                  <span className="text-[8px] font-mono text-[#5C5E58] uppercase">ADMINISTRATOR</span>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] font-mono text-[#5C5E58] uppercase">PURPOSE</div>
                  <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed">
                    Manages organization-level membership, access, and workspace configuration.
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] font-mono text-[#5C5E58] uppercase">AUTHORITY REFERENCE</div>
                  <ul className="list-disc list-inside text-[10px] font-mono text-[#A8AAA3] space-y-1 uppercase">
                    <li>Organization membership management</li>
                    <li>Role management</li>
                    <li>Service administration</li>
                    <li>Demo workspace administration</li>
                    <li>Organization-level access control</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Rail: Context, Summary, Readiness, and Contracts */}
        <div className="space-y-6">
          
          {/* Current Operator Context Panel */}
          <div className="border border-[#242522] bg-[#141513]/30 p-5 rounded-[2px] text-left space-y-4">
            <h3 
              className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase border-b border-[#242522] pb-2"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              CURRENT OPERATOR CONTEXT
            </h3>
            <div className="space-y-2.5 font-mono text-[10px] uppercase tracking-wider">
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">IDENTITY</span>
                <span className="text-[#A8AAA3] font-bold">CURRENT OPERATOR</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">IDENTITY SOURCE</span>
                <span className="text-[#A8AAA3]">FRONTEND PREVIEW</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">ORGANIZATION MEMBERSHIP</span>
                <span className="text-amber-500 font-bold">NOT VERIFIED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">OPERATING ROLE</span>
                <span className="text-amber-500 font-bold">NOT LOADED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">MEMBER STATUS</span>
                <span className="text-amber-500 font-bold">NOT DETERMINED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">PRESENCE</span>
                <span className="text-[#5C5E58] font-bold">NOT CONNECTED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">TENANT ACCESS</span>
                <span className="text-amber-500 font-bold">NOT VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Team Directory Summary Box */}
          <div className="border border-[#242522] bg-[#141513]/30 p-5 rounded-[2px] text-left space-y-4">
            <h3 
              className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase border-b border-[#242522] pb-2"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              TEAM DIRECTORY SUMMARY
            </h3>
            <div className="space-y-2.5 font-mono text-[10px] uppercase tracking-wider">
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">ORGANIZATION</span>
                <span className="text-[#A8AAA3] font-bold">NORTHSTAR COMMERCE</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">DIRECTORY SOURCE</span>
                <span className="text-amber-500 font-bold">NOT CONNECTED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">MEMBER IDENTITIES</span>
                <span className="text-amber-500 font-bold">NOT LOADED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">TOTAL ACTIVE MEMBERS</span>
                <span className="text-amber-500 font-bold">NOT AVAILABLE</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">ROLE ASSIGNMENTS</span>
                <span className="text-amber-500 font-bold">NOT LOADED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">COMMUNITY ACCESS</span>
                <span className="text-amber-500 font-bold">NOT APPLICABLE</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">ORGANIZATION STRUCTURE</span>
                <span className="text-amber-500 font-bold">NOT LOADED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">ROSTER RECONCILIATION</span>
                <span className="text-amber-500 font-bold">BACKEND REQUIRED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">INVITATION ACTIONS</span>
                <span className="text-amber-500 font-bold">NOT AVAILABLE</span>
              </div>
            </div>
            <div className="border-t border-[#242522] pt-3">
              <div className="text-[9px] font-mono text-[#5C5E58] tracking-widest uppercase font-bold mb-1">
                VISIBLE RULE
              </div>
              <div 
                className="p-2 bg-[#0A0A0A]/80 border border-[#242522] text-[8px] font-mono text-amber-500 leading-relaxed uppercase"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                DIRECTORY METADATA REQUIRES AUTHORITATIVE MEMBERSHIP RECORDS.
              </div>
            </div>
          </div>

          {/* Team Management Readiness Panel */}
          <div className="border border-[#242522] bg-[#141513]/30 p-5 rounded-[2px] text-left space-y-4">
            <h3 
              className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase border-b border-[#242522] pb-2"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              TEAM MANAGEMENT READINESS
            </h3>
            
            <div className="space-y-2.5 font-mono text-[10px] uppercase tracking-wider mb-4">
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">MEMBER DIRECTORY</span>
                <span className="text-amber-500 font-bold">NOT CONNECTED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">INVITE MEMBER</span>
                <span className="text-amber-500 font-bold">BACKEND REQUIRED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">CHANGE ROLE</span>
                <span className="text-amber-500 font-bold">BACKEND REQUIRED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">DEACTIVATE MEMBER</span>
                <span className="text-amber-500 font-bold">BACKEND REQUIRED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">PRESENCE SUBSCRIPTION</span>
                <span className="text-amber-500 font-bold">NOT CONNECTED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">AUDIT HISTORY</span>
                <span className="text-amber-500 font-bold">NOT CONNECTED</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                disabled
                className="w-full py-2 bg-[#141513] border border-[#242522] text-[#5C5E58] text-[10px] font-mono font-bold uppercase tracking-wider rounded-[2px] cursor-not-allowed flex items-center justify-center gap-2"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                <Lock className="w-3 h-3" /> INVITE MEMBER
              </button>
              <button
                disabled
                className="w-full py-2 bg-[#141513] border border-[#242522] text-[#5C5E58] text-[10px] font-mono font-bold uppercase tracking-wider rounded-[2px] cursor-not-allowed flex items-center justify-center gap-2"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                <Lock className="w-3 h-3" /> CHANGE MEMBER ROLE
              </button>
              <button
                disabled
                className="w-full py-2 bg-[#141513] border border-[#242522] text-[#5C5E58] text-[10px] font-mono font-bold uppercase tracking-wider rounded-[2px] cursor-not-allowed flex items-center justify-center gap-2"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                <Lock className="w-3 h-3" /> DEACTIVATE MEMBER
              </button>
            </div>

            <div className="text-center pt-2">
              <span 
                className="inline-block text-[8px] font-mono px-2 py-0.5 border border-rose-500/20 bg-rose-500/5 text-rose-500 rounded-[1px] font-bold uppercase"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                ORGANIZATION ADMIN AUTHORITY REQUIRED
              </span>
            </div>
          </div>

          {/* Membership Directory Contract Panel */}
          <div className="border border-[#242522] bg-[#141513]/30 p-5 rounded-[2px] text-left space-y-4">
            <h3 
              className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase border-b border-[#242522] pb-2"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              MEMBERSHIP DIRECTORY CONTRACT
            </h3>
            
            <div className="space-y-2.5 font-mono text-[10px] uppercase tracking-wider">
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">MEMBER IDENTITY</span>
                <span className="text-[#A8AAA3] font-bold">BACKEND RECORD REQUIRED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">ORGANIZATION ACCESS</span>
                <span className="text-[#A8AAA3] font-bold">ACTIVE MEMBERSHIP REQUIRED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">ROLE ASSIGNMENT</span>
                <span className="text-[#A8AAA3] font-bold">SERVER CONTROLLED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">ROLE CHANGES</span>
                <span className="text-[#A8AAA3] font-bold">ADMIN AUTHORITY REQUIRED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">INCIDENT PARTICIPATION</span>
                <span className="text-[#A8AAA3] font-bold">BACKEND RECORD REQUIRED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">PRESENCE</span>
                <span className="text-[#A8AAA3] font-bold">REALTIME SUBSCRIPTION</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">INVITATIONS</span>
                <span className="text-[#A8AAA3] font-bold">BACKEND FUNCTION REQUIRED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">DEACTIVATION</span>
                <span className="text-[#A8AAA3] font-bold">SERVER AUTHORITY REQUIRED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">AUDIT EVENT</span>
                <span className="text-[#A8AAA3] font-bold">APPEND-ONLY WHERE APPLICABLE</span>
              </div>
            </div>

            <div className="border-t border-[#242522] pt-3 space-y-2">
              <div className="text-[9px] font-mono text-[#5C5E58] tracking-widest uppercase font-bold">
                VISIBLE RULE
              </div>
              <div className="text-[10px] font-mono font-bold text-[#D6FF3F] bg-[#141513] p-2 border border-[#242522] uppercase">
                FRONTEND VISIBILITY DOES NOT GRANT ORGANIZATION AUTHORITY.
              </div>
              <p className="text-[10px] text-[#A8AAA3] font-sans leading-relaxed">
                The backend must verify tenant membership, role authority, and organization access before returning member data or accepting membership changes.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
