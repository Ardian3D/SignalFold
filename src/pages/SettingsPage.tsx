import { useSearchParams, useNavigate } from 'react-router-dom';
import { useFeedbackState } from '@/context/FeedbackStateContext';
import { RouteFeedbackState } from '@/components/feedback/RouteFeedbackState';
import { Settings, Lock, HelpCircle, AlertTriangle, Bell, Shield, Database, Eye, CheckCircle } from 'lucide-react';

export function SettingsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getFeedbackState } = useFeedbackState();
  const feedback = getFeedbackState('settings');

  if (feedback && feedback.isActive) {
    return (
      <RouteFeedbackState
        kind={feedback.kind}
        scope="settings"
        onRetry={feedback.retry}
      />
    );
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#242522]">
        <div className="space-y-1.5 text-left flex-1 min-w-0 w-full">
          <div 
            className="text-[9px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            NORTHSTAR COMMERCE / SETTINGS
          </div>
          <h2 
            className="text-3xl font-extrabold tracking-tight text-[#F3F1EA] uppercase"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            WORKSPACE SETTINGS
          </h2>
          <div className="text-[10px] font-mono font-bold text-[#D6FF3F] tracking-widest uppercase mb-2" style={{ fontFamily: 'var(--font-technical)' }}>
            USER & ORGANIZATION CONFIGURATION / FRONTEND PREVIEW
          </div>
          <p className="text-sm text-[#A8AAA3] w-full max-w-[640px] min-w-0 font-sans leading-relaxed break-normal whitespace-normal text-left">
            Review the user-preference and organization-setting fields that will be managed after authenticated Base44 records and permission enforcement are connected.
          </p>
        </div>

        {/* Operational Status Box */}
        <div 
          className="shrink-0 flex items-center gap-2 border border-[#242522] bg-[#141513]/30 px-3 py-2 rounded-[2px] self-start"
          aria-label="Settings Status Information"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
          <div className="space-y-0.5 text-left">
            <div 
              className="text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              SETTINGS MODE
            </div>
            <div className="text-[10px] font-mono font-bold text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
              READ-ONLY PREVIEW
            </div>
          </div>
        </div>
      </div>

      {/* Header Status Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-[#242522] bg-[#141513]/40 p-4 rounded-[2px] space-y-1.5 text-left">
          <div className="text-[8px] font-mono text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            SETTINGS MODE
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            READ-ONLY PREVIEW
          </div>
        </div>
        <div className="border border-[#242522] bg-[#141513]/40 p-4 rounded-[2px] space-y-1.5 text-left">
          <div className="text-[8px] font-mono text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            USER PREFERENCES
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            NOT CONNECTED
          </div>
        </div>
        <div className="border border-[#242522] bg-[#141513]/40 p-4 rounded-[2px] space-y-1.5 text-left">
          <div className="text-[8px] font-mono text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            ORGANIZATION SETTINGS
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-amber-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            NOT LOADED
          </div>
        </div>
        <div className="border border-[#242522] bg-[#141513]/40 p-4 rounded-[2px] space-y-1.5 text-left">
          <div className="text-[8px] font-mono text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            PERSISTENCE
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-rose-500 uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            BACKEND REQUIRED
          </div>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Settings content panels */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 01: Current Application Mode */}
          <div className="border border-[#242522] bg-[#141513]/20 rounded-[2px] p-6 space-y-6 text-left">
            <div className="flex items-center gap-2 pb-3 border-b border-[#242522]">
              <Settings className="w-4 h-4 text-[#D6FF3F]" />
              <h3 className="text-xs font-mono font-bold text-[#F3F1EA] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                01 / APPLICATION MODE
              </h3>
            </div>
            
            <div className="space-y-4">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-wide">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">APPLICATION</dt>
                  <dd className="text-[#F3F1EA] font-bold">SIGNALFOLD</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">FRONTEND MODE</dt>
                  <dd className="text-amber-500 font-bold">MOCK</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">CURRENT WORKSPACE</dt>
                  <dd className="text-[#F3F1EA] font-bold">NORTHSTAR COMMERCE</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">WORKSPACE SOURCE</dt>
                  <dd className="text-[#D6FF3F] font-bold">FRONTEND PREVIEW</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">BACKEND PLATFORM</dt>
                  <dd className="text-rose-500 font-bold">BASE44 / NOT CONNECTED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">AI PROVIDER</dt>
                  <dd className="text-rose-500 font-bold">DEEPSEEK / NOT CONNECTED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">REALTIME</dt>
                  <dd className="text-[#5C5E58] font-bold">NOT CONNECTED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">PERSISTENCE</dt>
                  <dd className="text-[#5C5E58] font-bold">NOT CONNECTED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4 sm:col-span-2">
                  <dt className="text-[#5C5E58]">ENVIRONMENT SECRET STATUS</dt>
                  <dd className="text-emerald-500 font-bold">NO SECRETS EXPOSED</dd>
                </div>
              </dl>
              
              <div className="space-y-2 pt-2 text-left">
                <p className="text-xs text-[#A8AAA3] leading-relaxed">
                  The frontend currently uses deterministic mock data and preview interactions. Authoritative application state will be provided by Base44 entities, functions, permissions, and realtime subscriptions.
                </p>
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-mono tracking-wide rounded-[1px] uppercase">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>FRONTEND MOCK MODE MUST NOT BE PRESENTED AS BACKEND AUTHORITY.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 02: Current Operator Preferences */}
          <div className="border border-[#242522] bg-[#141513]/20 rounded-[2px] p-6 space-y-6 text-left">
            <div className="flex items-center gap-2 pb-3 border-b border-[#242522]">
              <Eye className="w-4 h-4 text-[#D6FF3F]" />
              <h3 className="text-xs font-mono font-bold text-[#F3F1EA] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                02 / USER PREFERENCES
              </h3>
            </div>
            
            <div className="space-y-4">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-wide">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">IDENTITY</dt>
                  <dd className="text-[#F3F1EA] font-bold">CURRENT OPERATOR</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">IDENTITY SOURCE</dt>
                  <dd className="text-[#D6FF3F] font-bold">FRONTEND PREVIEW</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">DISPLAY NAME</dt>
                  <dd className="text-amber-500 font-bold">NOT LOADED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">AVATAR</dt>
                  <dd className="text-amber-500 font-bold">NOT LOADED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">TIMEZONE</dt>
                  <dd className="text-amber-500 font-bold">NOT LOADED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">DEFAULT ORGANIZATION</dt>
                  <dd className="text-amber-500 font-bold">NOT VERIFIED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">APPEARANCE PREFERENCE</dt>
                  <dd className="text-[#5C5E58] font-bold">NOT LOADED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">NOTIFICATION PREFERENCES</dt>
                  <dd className="text-[#5C5E58] font-bold">NOT LOADED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4 sm:col-span-2">
                  <dt className="text-[#5C5E58]">PREFERENCE RECORD</dt>
                  <dd className="text-rose-500 font-bold">NOT CONNECTED</dd>
                </div>
              </dl>
              
              <p className="text-xs text-[#A8AAA3] leading-relaxed pt-2">
                User display name, avatar, timezone, default organization, appearance, and notification preferences require an authenticated user record.
              </p>

              {/* Informational Appearance Register */}
              <div className="border border-[#242522] bg-[#0A0A0A] p-4 rounded-[2px] space-y-3 mt-4">
                <div className="text-[9px] font-mono text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                  CURRENT FRONTEND APPEARANCE
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-[10px] uppercase">
                  <div className="flex justify-between border-b border-[#242522]/60 pb-1">
                    <span className="text-[#5C5E58]">INTERFACE THEME</span>
                    <span className="text-[#F3F1EA] font-bold">DARK</span>
                  </div>
                  <div className="flex justify-between border-b border-[#242522]/60 pb-1">
                    <span className="text-[#5C5E58]">SOURCE</span>
                    <span className="text-[#A8AAA3] font-bold">STATIC PRESENTATION</span>
                  </div>
                  <div className="flex justify-between border-b border-[#242522]/60 pb-1 sm:col-span-2">
                    <span className="text-[#5C5E58]">SAVED USER PREFERENCE</span>
                    <span className="text-rose-500 font-bold">NOT CONNECTED</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                  <div className="flex items-center gap-1">
                    <button 
                      disabled 
                      type="button"
                      className="px-3 py-1.5 border border-[#242522] text-[#5C5E58] font-mono text-[10px] uppercase font-bold tracking-wider rounded-[2px] cursor-not-allowed bg-[#141513]/10"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      LIGHT
                    </button>
                    <button 
                      disabled 
                      type="button"
                      className="px-3 py-1.5 border border-[#242522] text-[#D6FF3F] font-mono text-[10px] uppercase font-bold tracking-wider rounded-[2px] cursor-not-allowed bg-[#141513]/30"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      DARK
                    </button>
                    <button 
                      disabled 
                      type="button"
                      className="px-3 py-1.5 border border-[#242522] text-[#5C5E58] font-mono text-[10px] uppercase font-bold tracking-wider rounded-[2px] cursor-not-allowed bg-[#141513]/10"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      SYSTEM
                    </button>
                  </div>
                  <div className="text-[9px] font-mono text-[#5C5E58] tracking-widest uppercase">
                    USER PREFERENCE STORAGE REQUIRED
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section 03: Organization Settings */}
          <div className="border border-[#242522] bg-[#141513]/20 rounded-[2px] p-6 space-y-6 text-left">
            <div className="flex items-center gap-2 pb-3 border-b border-[#242522]">
              <Shield className="w-4 h-4 text-[#D6FF3F]" />
              <h3 className="text-xs font-mono font-bold text-[#F3F1EA] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                03 / ORGANIZATION SETTINGS
              </h3>
            </div>
            
            <div className="space-y-4">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-wide">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">ORGANIZATION NAME</dt>
                  <dd className="text-[#F3F1EA] font-bold">NORTHSTAR COMMERCE</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">ORGANIZATION RECORD</dt>
                  <dd className="text-rose-500 font-bold">NOT CONNECTED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">ORGANIZATION SLUG</dt>
                  <dd className="text-amber-500 font-bold">NOT LOADED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">DEFAULT TIMEZONE</dt>
                  <dd className="text-amber-500 font-bold">NOT LOADED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">INCIDENT PREFIX</dt>
                  <dd className="text-amber-500 font-bold">NOT LOADED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">ORGANIZATION LOGO</dt>
                  <dd className="text-amber-500 font-bold">NOT LOADED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">PUBLIC STATUS</dt>
                  <dd className="text-[#5C5E58] font-bold">NOT CONNECTED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">PUBLIC STATUS TITLE</dt>
                  <dd className="text-amber-500 font-bold">NOT LOADED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4 sm:col-span-2">
                  <dt className="text-[#5C5E58]">PUBLIC STATUS DESCRIPTION</dt>
                  <dd className="text-amber-500 font-bold">NOT LOADED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">DEMO WORKSPACE FLAG</dt>
                  <dd className="text-[#D6FF3F] font-bold">FRONTEND PREVIEW</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">SETTINGS RECORD</dt>
                  <dd className="text-rose-500 font-bold">NOT CONNECTED</dd>
                </div>
              </dl>
              
              <p className="text-xs text-[#A8AAA3] leading-relaxed pt-2">
                Only an authenticated Organization Admin may update authoritative organization settings such as timezone, incident prefix, organization presentation, and public-status configuration.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  disabled
                  className="w-full sm:w-auto px-6 py-2 bg-[#141513]/30 border border-[#242522] text-[#5C5E58] text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] cursor-not-allowed min-h-[44px]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  EDIT ORGANIZATION SETTINGS
                </button>
                <div className="text-[10px] font-mono text-rose-500 tracking-wider font-bold uppercase">
                  ORGANIZATION ADMIN AUTHORITY REQUIRED
                </div>
              </div>
            </div>
          </div>

          {/* Section 04: Incident Configuration Reference */}
          <div className="border border-[#242522] bg-[#141513]/20 rounded-[2px] p-6 space-y-6 text-left">
            <div className="flex items-center gap-2 pb-3 border-b border-[#242522]">
              <Database className="w-4 h-4 text-[#D6FF3F]" />
              <h3 className="text-xs font-mono font-bold text-[#F3F1EA] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                04 / INCIDENT CONFIGURATION REFERENCE
              </h3>
            </div>
            
            <div className="space-y-4">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-wide">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">INITIAL INCIDENT STATUS</dt>
                  <dd className="text-[#A8AAA3] font-bold">REPORTED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">INCIDENT CODE</dt>
                  <dd className="text-[#A8AAA3] font-bold">SERVER GENERATED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">INCIDENT PREFIX</dt>
                  <dd className="text-amber-500 font-bold">ORGANIZATION SETTING REQUIRED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">STATE TRANSITIONS</dt>
                  <dd className="text-[#A8AAA3] font-bold">SERVER CONTROLLED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">SEVERITY AUTHORITY</dt>
                  <dd className="text-[#A8AAA3] font-bold">INCIDENT MANAGER OR ADMIN</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">TIMESTAMPS</dt>
                  <dd className="text-[#A8AAA3] font-bold">SERVER GENERATED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4 sm:col-span-2">
                  <dt className="text-[#5C5E58]">TIMELINE EVENTS</dt>
                  <dd className="text-[#A8AAA3] font-bold">APPEND-ONLY</dd>
                </div>
              </dl>
              
              <div className="space-y-2 pt-2 text-left">
                <p className="text-xs text-[#A8AAA3] leading-relaxed">
                  Incident configuration and state transitions must be enforced by backend functions. Settings cannot bypass the canonical incident state machine or permission model.
                </p>
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-mono tracking-wide rounded-[1px] uppercase">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>ORGANIZATION SETTINGS MUST NOT OVERRIDE INCIDENT SAFETY RULES.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 05: Notification Readiness */}
          <div className="border border-[#242522] bg-[#141513]/20 rounded-[2px] p-6 space-y-6 text-left">
            <div className="flex items-center gap-2 pb-3 border-b border-[#242522]">
              <Bell className="w-4 h-4 text-[#D6FF3F]" />
              <h3 className="text-xs font-mono font-bold text-[#F3F1EA] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                05 / NOTIFICATION READINESS
              </h3>
            </div>
            
            <div className="space-y-4">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-wide">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">IN-APP NOTIFICATIONS</dt>
                  <dd className="text-amber-500 font-bold">P1 / NOT CONNECTED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">CURRENT USER SUBSCRIPTION</dt>
                  <dd className="text-amber-500 font-bold">NOT LOADED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">INCIDENT ASSIGNMENT NOTICES</dt>
                  <dd className="text-[#5C5E58] font-bold">NOT CONNECTED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">TASK CLAIM NOTICES</dt>
                  <dd className="text-[#5C5E58] font-bold">NOT CONNECTED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">STATUS CHANGE NOTICES</dt>
                  <dd className="text-[#5C5E58] font-bold">NOT CONNECTED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">POSTMORTEM NOTICES</dt>
                  <dd className="text-[#5C5E58] font-bold">NOT CONNECTED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">EMAIL NOTIFICATIONS</dt>
                  <dd className="text-[#5C5E58] font-bold">OUT OF MVP FOUNDATION</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">EXTERNAL CHANNELS</dt>
                  <dd className="text-[#5C5E58] font-bold">OUT OF MVP FOUNDATION</dd>
                </div>
              </dl>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  disabled
                  className="w-full sm:w-auto px-6 py-2 bg-[#141513]/30 border border-[#242522] text-[#5C5E58] text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] cursor-not-allowed min-h-[44px]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  MANAGE NOTIFICATION PREFERENCES
                </button>
                <div className="text-[10px] font-mono text-[#5C5E58] tracking-wider uppercase">
                  USER RECORD AND NOTIFICATION BACKEND REQUIRED
                </div>
              </div>
            </div>
          </div>

          {/* Section 06: Demo Workspace */}
          <div className="border border-[#242522] bg-[#141513]/20 rounded-[2px] p-6 space-y-6 text-left">
            <div className="flex items-center gap-2 pb-3 border-b border-[#242522]">
              <Database className="w-4 h-4 text-[#D6FF3F]" />
              <h3 className="text-xs font-mono font-bold text-[#F3F1EA] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                06 / DEMO WORKSPACE
              </h3>
            </div>
            
            <div className="space-y-4">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-wide">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">WORKSPACE</dt>
                  <dd className="text-[#F3F1EA] font-bold">NORTHSTAR COMMERCE</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">FRONTEND DATA</dt>
                  <dd className="text-[#A8AAA3] font-bold">CANONICAL MOCK SEED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">BACKEND DEMO FLAG</dt>
                  <dd className="text-[#5C5E58] font-bold">NOT VERIFIED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">SEED OPERATION</dt>
                  <dd className="text-rose-500 font-bold">BACKEND FUNCTION REQUIRED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">RESET OPERATION</dt>
                  <dd className="text-rose-500 font-bold">BACKEND FUNCTION REQUIRED</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">REQUIRED AUTHORITY</dt>
                  <dd className="text-[#A8AAA3] font-bold">ORGANIZATION ADMIN</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">TYPED CONFIRMATION</dt>
                  <dd className="text-[#A8AAA3] font-bold">REQUIRED FOR RESET</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-[#242522]/40 gap-1 sm:gap-4">
                  <dt className="text-[#5C5E58]">TENANT SAFETY</dt>
                  <dd className="text-[#A8AAA3] font-bold">MATCHING DEMO ORGANIZATION ONLY</dd>
                </div>
              </dl>
              
              <p className="text-xs text-[#A8AAA3] leading-relaxed pt-2">
                Real demo seeding and reset operations must be idempotent, Admin-controlled, and restricted to records belonging to the current demo organization.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  disabled
                  className="px-4 py-2 bg-[#141513]/30 border border-[#242522] text-[#5C5E58] text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] cursor-not-allowed min-h-[44px]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  LOAD DEMO WORKSPACE
                </button>
                <button
                  disabled
                  className="px-4 py-2 bg-[#141513]/30 border border-[#242522] text-[#5C5E58] text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] cursor-not-allowed min-h-[44px]"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  RESET DEMO WORKSPACE
                </button>
                <div className="text-[10px] font-mono text-rose-500 tracking-wider font-bold uppercase">
                  ADMIN AUTHORITY AND BACKEND DEMO FUNCTION REQUIRED
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Summary panels / sidebar statistics */}
        <div className="space-y-6">
          
          {/* Settings Readiness Summary */}
          <div className="border border-[#242522] bg-[#141513]/40 p-4 rounded-[2px] space-y-4 text-left">
            <h3 className="text-xs font-mono font-bold text-[#F3F1EA] tracking-widest uppercase border-b border-[#242522] pb-2" style={{ fontFamily: 'var(--font-technical)' }}>
              SETTINGS READINESS
            </h3>
            
            <div className="space-y-2 font-mono text-[10px] uppercase">
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/60">
                <span className="text-[#5C5E58]">USER RECORD</span>
                <span className="text-rose-500 font-bold">NOT CONNECTED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/60">
                <span className="text-[#5C5E58]">ORGANIZATION RECORD</span>
                <span className="text-rose-500 font-bold">NOT CONNECTED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/60">
                <span className="text-[#5C5E58]">MEMBERSHIP</span>
                <span className="text-amber-500 font-bold">NOT VERIFIED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/60">
                <span className="text-[#5C5E58]">OPERATING ROLE</span>
                <span className="text-[#5C5E58] font-bold">NOT LOADED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/60">
                <span className="text-[#5C5E58]">PREFERENCE STORAGE</span>
                <span className="text-rose-500 font-bold">NOT CONNECTED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/60">
                <span className="text-[#5C5E58]">ADMIN AUTHORITY</span>
                <span className="text-amber-500 font-bold">NOT DETERMINED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/60">
                <span className="text-[#5C5E58]">AUDIT RECORD</span>
                <span className="text-[#5C5E58] font-bold">NOT CONNECTED</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-[#5C5E58]">MANAGEMENT ACTIONS</span>
                <span className="text-rose-500 font-bold">DISABLED</span>
              </div>
            </div>
          </div>

          {/* Current Operator Context */}
          <div className="border border-[#242522] bg-[#141513]/40 p-4 rounded-[2px] space-y-4 text-left">
            <h3 className="text-xs font-mono font-bold text-[#F3F1EA] tracking-widest uppercase border-b border-[#242522] pb-2" style={{ fontFamily: 'var(--font-technical)' }}>
              CURRENT OPERATOR CONTEXT
            </h3>
            
            <div className="space-y-2 font-mono text-[10px] uppercase">
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/60">
                <span className="text-[#5C5E58]">IDENTITY</span>
                <span className="text-[#A8AAA3] font-bold">CURRENT OPERATOR</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/60">
                <span className="text-[#5C5E58]">IDENTITY SOURCE</span>
                <span className="text-[#D6FF3F] font-bold">FRONTEND PREVIEW</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/60">
                <span className="text-[#5C5E58]">ORGANIZATION MEMBERSHIP</span>
                <span className="text-[#5C5E58] font-bold">NOT VERIFIED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/60">
                <span className="text-[#5C5E58]">OPERATING ROLE</span>
                <span className="text-[#5C5E58] font-bold">NOT LOADED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/60">
                <span className="text-[#5C5E58]">SETTINGS AUTHORITY</span>
                <span className="text-amber-500 font-bold">NOT DETERMINED</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-[#5C5E58]">TENANT ACCESS</span>
                <span className="text-[#5C5E58] font-bold">NOT VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Section 07: Security & Authority Contract */}
          <div className="border border-[#242522] bg-[#141513]/40 p-4 rounded-[2px] space-y-4 text-left">
            <div className="flex items-center gap-2 border-b border-[#242522] pb-2">
              <Lock className="w-4 h-4 text-[#D6FF3F]" />
              <h3 className="text-xs font-mono font-bold text-[#F3F1EA] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                07 / AUTHORITY CONTRACT
              </h3>
            </div>
            
            <div className="space-y-2 font-mono text-[10px] uppercase">
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/60">
                <span className="text-[#5C5E58]">USER PREFERENCES</span>
                <span className="text-[#A8AAA3] font-bold">USER RECORD</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/60">
                <span className="text-[#5C5E58]">ORGANIZATION SETTINGS</span>
                <span className="text-[#A8AAA3] font-bold">ADMIN ONLY</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/60">
                <span className="text-[#5C5E58]">MEMBERSHIP</span>
                <span className="text-[#A8AAA3] font-bold">ACTIVE TENANT</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/60">
                <span className="text-[#5C5E58]">ROLE VERIFICATION</span>
                <span className="text-[#A8AAA3] font-bold">SERVER CONTROLLED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/60">
                <span className="text-[#5C5E58]">PERSISTENCE</span>
                <span className="text-[#A8AAA3] font-bold">BASE44 ENTITY</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/60">
                <span className="text-[#5C5E58]">PRIVILEGED CHANGES</span>
                <span className="text-[#A8AAA3] font-bold">BACKEND FUNCTION</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/60">
                <span className="text-[#5C5E58]">AUDIT HISTORY</span>
                <span className="text-[#A8AAA3] font-bold">SERVER CREATED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/60">
                <span className="text-[#5C5E58]">TENANT ISOLATION</span>
                <span className="text-[#A8AAA3] font-bold">MANDATORY</span>
              </div>
              <div className="flex justify-between items-center py-0.5 pb-2">
                <span className="text-[#5C5E58]">SECRETS</span>
                <span className="text-[#A8AAA3] font-bold">SERVER SIDE ONLY</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-mono tracking-wide rounded-[1px] uppercase">
                <Shield className="w-3.5 h-3.5" />
                <span>VIEWING SETTINGS DOES NOT GRANT AUTHORITY TO CHANGE THEM.</span>
              </div>
              <p className="text-[11px] text-[#A8AAA3] leading-relaxed">
                Base44 must verify user identity, organization membership, tenant access, and role authority before loading or updating settings. The frontend must never become the source of permission truth.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
