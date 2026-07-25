import { useSearchParams, useNavigate } from 'react-router-dom';
import { useFeedbackState } from '@/context/FeedbackStateContext';
import { RouteFeedbackState } from '@/components/feedback/RouteFeedbackState';
import { Server, Lock, ExternalLink, Database, History, HelpCircle } from 'lucide-react';

export function ServicesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getFeedbackState } = useFeedbackState();
  const feedback = getFeedbackState('services');

  if (feedback && feedback.isActive) {
    return (
      <RouteFeedbackState
        kind={feedback.kind}
        scope="services"
        onRetry={feedback.retry}
      />
    );
  }

  const canonicalServices = [
    {
      id: 'checkout-web',
      name: 'CHECKOUT WEB',
      description: 'NOT AVAILABLE',
      owner: 'NOT LOADED',
      status: 'NOT CONNECTED',
      activeIncidentQuery: 'NOT CONNECTED',
      incidentCount: 'NOT AVAILABLE',
      members: 'NOT LOADED',
      lastUpdated: 'NOT AVAILABLE',
      persistence: 'NOT CONNECTED',
      authority: 'BACKEND REQUIRED',
    },
    {
      id: 'payments-api',
      name: 'PAYMENTS API',
      description: 'NOT AVAILABLE',
      owner: 'NOT LOADED',
      status: 'NOT CONNECTED',
      activeIncidentQuery: 'NOT CONNECTED',
      incidentCount: 'NOT AVAILABLE',
      members: 'NOT LOADED',
      lastUpdated: 'NOT AVAILABLE',
      persistence: 'NOT CONNECTED',
      authority: 'BACKEND REQUIRED',
      hasReference: true,
      reference: {
        incident: 'SF-2026-0042',
        type: 'CANONICAL DEMO INCIDENT',
        link: '/app/incidents/SF-2026-0042',
      },
    },
    {
      id: 'order-processor',
      name: 'ORDER PROCESSOR',
      description: 'NOT AVAILABLE',
      owner: 'NOT LOADED',
      status: 'NOT CONNECTED',
      activeIncidentQuery: 'NOT CONNECTED',
      incidentCount: 'NOT AVAILABLE',
      members: 'NOT LOADED',
      lastUpdated: 'NOT AVAILABLE',
      persistence: 'NOT CONNECTED',
      authority: 'BACKEND REQUIRED',
    },
    {
      id: 'customer-portal',
      name: 'CUSTOMER PORTAL',
      description: 'NOT AVAILABLE',
      owner: 'NOT LOADED',
      status: 'NOT CONNECTED',
      activeIncidentQuery: 'NOT CONNECTED',
      incidentCount: 'NOT AVAILABLE',
      members: 'NOT LOADED',
      lastUpdated: 'NOT AVAILABLE',
      persistence: 'NOT CONNECTED',
      authority: 'BACKEND REQUIRED',
    },
  ];

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#242522]">
        <div className="space-y-1.5 text-left flex-1 min-w-0 w-full">
          <div 
            className="text-[9px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            SERVICE CATALOG / READ-ONLY WORKSPACE PREVIEW
          </div>
          <h2 
            className="text-3xl font-extrabold tracking-tight text-[#F3F1EA] uppercase"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            SERVICES
          </h2>
          <p className="text-sm text-[#A8AAA3] w-full max-w-[640px] min-w-0 font-sans leading-relaxed break-normal whitespace-normal text-left">
            Review the services that may be associated with incidents in the Northstar Commerce workspace. Service ownership, health, and management actions require authoritative backend records.
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
              CATALOG STATE
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
            CATALOG STATE
          </div>
          <div className="text-sm font-mono font-bold text-[#A8AAA3]" style={{ fontFamily: 'var(--font-technical)' }}>
            FRONTEND SEED
          </div>
        </div>
        <div className="border border-[#242522] bg-[#141513]/40 p-4 rounded-[2px] space-y-1.5 text-left">
          <div className="text-[8px] font-mono text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            SERVICE RECORDS
          </div>
          <div className="text-sm font-mono font-bold text-[#D6FF3F]" style={{ fontFamily: 'var(--font-technical)' }}>
            4 CANONICAL SERVICES
          </div>
        </div>
        <div className="border border-[#242522] bg-[#141513]/40 p-4 rounded-[2px] space-y-1.5 text-left">
          <div className="text-[8px] font-mono text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            BACKEND QUERY
          </div>
          <div className="text-sm font-mono font-bold text-amber-500" style={{ fontFamily: 'var(--font-technical)' }}>
            NOT CONNECTED
          </div>
        </div>
        <div className="border border-[#242522] bg-[#141513]/40 p-4 rounded-[2px] space-y-1.5 text-left">
          <div className="text-[8px] font-mono text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            MANAGEMENT
          </div>
          <div className="text-sm font-mono font-bold text-[#5C5E58]" style={{ fontFamily: 'var(--font-technical)' }}>
            BACKEND AUTHORITY REQUIRED
          </div>
        </div>
      </div>

      {/* 3. Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Services List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            {canonicalServices.map((service) => (
              <div 
                key={service.id}
                className="border border-[#242522] bg-[#0A0A0A] p-5 rounded-[2px] space-y-4 text-left hover:border-[#5C5E58]/40 transition-colors"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-4 border-b border-[#242522] pb-3">
                  <div className="flex items-center gap-2.5">
                    <Server className="w-4 h-4 text-[#A8AAA3]" />
                    <h3 
                      className="text-sm font-mono font-extrabold tracking-wide text-[#F3F1EA]"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      {service.name}
                    </h3>
                  </div>
                  <span 
                    className="text-[9px] font-mono px-2 py-0.5 border border-amber-500/20 bg-amber-500/5 text-amber-500 rounded-[1px] font-bold"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    {service.status}
                  </span>
                </div>

                {/* Grid Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 font-mono text-[10px] uppercase tracking-wider">
                  <div className="flex justify-between items-center py-0.5 border-b border-[#141513]">
                    <span className="text-[#5C5E58]">OWNER</span>
                    <span className="text-[#A8AAA3] font-bold">{service.owner}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-b border-[#141513]">
                    <span className="text-[#5C5E58]">SERVICE DESCRIPTION</span>
                    <span className="text-[#5C5E58]">{service.description}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-b border-[#141513]">
                    <span className="text-[#5C5E58]">OPERATIONAL STATUS</span>
                    <span className="text-amber-500 font-bold">{service.status}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-b border-[#141513]">
                    <span className="text-[#5C5E58]">ACTIVE INCIDENT QUERY</span>
                    <span className="text-amber-500 font-bold">{service.activeIncidentQuery}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-b border-[#141513]">
                    <span className="text-[#5C5E58]">INCIDENT COUNT</span>
                    <span className="text-[#5C5E58]">{service.incidentCount}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-b border-[#141513]">
                    <span className="text-[#5C5E58]">SERVICE MEMBERS</span>
                    <span className="text-[#A8AAA3] font-bold">{service.members}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-b border-[#141513]">
                    <span className="text-[#5C5E58]">LAST UPDATED</span>
                    <span className="text-[#5C5E58]">{service.lastUpdated}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5 border-b border-[#141513]">
                    <span className="text-[#5C5E58]">PERSISTENCE</span>
                    <span className="text-[#5C5E58]">{service.persistence}</span>
                  </div>
                  <div className="sm:col-span-2 flex justify-between items-center py-0.5 border-b border-[#141513]">
                    <span className="text-[#5C5E58]">MANAGEMENT AUTHORITY</span>
                    <span className="text-amber-500 font-bold">{service.authority}</span>
                  </div>
                </div>

                {/* Special Frontend Incident Reference for Payments API */}
                {service.hasReference && service.reference && (
                  <div className="mt-3 p-3 bg-[#141513] border border-dashed border-[#242522] rounded-[2px] space-y-2.5">
                    <div className="text-[8px] font-mono tracking-widest text-amber-500 font-extrabold uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                      AVAILABLE FRONTEND INCIDENT REFERENCE
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 font-mono text-[10px] uppercase">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#5C5E58]">INCIDENT:</span>
                        <span className="text-[#F3F1EA] font-bold">{service.reference.incident}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#5C5E58]">REFERENCE TYPE:</span>
                        <span className="text-[#A8AAA3]">{service.reference.type}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(service.reference!.link)}
                      className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#D6FF3F] hover:underline uppercase"
                      style={{ fontFamily: 'var(--font-technical)' }}
                    >
                      OPEN RELATED INCIDENT <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Rail: Catalog Summary & Management Console */}
        <div className="space-y-6">
          
          {/* Summary Box */}
          <div className="border border-[#242522] bg-[#141513]/30 p-5 rounded-[2px] text-left space-y-4">
            <h3 
              className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase border-b border-[#242522] pb-2"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              SERVICE CATALOG SUMMARY
            </h3>
            <div className="space-y-2.5 font-mono text-[10px] uppercase tracking-wider">
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">ORGANIZATION</span>
                <span className="text-[#A8AAA3] font-bold">NORTHSTAR COMMERCE</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">CATALOG SOURCE</span>
                <span className="text-[#A8AAA3] font-bold">CANONICAL FRONTEND SEED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">TOTAL SERVICE NAMES</span>
                <span className="text-[#D6FF3F] font-bold">4</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">OWNERSHIP DATA</span>
                <span className="text-amber-500 font-bold">NOT LOADED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">HEALTH DATA</span>
                <span className="text-amber-500 font-bold">NOT CONNECTED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">INCIDENT RELATIONSHIPS</span>
                <span className="text-amber-500 font-bold">BACKEND QUERY REQUIRED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">MANAGEMENT ACTIONS</span>
                <span className="text-amber-500 font-bold">NOT AVAILABLE</span>
              </div>
            </div>
            <div 
              className="p-2.5 bg-[#0A0A0A]/80 border border-[#242522] text-[8px] font-mono text-[#A8AAA3] leading-relaxed uppercase"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              SERVICE NAMES ARE CANONICAL. OPERATIONAL METADATA IS NOT LOADED.
            </div>
          </div>

          {/* Service Management Readiness */}
          <div className="border border-[#242522] bg-[#141513]/30 p-5 rounded-[2px] text-left space-y-4">
            <h3 
              className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase border-b border-[#242522] pb-2"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              SERVICE MANAGEMENT READINESS
            </h3>
            
            <div className="space-y-2.5 font-mono text-[10px] uppercase tracking-wider mb-4">
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">CREATE SERVICE</span>
                <span className="text-amber-500 font-bold">BACKEND REQUIRED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">EDIT SERVICE</span>
                <span className="text-amber-500 font-bold">BACKEND REQUIRED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">ARCHIVE SERVICE</span>
                <span className="text-amber-500 font-bold">BACKEND REQUIRED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">ASSIGN OWNER</span>
                <span className="text-amber-500 font-bold">BACKEND REQUIRED</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#242522]/30">
                <span className="text-[#5C5E58]">DEPENDENCY MANAGEMENT</span>
                <span className="text-[#5C5E58] font-bold">NOT IN PREVIEW</span>
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
                <Lock className="w-3 h-3" /> CREATE SERVICE
              </button>
              <button
                disabled
                className="w-full py-2 bg-[#141513] border border-[#242522] text-[#5C5E58] text-[10px] font-mono font-bold uppercase tracking-wider rounded-[2px] cursor-not-allowed flex items-center justify-center gap-2"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                <Lock className="w-3 h-3" /> EDIT SELECTED SERVICE
              </button>
              <button
                disabled
                className="w-full py-2 bg-[#141513] border border-[#242522] text-[#5C5E58] text-[10px] font-mono font-bold uppercase tracking-wider rounded-[2px] cursor-not-allowed flex items-center justify-center gap-2"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                <Lock className="w-3 h-3" /> ARCHIVE SERVICE
              </button>
            </div>

            <div className="text-center pt-2">
              <span 
                className="inline-block text-[8px] font-mono px-2 py-0.5 border border-rose-500/20 bg-rose-500/5 text-rose-500 rounded-[1px] font-bold uppercase"
                style={{ fontFamily: 'var(--font-technical)' }}
              >
                ADMIN AUTHORITY AND BACKEND RECORDS REQUIRED
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
