import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export interface IncidentRecord {
  code: string;
  title: string;
  description: string;
  status: string;
  service: string;
  customerSignal?: string;
  severity: string;
  severityAuthority?: string;
  commander: string;
  responseTasks?: string;
  updatedTime: string;
  postmortem: string;
  isLimited: boolean;
}

export const mockIncidents: IncidentRecord[] = [
  {
    code: 'SF-2026-0042',
    title: 'Checkout payments failing after latest deployment',
    description: 'Customers cannot complete card payments after the latest deployment.',
    status: 'REPORTED',
    service: 'PAYMENTS API',
    customerSignal: '37 REPORTS / 12 MINUTES',
    severity: 'AI SUGGESTION / SEV1',
    severityAuthority: 'HUMAN CONFIRMATION REQUIRED',
    commander: 'UNASSIGNED',
    responseTasks: '5 RECOMMENDED',
    updatedTime: 'NOT AVAILABLE',
    postmortem: 'NOT AVAILABLE',
    isLimited: false
  },
  {
    code: 'NOT SPECIFIED',
    title: 'ACTIVE SEV2 SEED RECORD',
    description: 'An additional active SEV2 incident exists in the canonical demo workspace. Detailed identity has not yet been specified.',
    status: 'ACTIVE / DETAIL NOT SPECIFIED',
    service: 'NOT SPECIFIED',
    severity: 'SEV2',
    commander: 'NOT SPECIFIED',
    updatedTime: 'NOT AVAILABLE',
    postmortem: 'NOT AVAILABLE',
    isLimited: true
  },
  {
    code: 'NOT SPECIFIED',
    title: 'RESOLVED INCIDENT SEED RECORD',
    description: 'The canonical demo workspace includes one resolved incident with an approved Postmortem. Detailed incident identity has not yet been specified.',
    status: 'RESOLVED',
    service: 'NOT SPECIFIED',
    severity: 'NOT SPECIFIED',
    commander: 'NOT SPECIFIED',
    updatedTime: 'NOT AVAILABLE',
    postmortem: 'APPROVED',
    isLimited: true
  }
];

/**
 * SignalFold — Incident List Page Foundation and Filter Toolbar
 * Implements search, severity, status, service, commander, sort, and direction filters
 * synchronized with URL query parameters and local frontend states.
 */
export function IncidentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Allowed lists for safe parameter validation
  const validSeverities = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];
  const validStatuses = ['reported', 'triaging', 'investigating', 'identified', 'monitoring', 'resolved', 'closed'];
  const validServices = ['Checkout Web', 'Payments API', 'Order Processor', 'Customer Portal'];
  const validCommanders = ['UNASSIGNED'];
  const validSorts = ['CREATED TIME', 'SEVERITY', 'UPDATED TIME'];
  const validDirections = ['ASCENDING', 'DESCENDING'];

  // Helper functions to retrieve valid initial values from URL
  const getInitialQ = () => searchParams.get('q') || '';
  
  const getInitialSeverity = () => {
    const val = searchParams.get('severity');
    return (val && validSeverities.includes(val)) ? val : 'ALL';
  };

  const getInitialStatus = () => {
    const val = searchParams.get('status');
    return (val && validStatuses.includes(val)) ? val : 'ALL';
  };

  const getInitialService = () => {
    const val = searchParams.get('service');
    return (val && validServices.includes(val)) ? val : 'ALL';
  };

  const getInitialCommander = () => {
    const val = searchParams.get('commander');
    return (val && validCommanders.includes(val)) ? val : 'ALL';
  };

  const getInitialSort = () => {
    const val = searchParams.get('sort');
    return (val && validSorts.includes(val)) ? val : 'UPDATED TIME';
  };

  const getInitialDirection = () => {
    const val = searchParams.get('direction');
    return (val && validDirections.includes(val)) ? val : 'DESCENDING';
  };

  // Local controlled frontend states
  const [searchVal, setSearchVal] = useState(getInitialQ);
  const [severityVal, setSeverityVal] = useState(getInitialSeverity);
  const [statusVal, setStatusVal] = useState(getInitialStatus);
  const [serviceVal, setServiceVal] = useState(getInitialService);
  const [commanderVal, setCommanderVal] = useState(getInitialCommander);
  const [sortVal, setSortVal] = useState(getInitialSort);
  const [directionVal, setDirectionVal] = useState(getInitialDirection);

  const [resetAnnouncement, setResetAnnouncement] = useState('');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1280);

  useEffect(() => {
    if (!containerRef.current) return;
    if (typeof ResizeObserver === 'undefined') {
      setContainerWidth(typeof window !== 'undefined' ? window.innerWidth : 1280);
      return;
    }
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      setContainerWidth(width);
    });
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Handle updates when other components or back/forward buttons change searchParams
  useEffect(() => {
    setSearchVal(getInitialQ());
    setSeverityVal(getInitialSeverity());
    setStatusVal(getInitialStatus());
    setServiceVal(getInitialService());
    setCommanderVal(getInitialCommander());
    setSortVal(getInitialSort());
    setDirectionVal(getInitialDirection());
  }, [searchParams]);

  // Combined update utility that changes local state and synchronizes URL query params
  const updateFilter = (
    key: string,
    value: string,
    defaultValue: string,
    setter: (val: string) => void
  ) => {
    setter(value);
    
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== defaultValue) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  // Dedicated search input handler
  const handleSearchChange = (val: string) => {
    setSearchVal(val);
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('q', val);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  // Reset Filters functionality
  const handleResetFilters = () => {
    setSearchVal('');
    setSeverityVal('ALL');
    setStatusVal('ALL');
    setServiceVal('ALL');
    setCommanderVal('ALL');
    setSortVal('UPDATED TIME');
    setDirectionVal('DESCENDING');

    // Retain unrelated parameters by starting with existing params
    const newParams = new URLSearchParams(searchParams);
    
    // Explicitly delete only the filter-toolbar related parameters
    const filterKeys = ['q', 'severity', 'status', 'service', 'commander', 'sort', 'direction'];
    filterKeys.forEach(key => newParams.delete(key));
    
    setSearchParams(newParams);

    // Accessibility announcement for screen readers
    setResetAnnouncement('Filters reset to default values.');
    setTimeout(() => {
      setResetAnnouncement('');
    }, 3000);
  };

  // 1. Check if filtering is active
  const isFiltered = searchVal !== '' || severityVal !== 'ALL' || statusVal !== 'ALL' || serviceVal !== 'ALL' || commanderVal !== 'ALL';

  // 2. Filter records
  const filteredRecords = mockIncidents.filter((record) => {
    // Search query
    if (searchVal.trim() !== '') {
      const q = searchVal.toLowerCase();
      const codeMatch = record.code.toLowerCase().includes(q);
      const titleMatch = record.title.toLowerCase().includes(q);
      const descMatch = record.description.toLowerCase().includes(q);
      if (!codeMatch && !titleMatch && !descMatch) {
        return false;
      }
    }

    // Severity filter
    if (severityVal !== 'ALL') {
      if (record.severity !== severityVal) {
        return false;
      }
    }

    // Status filter
    if (statusVal !== 'ALL') {
      if (record.status.toLowerCase() !== statusVal.toLowerCase()) {
        return false;
      }
    }

    // Service filter
    if (serviceVal !== 'ALL') {
      if (record.service.toLowerCase() !== serviceVal.toLowerCase()) {
        return false;
      }
    }

    // Commander filter
    if (commanderVal !== 'ALL') {
      if (record.commander.toLowerCase() !== commanderVal.toLowerCase()) {
        return false;
      }
    }

    return true;
  });

  // 3. Helper for severity sorting ranks
  const getSeverityRank = (rec: IncidentRecord) => {
    if (rec.severity === 'SEV2') return 2;
    return 999; // AI suggestions and unconfirmed/unspecified appear last
  };

  // 4. Sort records
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    // If sorting by CREATED TIME or UPDATED TIME, always return the index order of standard array (stable canonical)
    if (sortVal === 'CREATED TIME' || sortVal === 'UPDATED TIME') {
      const indexA = mockIncidents.indexOf(a);
      const indexB = mockIncidents.indexOf(b);
      return indexA - indexB;
    }

    if (sortVal === 'SEVERITY') {
      const isUnconfirmedA = a.severity === 'NOT SPECIFIED' || a.severity.includes('AI SUGGESTION');
      const isUnconfirmedB = b.severity === 'NOT SPECIFIED' || b.severity.includes('AI SUGGESTION');
      
      if (isUnconfirmedA && !isUnconfirmedB) {
        return 1; // unconfirmed always goes last
      }
      if (!isUnconfirmedA && isUnconfirmedB) {
        return -1; // unconfirmed always goes last
      }
      if (isUnconfirmedA && isUnconfirmedB) {
        return mockIncidents.indexOf(a) - mockIncidents.indexOf(b); // stable order for unconfirmed
      }
      
      // Both are confirmed
      const rankA = getSeverityRank(a);
      const rankB = getSeverityRank(b);
      if (rankA !== rankB) {
        return directionVal === 'ASCENDING' ? rankA - rankB : rankB - rankA;
      }
    }
    
    // For tie-breakers, use index order (stable)
    const indexA = mockIncidents.indexOf(a);
    const indexB = mockIncidents.indexOf(b);
    return indexA - indexB;
  });

  return (
    <section className="space-y-6">
      {/* Offscreen ARIA announcement for Reset action */}
      <div className="sr-only" aria-live="polite">
        {resetAnnouncement}
      </div>

      {/* 1. Page Header operational introduction */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#242522]">
        <div className="space-y-1.5 text-left flex-1 min-w-0 w-full">
          <div 
            className="text-[9px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
            style={{ fontFamily: 'var(--font-technical)' }}
          >
            INCIDENT REGISTRY / FRONTEND PREVIEW
          </div>
          <h2 
            className="text-3xl font-extrabold tracking-tight text-[#F3F1EA] uppercase"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            INCIDENTS
          </h2>
          <p className="text-sm text-[#A8AAA3] w-full max-w-[640px] min-w-0 font-sans leading-relaxed break-normal whitespace-normal text-left">
            Search, filter, and review incident records across the Northstar Commerce response workspace.
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
              DATA CONNECTION
            </div>
            <div 
              className="text-[10px] font-mono font-bold text-[#A8AAA3]" 
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              NOT ACTIVE
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter Toolbar beneath page header */}
      <div 
        className="bg-[#0D0E0C] border border-[#242522] rounded-[2px] p-4 space-y-4"
        aria-label="Filter Toolbar Panel"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end gap-4">
          
          {/* SEARCH field */}
          <div className="flex-1 min-w-[240px] space-y-1.5 text-left">
            <label 
              htmlFor="search-incidents" 
              className="block text-[9px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              SEARCH INCIDENTS
            </label>
            <input
              id="search-incidents"
              type="text"
              placeholder="Search title, code, or description"
              value={searchVal}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#242522] rounded-[2px] px-3 py-1.5 text-xs font-sans text-[#F3F1EA] placeholder-[#5C5E58] focus:outline-none focus:border-[#D6FF3F] focus:ring-1 focus:ring-[#D6FF3F] transition-colors"
            />
          </div>

          {/* SEVERITY field */}
          <div className="space-y-1.5 text-left min-w-[140px] w-full sm:w-auto">
            <label 
              htmlFor="filter-severity" 
              className="block text-[9px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              SEVERITY
            </label>
            <select
              id="filter-severity"
              value={severityVal}
              onChange={(e) => updateFilter('severity', e.target.value, 'ALL', setSeverityVal)}
              className="w-full bg-[#0A0A0A] border border-[#242522] rounded-[2px] px-3 py-1.5 text-xs font-mono font-bold text-[#A8AAA3] focus:outline-none focus:border-[#D6FF3F] transition-colors cursor-pointer"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <option value="ALL">ALL SEVERITIES</option>
              <option value="SEV1">SEV1</option>
              <option value="SEV2">SEV2</option>
              <option value="SEV3">SEV3</option>
              <option value="SEV4">SEV4</option>
            </select>
          </div>

          {/* STATUS field */}
          <div className="space-y-1.5 text-left min-w-[140px] w-full sm:w-auto">
            <label 
              htmlFor="filter-status" 
              className="block text-[9px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              STATUS
            </label>
            <select
              id="filter-status"
              value={statusVal}
              onChange={(e) => updateFilter('status', e.target.value, 'ALL', setStatusVal)}
              className="w-full bg-[#0A0A0A] border border-[#242522] rounded-[2px] px-3 py-1.5 text-xs font-mono font-bold text-[#A8AAA3] focus:outline-none focus:border-[#D6FF3F] transition-colors cursor-pointer"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <option value="ALL">ALL STATUSES</option>
              <option value="reported">REPORTED</option>
              <option value="triaging">TRIAGING</option>
              <option value="investigating">INVESTIGATING</option>
              <option value="identified">IDENTIFIED</option>
              <option value="monitoring">MONITORING</option>
              <option value="resolved">RESOLVED</option>
              <option value="closed">CLOSED</option>
            </select>
          </div>

          {/* SERVICE field */}
          <div className="space-y-1.5 text-left min-w-[150px] w-full sm:w-auto">
            <label 
              htmlFor="filter-service" 
              className="block text-[9px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              SERVICE
            </label>
            <select
              id="filter-service"
              value={serviceVal}
              onChange={(e) => updateFilter('service', e.target.value, 'ALL', setServiceVal)}
              className="w-full bg-[#0A0A0A] border border-[#242522] rounded-[2px] px-3 py-1.5 text-xs font-mono font-bold text-[#A8AAA3] focus:outline-none focus:border-[#D6FF3F] transition-colors cursor-pointer"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <option value="ALL">ALL SERVICES</option>
              <option value="Checkout Web">Checkout Web</option>
              <option value="Payments API">Payments API</option>
              <option value="Order Processor">Order Processor</option>
              <option value="Customer Portal">Customer Portal</option>
            </select>
          </div>

          {/* COMMANDER field */}
          <div className="space-y-1.5 text-left min-w-[150px] w-full sm:w-auto">
            <label 
              htmlFor="filter-commander" 
              className="block text-[9px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              COMMANDER
            </label>
            <select
              id="filter-commander"
              value={commanderVal}
              onChange={(e) => updateFilter('commander', e.target.value, 'ALL', setCommanderVal)}
              className="w-full bg-[#0A0A0A] border border-[#242522] rounded-[2px] px-3 py-1.5 text-xs font-mono font-bold text-[#A8AAA3] focus:outline-none focus:border-[#D6FF3F] transition-colors cursor-pointer"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <option value="ALL">ALL COMMANDERS</option>
              <option value="UNASSIGNED">UNASSIGNED</option>
            </select>
          </div>

          {/* SORT BY field */}
          <div className="space-y-1.5 text-left min-w-[140px] w-full sm:w-auto">
            <label 
              htmlFor="filter-sort" 
              className="block text-[9px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              SORT BY
            </label>
            <select
              id="filter-sort"
              value={sortVal}
              onChange={(e) => updateFilter('sort', e.target.value, 'UPDATED TIME', setSortVal)}
              className="w-full bg-[#0A0A0A] border border-[#242522] rounded-[2px] px-3 py-1.5 text-xs font-mono font-bold text-[#A8AAA3] focus:outline-none focus:border-[#D6FF3F] transition-colors cursor-pointer"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <option value="CREATED TIME">CREATED TIME</option>
              <option value="SEVERITY">SEVERITY</option>
              <option value="UPDATED TIME">UPDATED TIME</option>
            </select>
          </div>

          {/* SORT DIRECTION field */}
          <div className="space-y-1.5 text-left min-w-[130px] w-full sm:w-auto">
            <label 
              htmlFor="filter-direction" 
              className="block text-[9px] font-mono font-bold tracking-widest text-[#5C5E58] uppercase"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              SORT DIRECTION
            </label>
            <select
              id="filter-direction"
              value={directionVal}
              onChange={(e) => updateFilter('direction', e.target.value, 'DESCENDING', setDirectionVal)}
              className="w-full bg-[#0A0A0A] border border-[#242522] rounded-[2px] px-3 py-1.5 text-xs font-mono font-bold text-[#A8AAA3] focus:outline-none focus:border-[#D6FF3F] transition-colors cursor-pointer"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              <option value="ASCENDING">ASCENDING</option>
              <option value="DESCENDING">DESCENDING</option>
            </select>
          </div>

          {/* RESET FILTERS trigger */}
          <div className="w-full lg:w-auto lg:ml-auto pt-2 lg:pt-0">
            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full lg:w-auto px-4 py-2 border border-[#242522] bg-[#141513]/30 hover:bg-[#D6FF3F]/10 hover:text-[#D6FF3F] hover:border-[#D6FF3F]/30 text-[#A8AAA3] text-xs font-mono font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D6FF3F]"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              RESET FILTERS
            </button>
          </div>

        </div>
      </div>

      {/* 3. Compact technical rail underneath the filter controls */}
      <div 
        className="grid grid-cols-2 md:grid-cols-4 border border-[#242522] bg-[#141513]/10 divide-y md:divide-y-0 md:divide-x divide-[#242522] rounded-[2px]"
        aria-label="Filter Registry State Metadata"
      >
        <div className="p-3 space-y-1">
          <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            FILTER STATE
          </span>
          <span className="block text-[10px] font-mono font-bold text-[#A8AAA3] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            LOCAL FRONTEND
          </span>
        </div>

        <div className="p-3 space-y-1">
          <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            RESULT DATA
          </span>
          <span className="block text-[10px] font-mono font-bold text-[#A8AAA3] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            3 MOCK RECORDS
          </span>
        </div>

        <div className="p-3 space-y-1">
          <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            URL SYNC
          </span>
          <span className="block text-[10px] font-mono font-bold text-[#A8AAA3] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            ACTIVE
          </span>
        </div>

        <div className="p-3 space-y-1">
          <span className="block text-[8px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            BACKEND QUERY
          </span>
          <span className="block text-[10px] font-mono font-bold text-[#5C5E58] uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
            NOT CONNECTED
          </span>
        </div>
      </div>

      {/* 4. Incident Records Results Region */}
      <section 
        ref={containerRef}
        className="border border-[#242522] bg-[#0A0A0A]/40 rounded-[2px]"
        style={{ containerType: 'inline-size' }}
        aria-label="Incident List Results"
      >
        {/* Results Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#242522] bg-[#0F100D] px-4 py-3 gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h3 
              className="text-xs font-mono font-bold tracking-widest text-[#F3F1EA] uppercase"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              INCIDENT RECORDS
            </h3>
            <span className="text-[#242522] hidden sm:inline" aria-hidden="true" style={{ fontFamily: 'var(--font-technical)' }}>/</span>
            <span 
              className="text-[9px] font-mono font-bold text-[#5C5E58] tracking-widest uppercase hidden sm:inline"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              NORTHSTAR COMMERCE / LOCAL MOCK DATA
            </span>
            <span className="text-[#242522]" aria-hidden="true" style={{ fontFamily: 'var(--font-technical)' }}>/</span>
            <span 
              className="text-[9px] font-mono font-bold text-[#D6FF3F] tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-technical)' }}
            >
              FILTERING / LOCAL FRONTEND
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 text-[9px] font-mono font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-technical)' }}>
            {isFiltered && (
              <span className="text-[#D6FF3F] px-1.5 py-0.5 border border-[#D6FF3F]/20 bg-[#D6FF3F]/5 rounded-[1px]">
                SHOWING {sortedRecords.length} OF 3
              </span>
            )}
            <span className="text-[#A8AAA3]">3 RECORDS</span>
            <span className="text-[#242522]" aria-hidden="true">/</span>
            <span className="text-[#5C5E58]">2 LIMITED DETAIL</span>
          </div>
        </div>

        {/* Time Sort Compact Note Banner */}
        {(sortVal === 'CREATED TIME' || sortVal === 'UPDATED TIME') && (
          <div className="bg-[#D6FF3F]/5 px-4 py-1.5 flex items-center justify-between border-b border-[#242522]" aria-hidden="true">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F] animate-pulse" />
              <span className="text-[9px] font-mono font-bold text-[#D6FF3F] tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                TIME SORT / LIMITED MOCK DATA
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[8px] font-mono text-[#5C5E58]" style={{ fontFamily: 'var(--font-technical)' }}>
                STABLE CANONICAL ORDER PRESERVED
              </span>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-4">
          {sortedRecords.length === 0 ? (
            /* Filtered Empty State */
            <div className="border border-dashed border-[#242522] bg-[#141513]/10 py-16 px-4 text-center rounded-[2px]">
              <div className="w-full max-w-[480px] min-w-0 mx-auto text-center space-y-4">
                <h3 
                  className="text-xs font-mono font-bold tracking-widest text-[#A8AAA3] uppercase"
                  style={{ fontFamily: 'var(--font-technical)' }}
                >
                  NO MATCHING MOCK RECORDS
                </h3>
                <p className="text-xs text-[#5C5E58] leading-relaxed break-normal whitespace-normal">
                  No canonical frontend records match the current filters. Adjust or reset the Incident List controls.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-4 py-2 border border-[#242522] bg-[#141513]/30 hover:bg-[#D6FF3F]/10 hover:text-[#D6FF3F] hover:border-[#D6FF3F]/30 text-[#A8AAA3] text-xs font-mono font-bold tracking-wider rounded-[2px] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D6FF3F]"
                    style={{ fontFamily: 'var(--font-technical)' }}
                  >
                    RESET FILTERS
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Layout 3: Wide/Desktop View: Complete 8-column Semantic Table (activated when containerWidth >= 1280px) */}
              {containerWidth >= 1280 && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-[#242522] text-[10px] text-[#5C5E58] font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                        <th className="pb-3 pr-3 pl-1 w-[120px] shrink-0">SEVERITY</th>
                        <th className="pb-3 px-3 min-w-[300px] flex-1">INCIDENT</th>
                        <th className="pb-3 px-3 w-[110px] shrink-0">STATUS</th>
                        <th className="pb-3 px-3 w-[130px] shrink-0">SERVICE</th>
                        <th className="pb-3 px-3 w-[120px] shrink-0">COMMANDER</th>
                        <th className="pb-3 px-3 w-[110px] shrink-0">UPDATED</th>
                        <th className="pb-3 px-3 w-[110px] shrink-0">POSTMORTEM</th>
                        <th className="pb-3 pl-3 pr-1 text-right w-[180px] shrink-0">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#242522]/40">
                      {sortedRecords.map((record, index) => (
                        <tr key={record.code + '-' + index} className="border-b border-[#242522]/20 hover:bg-[#141513]/20 transition-colors">
                          {/* SEVERITY */}
                          <td className="py-4 pr-3 pl-1 align-top whitespace-nowrap w-[120px] shrink-0">
                            {record.isLimited ? (
                              record.severity === 'NOT SPECIFIED' ? (
                                <span className="text-[10px] text-[#5C5E58] bg-[#141513] border border-[#242522] px-1.5 py-0.5 rounded-[1px]">
                                  UNSPECIFIED
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-orange-400 bg-orange-400/5 border border-orange-400/20 px-1.5 py-0.5 rounded-[1px]">
                                  {record.severity}
                                </span>
                              )
                            ) : (
                              <div className="space-y-1">
                                <span className="inline-block text-[10px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-[1px]">
                                  {record.severity}
                                </span>
                                {record.severityAuthority && (
                                  <span className="block text-[7px] text-red-400 font-bold tracking-tight uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                                    {record.severityAuthority}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>

                          {/* INCIDENT */}
                          <td className="py-4 px-3 align-top min-w-[300px]">
                            <div className="space-y-2 min-w-0">
                              <div className="flex items-baseline gap-2 flex-nowrap min-w-0">
                                <span className="text-[10px] font-bold text-[#D6FF3F] bg-[#D6FF3F]/5 border border-[#D6FF3F]/10 px-1.5 py-0.5 rounded-[1px] tracking-wider select-all whitespace-nowrap shrink-0">
                                  {record.code}
                                </span>
                                <h4 className="text-xs font-sans font-bold text-[#F3F1EA] hover:text-[#D6FF3F] transition-colors leading-snug truncate">
                                  {record.title}
                                </h4>
                              </div>
                              <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed break-normal whitespace-normal max-w-[720px]">
                                {record.description}
                              </p>
                              
                              {/* Record detail extensions for canonical incident */}
                              {!record.isLimited && (
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-[#5C5E58] pt-1" style={{ fontFamily: 'var(--font-technical)' }}>
                                  {record.customerSignal && (
                                    <div className="flex items-center gap-1">
                                      <span className="text-[#5C5E58] uppercase">SIGNAL:</span>
                                      <span className="text-red-400/90 font-bold bg-red-400/5 px-1 rounded-[1px]">{record.customerSignal}</span>
                                    </div>
                                  )}
                                  {record.customerSignal && record.responseTasks && <span className="text-[#242522]">/</span>}
                                  {record.responseTasks && (
                                    <div className="flex items-center gap-1">
                                      <span className="text-[#5C5E58] uppercase">TASKS:</span>
                                      <span className="text-amber-500/90 font-bold bg-amber-500/5 px-1 rounded-[1px]">{record.responseTasks}</span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {record.isLimited && (
                                <div className="flex items-center gap-1 text-[8px] text-[#5C5E58]" style={{ fontFamily: 'var(--font-technical)' }}>
                                  <span className="inline-block w-1 h-1 bg-[#5C5E58] rounded-full" />
                                  <span className="uppercase tracking-wider">LIMITED SEED DETAIL</span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* STATUS */}
                          <td className="py-4 px-3 align-top whitespace-nowrap w-[110px] shrink-0">
                            <span className={`inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[1px] border uppercase ${
                              record.status === 'REPORTED' ? 'text-amber-500 bg-amber-500/5 border-amber-500/20' :
                              record.status === 'RESOLVED' ? 'text-green-500 bg-green-500/5 border-green-500/20' :
                              'text-[#A8AAA3] bg-[#141513]/40 border-[#242522]'
                            }`}>
                              {record.status}
                            </span>
                          </td>

                          {/* SERVICE */}
                          <td className="py-4 px-3 align-top whitespace-nowrap w-[130px] shrink-0">
                            <span className={`text-[10px] ${record.service === 'NOT SPECIFIED' ? 'text-[#5C5E58]' : 'text-[#A8AAA3] font-bold'}`}>
                              {record.service}
                            </span>
                          </td>

                          {/* COMMANDER */}
                          <td className="py-4 px-3 align-top whitespace-nowrap w-[120px] shrink-0">
                            <span className={`text-[10px] ${record.commander === 'NOT SPECIFIED' ? 'text-[#5C5E58]' : 'text-[#A8AAA3]'}`}>
                              {record.commander}
                            </span>
                          </td>

                          {/* UPDATED */}
                          <td className="py-4 px-3 align-top whitespace-nowrap text-[#5C5E58] text-[10px] w-[110px] shrink-0">
                            {record.updatedTime}
                          </td>

                          {/* POSTMORTEM */}
                          <td className="py-4 px-3 align-top whitespace-nowrap w-[110px] shrink-0">
                            <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-[1px] border ${
                              record.postmortem === 'APPROVED' ? 'text-green-400 bg-green-400/5 border-green-400/20' :
                              'text-[#5C5E58] bg-transparent border-transparent'
                            }`}>
                              {record.postmortem}
                            </span>
                          </td>

                          {/* ACTION */}
                          <td className="py-4 pl-3 pr-1 align-top text-right whitespace-nowrap w-[180px] shrink-0">
                            {!record.isLimited ? (
                              <Link
                                to="/app/incidents/SF-2026-0042"
                                className="inline-flex items-center justify-center text-[9px] font-bold tracking-wider uppercase border border-[#D6FF3F]/30 bg-[#D6FF3F]/10 hover:bg-[#D6FF3F]/20 text-[#D6FF3F] hover:border-[#D6FF3F]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6FF3F] px-2 py-1 rounded-[1px] transition-colors"
                                style={{ fontFamily: 'var(--font-technical)' }}
                              >
                                OPEN INCIDENT ROOM
                              </Link>
                            ) : (
                              <button
                                type="button"
                                disabled
                                className="text-[9px] font-bold tracking-wider uppercase border border-[#242522] bg-[#141513]/10 text-[#5C5E58] px-2 py-1 rounded-[1px] cursor-not-allowed opacity-60"
                                style={{ fontFamily: 'var(--font-technical)' }}
                              >
                                ROUTE NOT AVAILABLE
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Layout 2: Constrained Desktop / Tablet Record (700px <= containerWidth < 1280px) */}
              {containerWidth >= 700 && containerWidth < 1280 && (
                <div className="divide-y divide-[#242522]/40" role="list">
                  {sortedRecords.map((record, index) => (
                    <div 
                      key={record.code + '-tab-' + index} 
                      className="py-5 first:pt-0 last:pb-0 space-y-3.5"
                      role="listitem"
                    >
                      {/* LEVEL 1: Severity, Incident Identity, Status, Action */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4 min-w-0 flex-1">
                          {/* Severity */}
                          <div className="shrink-0 w-24">
                            {record.isLimited ? (
                              record.severity === 'NOT SPECIFIED' ? (
                                <span className="text-[10px] text-[#5C5E58] bg-[#141513] border border-[#242522] px-1.5 py-0.5 rounded-[1px]">
                                  UNSPECIFIED
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-orange-400 bg-orange-400/5 border border-orange-400/20 px-1.5 py-0.5 rounded-[1px]">
                                  {record.severity}
                                </span>
                              )
                            ) : (
                              <div className="space-y-1">
                                <span className="inline-block text-[10px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-[1px]">
                                  {record.severity}
                                </span>
                                {record.severityAuthority && (
                                  <span className="block text-[7px] text-red-400 font-bold tracking-tight uppercase" style={{ fontFamily: 'var(--font-technical)' }}>
                                    {record.severityAuthority}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Incident identity (Code + Title) */}
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex items-baseline gap-2">
                              <span className="text-[10px] font-mono font-bold text-[#D6FF3F] bg-[#D6FF3F]/5 border border-[#D6FF3F]/10 px-1.5 py-0.5 rounded-[1px] tracking-wider select-all whitespace-nowrap">
                                {record.code}
                              </span>
                              <h4 className="text-xs font-sans font-bold text-[#F3F1EA] hover:text-[#D6FF3F] transition-colors leading-snug">
                                {record.title}
                              </h4>
                            </div>
                          </div>
                        </div>

                        {/* Status & Action */}
                        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                          <span className={`inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[1px] border uppercase ${
                            record.status === 'REPORTED' ? 'text-amber-500 bg-amber-500/5 border-amber-500/20' :
                            record.status === 'RESOLVED' ? 'text-green-500 bg-green-500/5 border-green-500/20' :
                            'text-[#A8AAA3] bg-[#141513]/40 border-[#242522]'
                          }`}>
                            {record.status}
                          </span>
                          {!record.isLimited ? (
                            <Link
                              to="/app/incidents/SF-2026-0042"
                              className="inline-flex items-center justify-center text-[9px] font-bold tracking-wider uppercase border border-[#D6FF3F]/30 bg-[#D6FF3F]/10 hover:bg-[#D6FF3F]/20 text-[#D6FF3F] hover:border-[#D6FF3F]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6FF3F] px-2.5 py-1 rounded-[1px] transition-colors"
                              style={{ fontFamily: 'var(--font-technical)' }}
                            >
                              OPEN INCIDENT ROOM
                            </Link>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="text-[9px] font-bold tracking-wider uppercase border border-[#242522] bg-[#141513]/10 text-[#5C5E58] px-2.5 py-1 rounded-[1px] cursor-not-allowed opacity-60"
                              style={{ fontFamily: 'var(--font-technical)' }}
                            >
                              ROUTE NOT AVAILABLE
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Description & Available Supporting Metadata */}
                      <div className="pl-0 sm:pl-[112px] space-y-3">
                        <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed max-w-[720px] break-normal whitespace-normal">
                          {record.description}
                        </p>

                        {/* LEVEL 2: Service, Commander, Updated, Postmortem */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-mono text-[#5C5E58] border-t border-[#242522]/40 pt-2.5" style={{ fontFamily: 'var(--font-technical)' }}>
                          <div className="flex items-center gap-1.5">
                            <span className="uppercase text-[#5C5E58] font-bold">SERVICE:</span>
                            <span className={record.service === 'NOT SPECIFIED' ? 'text-[#5C5E58]' : 'text-[#A8AAA3] font-bold'}>
                              {record.service}
                            </span>
                          </div>
                          <span className="text-[#242522]" aria-hidden="true">/</span>
                          <div className="flex items-center gap-1.5">
                            <span className="uppercase text-[#5C5E58] font-bold">COMMANDER:</span>
                            <span className={record.commander === 'NOT SPECIFIED' ? 'text-[#5C5E58]' : 'text-[#A8AAA3]'}>
                              {record.commander}
                            </span>
                          </div>
                          <span className="text-[#242522]" aria-hidden="true">/</span>
                          <div className="flex items-center gap-1.5">
                            <span className="uppercase text-[#5C5E58] font-bold">UPDATED:</span>
                            <span className="text-[#5C5E58]">
                              {record.updatedTime}
                            </span>
                          </div>
                          <span className="text-[#242522]" aria-hidden="true">/</span>
                          <div className="flex items-center gap-1.5">
                            <span className="uppercase text-[#5C5E58] font-bold">POSTMORTEM:</span>
                            <span className={`inline-block font-bold px-1.5 py-0.5 rounded-[1px] border ${
                              record.postmortem === 'APPROVED' ? 'text-green-400 bg-green-400/5 border-green-400/20' : 'text-[#5C5E58] bg-transparent border-transparent'
                            }`}>
                              {record.postmortem}
                            </span>
                          </div>

                          {/* Extra metadata blocks if available (Record 1) */}
                          {!record.isLimited && (
                            <>
                              <span className="text-[#242522]" aria-hidden="true">/</span>
                              <div className="flex items-center gap-1.5">
                                <span className="uppercase text-[#5C5E58] font-bold">SIGNAL:</span>
                                <span className="text-red-400/90 font-bold bg-red-400/5 px-1 rounded-[1px]">{record.customerSignal}</span>
                              </div>
                              <span className="text-[#242522]" aria-hidden="true">/</span>
                              <div className="flex items-center gap-1.5">
                                <span className="uppercase text-[#5C5E58] font-bold">TASKS:</span>
                                <span className="text-amber-500/90 font-bold bg-amber-500/5 px-1 rounded-[1px]">{record.responseTasks}</span>
                              </div>
                            </>
                          )}

                          {record.isLimited && (
                            <>
                              <span className="text-[#242522]" aria-hidden="true">/</span>
                              <div className="flex items-center gap-1 text-[8px] text-[#5C5E58]">
                                <span className="inline-block w-1 h-1 bg-[#5C5E58] rounded-full" />
                                <span className="uppercase tracking-wider">LIMITED SEED DETAIL</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Layout 1: Mobile View: Stacked semantic list of records (activated when containerWidth < 700px) */}
              {containerWidth < 700 && (
                <div className="space-y-4" role="list">
                  {sortedRecords.map((record, index) => (
                    <div 
                      key={record.code + '-mob-' + index}
                      className="border border-[#242522] bg-[#0A0A0A] p-4 rounded-[2px] space-y-4 text-left"
                      role="listitem"
                    >
                      {/* Header: code and Action */}
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-xs font-mono font-bold text-[#D6FF3F] bg-[#D6FF3F]/5 border border-[#D6FF3F]/10 px-2 py-0.5 rounded-[1px] tracking-wider whitespace-nowrap">
                          {record.code}
                        </span>
                        {!record.isLimited ? (
                          <Link
                            to="/app/incidents/SF-2026-0042"
                            className="inline-flex items-center justify-center text-[9px] font-mono font-bold tracking-wider uppercase border border-[#D6FF3F]/30 bg-[#D6FF3F]/10 hover:bg-[#D6FF3F]/20 text-[#D6FF3F] hover:border-[#D6FF3F]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6FF3F] px-2.5 py-1 rounded-[1px] transition-colors"
                            style={{ fontFamily: 'var(--font-technical)' }}
                          >
                            OPEN INCIDENT ROOM
                          </Link>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="text-[9px] font-mono font-bold tracking-wider uppercase border border-[#242522] bg-[#141513]/10 text-[#5C5E58] px-2.5 py-1 rounded-[1px] cursor-not-allowed opacity-60"
                            style={{ fontFamily: 'var(--font-technical)' }}
                          >
                            ROUTE NOT AVAILABLE
                          </button>
                        )}
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1.5">
                        <h4 className="text-sm font-sans font-bold text-[#F3F1EA] uppercase">
                          {record.title}
                        </h4>
                        <p className="text-xs text-[#A8AAA3] font-sans leading-relaxed">
                          {record.description}
                        </p>
                      </div>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-3 border-t border-[#242522]/60 text-[10px] font-mono">
                        <div>
                          <span className="block text-[8px] text-[#5C5E58] font-bold uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-technical)' }}>
                            SEVERITY
                          </span>
                          {record.isLimited ? (
                            record.severity === 'NOT SPECIFIED' ? (
                              <span className="text-[#5C5E58]">UNSPECIFIED</span>
                            ) : (
                              <span className="text-orange-400 font-bold">{record.severity}</span>
                            )
                          ) : (
                            <div className="space-y-0.5">
                              <span className="text-red-500 font-bold">{record.severity}</span>
                              <span className="block text-[7px] text-red-400 font-bold" style={{ fontFamily: 'var(--font-technical)' }}>
                                {record.severityAuthority}
                              </span>
                            </div>
                          )}
                        </div>

                        <div>
                          <span className="block text-[8px] text-[#5C5E58] font-bold uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-technical)' }}>
                            STATUS
                          </span>
                          <span className={`inline-block font-bold uppercase ${
                            record.status === 'REPORTED' ? 'text-amber-500' :
                            record.status === 'RESOLVED' ? 'text-green-500' :
                            'text-[#A8AAA3]'
                          }`}>
                            {record.status}
                          </span>
                        </div>

                        <div>
                          <span className="block text-[8px] text-[#5C5E58] font-bold uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-technical)' }}>
                            SERVICE
                          </span>
                          <span className={record.service === 'NOT SPECIFIED' ? 'text-[#5C5E58]' : 'text-[#A8AAA3] font-bold'}>
                            {record.service}
                          </span>
                        </div>

                        <div>
                          <span className="block text-[8px] text-[#5C5E58] font-bold uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-technical)' }}>
                            COMMANDER
                          </span>
                          <span className={record.commander === 'NOT SPECIFIED' ? 'text-[#5C5E58]' : 'text-[#A8AAA3]'}>
                            {record.commander}
                          </span>
                        </div>

                        <div>
                          <span className="block text-[8px] text-[#5C5E58] font-bold uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-technical)' }}>
                            UPDATED
                          </span>
                          <span className="text-[#5C5E58]">
                            {record.updatedTime}
                          </span>
                        </div>

                        <div>
                          <span className="block text-[8px] text-[#5C5E58] font-bold uppercase tracking-wider mb-1" style={{ fontFamily: 'var(--font-technical)' }}>
                            POSTMORTEM
                          </span>
                          {record.postmortem === 'APPROVED' ? (
                            <span className="text-green-400 font-bold">{record.postmortem}</span>
                          ) : (
                            <span className="text-[#5C5E58]">{record.postmortem}</span>
                          )}
                        </div>
                      </div>

                      {/* Extra metadata blocks if available (Record 1) */}
                      {!record.isLimited && (
                        <div className="bg-[#141513]/30 p-2.5 border border-[#242522] rounded-[1px] space-y-2 text-[10px] font-mono">
                          {record.customerSignal && (
                            <div className="flex justify-between items-center">
                              <span className="text-[#5C5E58] uppercase font-bold" style={{ fontFamily: 'var(--font-technical)' }}>CUSTOMER SIGNAL:</span>
                              <span className="text-red-400 font-bold">{record.customerSignal}</span>
                            </div>
                          )}
                          {record.responseTasks && (
                            <div className="flex justify-between items-center">
                              <span className="text-[#5C5E58] uppercase font-bold" style={{ fontFamily: 'var(--font-technical)' }}>RESPONSE TASKS:</span>
                              <span className="text-amber-500 font-bold">{record.responseTasks}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Mobile bottom-navigation clearance */}
                  <div className="h-16" aria-hidden="true" />
                </div>
              )}
            </>
          )}
        </div>
      </section>

    </section>
  );
}
