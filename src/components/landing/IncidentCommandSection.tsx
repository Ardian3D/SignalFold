import React from 'react';

export interface IncidentCommandSectionProps {
  className?: string;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  actor: string;
  description: string;
  isLatest?: boolean;
  isAi?: boolean;
  badge?: string;
}

interface ResponseTask {
  id: string;
  seq: string;
  title: string;
  status: 'IN PROGRESS' | 'OPEN' | 'READY' | 'DONE';
  assignee: string;
  source: 'AI SUGGESTION' | 'HUMAN';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

interface Responder {
  id: string;
  seq: string;
  name: string;
  role: string;
  assignment: string;
  presence: 'ACTIVE' | 'WORKING' | 'AVAILABLE';
}

interface IncidentMetadataItem {
  label: string;
  value: string;
  highlight?: 'lime' | 'red';
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'evt-5',
    timestamp: '06:18:42',
    actor: 'ALEX RIVERA',
    description: 'Claimed task: Compare latest deployment changes.',
    isLatest: true,
  },
  {
    id: 'evt-4',
    timestamp: '06:17:06',
    actor: 'MAYA CHEN',
    description: 'Assigned as Incident Commander.',
  },
  {
    id: 'evt-3',
    timestamp: '06:16:21',
    actor: 'MAYA CHEN',
    description: 'Accepted severity recommendation: SEV1 / CRITICAL.',
  },
  {
    id: 'evt-2',
    timestamp: '06:15:02',
    actor: 'DEEPSEEK',
    description: 'AI analysis completed — SEV1 suggested with 94% confidence.',
    isAi: true,
    badge: 'AI SUGGESTION',
  },
  {
    id: 'evt-1',
    timestamp: '06:14:08',
    actor: 'SYSTEM',
    description: 'Incident created from incoming customer reports.',
  },
];

const RESPONSE_TASKS: ResponseTask[] = [
  {
    id: 'task-1',
    seq: '01',
    title: 'Compare latest deployment changes',
    status: 'IN PROGRESS',
    assignee: 'ALEX RIVERA',
    source: 'AI SUGGESTION',
    priority: 'CRITICAL',
  },
  {
    id: 'task-2',
    seq: '02',
    title: 'Confirm payment gateway health',
    status: 'OPEN',
    assignee: 'UNCLAIMED',
    source: 'AI SUGGESTION',
    priority: 'HIGH',
  },
  {
    id: 'task-3',
    seq: '03',
    title: 'Run checkout transaction test',
    status: 'OPEN',
    assignee: 'UNCLAIMED',
    source: 'HUMAN',
    priority: 'HIGH',
  },
  {
    id: 'task-4',
    seq: '04',
    title: 'Prepare rollback',
    status: 'READY',
    assignee: 'MAYA CHEN',
    source: 'AI SUGGESTION',
    priority: 'CRITICAL',
  },
  {
    id: 'task-5',
    seq: '05',
    title: 'Draft customer-facing status update',
    status: 'DONE',
    assignee: 'JORDAN LEE',
    source: 'HUMAN',
    priority: 'MEDIUM',
  },
];

const RESPONDERS: Responder[] = [
  {
    id: 'resp-1',
    seq: '01',
    name: 'MAYA CHEN',
    role: 'INCIDENT MANAGER',
    assignment: 'COMMANDER',
    presence: 'ACTIVE',
  },
  {
    id: 'resp-2',
    seq: '02',
    name: 'ALEX RIVERA',
    role: 'RESPONDER',
    assignment: 'DEPLOYMENT REVIEW',
    presence: 'WORKING',
  },
  {
    id: 'resp-3',
    seq: '03',
    name: 'JORDAN LEE',
    role: 'RESPONDER',
    assignment: 'STATUS UPDATE',
    presence: 'AVAILABLE',
  },
];

const INCIDENT_METADATA: IncidentMetadataItem[] = [
  { label: 'CATEGORY', value: 'PAYMENTS' },
  { label: 'AFFECTED SERVICE', value: 'PAYMENTS API' },
  { label: 'IMPACT', value: '37 CUSTOMER REPORTS' },
  { label: 'SOURCE', value: 'INCOMING SUPPORT REPORTS' },
  { label: 'AI CONFIDENCE', value: '94%', highlight: 'lime' },
  { label: 'RISK FLAG', value: 'PAYMENT FAILURE', highlight: 'red' },
  { label: 'DETECTED', value: '06:14:08' },
  { label: 'VISIBILITY', value: 'INTERNAL' },
];

export const IncidentCommandSection: React.FC<IncidentCommandSectionProps> = ({
  className = '',
}) => {
  return (
    <section
      id="command"
      className={`relative w-full bg-[#0A0A0A] text-[#F3F1EA] py-16 sm:py-20 lg:py-24 border-b border-[#242522] scroll-mt-20 selection:bg-[#D6FF3F] selection:text-[#0A0A0A] ${className}`}
      aria-label="Incident Command Interface"
    >
      {/* Scroll anchor for navbar/footer compatibility */}
      <div id="incident-room" className="absolute top-0 left-0 scroll-mt-20" aria-hidden="true" />

      {/* Subtle Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#F3F1EA_1px,transparent_1px)] [background-size:16px_16px]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Part 1: Editorial Introduction */}
        <div className="max-w-4xl space-y-4 sm:space-y-5">
          {/* Eyebrow Label */}
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-[#141513] border border-[#242522]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F]" aria-hidden="true" />
              <span
                style={{ fontFamily: 'var(--font-technical)' }}
                className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest uppercase text-[#D6FF3F]"
              >
                03 / INCIDENT COMMAND
              </span>
            </div>
          </div>

          {/* Headline */}
          <h2
            style={{ fontFamily: 'var(--font-display)' }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F3F1EA] leading-[1.06] text-balance"
          >
            ONE INCIDENT.<br className="hidden sm:inline" />
            ONE SHARED COMMAND.
          </h2>

          {/* Supporting Copy */}
          <p
            style={{ fontFamily: 'var(--font-ui)' }}
            className="text-base sm:text-lg text-[#A8AAA3] leading-relaxed max-w-[42rem] w-full"
          >
            SignalFold keeps severity, ownership, response tasks, timeline activity, and recovery status inside one operational view. AI proposes the next move. Humans remain in control.
          </p>

          {/* Technical Metadata Rail */}
          <div
            style={{ fontFamily: 'var(--font-technical)' }}
            className="pt-5 mt-2 border-t border-[#242522] grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest text-[#A8AAA3]"
          >
            <div className="flex items-center gap-2 border-b sm:border-b-0 sm:border-r border-[#242522] pb-2.5 sm:pb-0 pr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F] shrink-0" aria-hidden="true" />
              <span className="text-[#F3F1EA]">REALTIME COORDINATION</span>
            </div>
            <div className="flex items-center gap-2 border-b sm:border-b-0 sm:border-r border-[#242522] pb-2.5 sm:pb-0 px-0 sm:px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F] shrink-0" aria-hidden="true" />
              <span className="text-[#F3F1EA]">HUMAN AUTHORITY</span>
            </div>
            <div className="flex items-center gap-2 pl-0 sm:pl-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F] shrink-0" aria-hidden="true" />
              <span className="text-[#F3F1EA]">TRACEABLE ACTIONS</span>
            </div>
          </div>
        </div>

        {/* Part 2: Application Preview Frame */}
        <div
          style={{ fontFamily: 'var(--font-ui)' }}
          className="w-full border border-[#242522] rounded-[2px] bg-[#141513] overflow-hidden shadow-2xl"
        >
          {/* Top Frame Bar */}
          <div
            style={{ fontFamily: 'var(--font-technical)' }}
            className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#242522] bg-[#0A0A0A] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#A8AAA3]"
          >
            <div className="flex items-center gap-3">
              <span className="text-[#F3F1EA] font-semibold">SIGNALFOLD / INCIDENT ROOM</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D6FF3F] animate-pulse motion-reduce:animate-none" aria-hidden="true" />
              <span className="text-[#D6FF3F]">LIVE OPERATION</span>
            </div>
          </div>

          {/* Interior Canvas */}
          <div className="w-full min-h-[380px] sm:min-h-[500px] lg:min-h-[620px] bg-[#0E0F0D] relative flex flex-col justify-start">
            {/* Subtle Industrial Grid Background */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[linear-gradient(to_right,#F3F1EA_1px,transparent_1px),linear-gradient(to_bottom,#F3F1EA_1px,transparent_1px)] bg-[size:32px_32px]"
              aria-hidden="true"
            />

            {/* Incident Identity Header */}
            <div className="w-full border-b border-[#242522] bg-[#141513] p-4 sm:p-6 lg:p-7 relative z-10 block min-h-[140px]">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* Left Primary Area */}
                <div className="space-y-3 max-w-3xl">
                  {/* Small Organization & Service Metadata + Incident Code */}
                  <div
                    style={{ fontFamily: 'var(--font-technical)' }}
                    className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-bold tracking-wider text-[#A8AAA3] uppercase"
                  >
                    <span className="text-[#F3F1EA] bg-[#0A0A0A] px-2 py-0.5 border border-[#242522] rounded-[2px] tabular-nums">
                      SF-2026-0042
                    </span>
                    <span className="text-[#686A63]" aria-hidden="true">//</span>
                    <span className="text-[#A8AAA3]">NORTHSTAR COMMERCE</span>
                    <span className="text-[#686A63]" aria-hidden="true">//</span>
                    <span className="text-[#D6FF3F]">PAYMENTS API</span>
                  </div>

                  {/* Large Readable Incident Title */}
                  <h3
                    style={{ fontFamily: 'var(--font-ui)' }}
                    className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#F3F1EA] tracking-tight leading-snug"
                  >
                    Checkout payments failing after latest deployment
                  </h3>
                </div>

                {/* Right Operational Area */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between lg:justify-start gap-4 shrink-0 border-t lg:border-t-0 lg:border-l border-[#242522] pt-4 lg:pt-0 lg:pl-6">
                  {/* Badges & Status */}
                  <div
                    style={{ fontFamily: 'var(--font-technical)' }}
                    className="flex flex-wrap items-center gap-2 sm:gap-3"
                  >
                    {/* Severity Badge */}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[#2C1010] border border-[#5C1D1D] text-[#FF5555] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5555]" aria-hidden="true" />
                      SEV1 / CRITICAL
                    </span>

                    {/* Status Badge */}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[#1C1F16] border border-[#353D22] text-[#D6FF3F] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F] animate-pulse" aria-hidden="true" />
                      INVESTIGATING
                    </span>
                  </div>

                  {/* Commander & Elapsed Time */}
                  <div
                    style={{ fontFamily: 'var(--font-technical)' }}
                    className="grid grid-cols-2 gap-4 sm:gap-6 text-[10px] sm:text-[11px] text-[#A8AAA3] w-full sm:w-auto"
                  >
                    <div className="flex flex-col lg:items-end">
                      <span className="text-[#686A63] text-[9px] uppercase tracking-widest">COMMANDER</span>
                      <span className="text-[#F3F1EA] font-semibold tracking-wider">MAYA CHEN</span>
                    </div>
                    <div className="flex flex-col lg:items-end">
                      <span className="text-[#686A63] text-[9px] uppercase tracking-widest">ELAPSED TIME</span>
                      <span className="text-[#F3F1EA] font-semibold tabular-nums tracking-wider">00:18:42</span>
                    </div>
                  </div>

                  {/* Compact Static Action Buttons */}
                  <div
                    style={{ fontFamily: 'var(--font-technical)' }}
                    className="flex items-center gap-2 pt-1 w-full sm:w-auto"
                  >
                    <button
                      type="button"
                      tabIndex={-1}
                      className="flex-1 sm:flex-initial px-3 py-1.5 rounded-[2px] bg-[#0A0A0A] border border-[#242522] text-[#F3F1EA] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase hover:border-[#D6FF3F]/40 transition-colors pointer-events-none"
                    >
                      ADD UPDATE
                    </button>
                    <button
                      type="button"
                      tabIndex={-1}
                      className="flex-1 sm:flex-initial px-3 py-1.5 rounded-[2px] bg-[#D6FF3F] text-[#0A0A0A] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase pointer-events-none"
                    >
                      CHANGE STATUS
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Lower Application Area: Main Activity Timeline (~68%) + Empty Right Rail (~32%) */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 flex-1 border-t border-[#242522]">
              {/* Main Activity Timeline Area (~68% width -> lg:col-span-8) */}
              <div className="lg:col-span-8 border-b lg:border-b-0 lg:border-r border-[#242522] flex flex-col justify-start">
                {/* Timeline Header Row */}
                <div
                  style={{ fontFamily: 'var(--font-technical)' }}
                  className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-[#242522] bg-[#0A0A0A]/80 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#A8AAA3]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[#F3F1EA]">01 / ACTIVITY TIMELINE</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-[#686A63] text-[9px] sm:text-[10px] tracking-wider">LATEST FIRST</span>
                    <span className="flex items-center gap-1.5 text-[#D6FF3F] text-[9px] sm:text-[10px] font-bold tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F] animate-pulse motion-reduce:animate-none" aria-hidden="true" />
                      LIVE
                    </span>
                  </div>
                </div>

                {/* Activity Timeline Events */}
                <div className="p-4 sm:p-6 relative flex-1">
                  {/* Continuous Vertical Event Rail Line */}
                  <div
                    className="absolute left-[21px] sm:left-[29px] top-7 bottom-7 w-px bg-[#242522]"
                    aria-hidden="true"
                  />

                  <div className="space-y-0 relative">
                    {TIMELINE_EVENTS.map((event, idx) => (
                      <div
                        key={event.id}
                        className={`relative flex items-start gap-3 sm:gap-4 py-3 sm:py-3.5 ${
                          idx !== TIMELINE_EVENTS.length - 1 ? 'border-b border-[#242522]/40' : ''
                        }`}
                      >
                        {/* Operational Node */}
                        <div className="relative z-10 flex items-center justify-center shrink-0 mt-0.5">
                          <span
                            className={`w-2.5 h-2.5 rounded-full border ${
                              event.isLatest
                                ? 'bg-[#D6FF3F] border-[#D6FF3F]'
                                : event.isAi
                                ? 'bg-[#141513] border-[#D6FF3F]'
                                : 'bg-[#141513] border-[#3A3C36]'
                            }`}
                            aria-hidden="true"
                          />
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 min-w-0 space-y-1">
                          {/* Metadata Row: Timestamp, Actor, Optional AI Suggestion Label */}
                          <div
                            style={{ fontFamily: 'var(--font-technical)' }}
                            className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase"
                          >
                            <span className="text-[#F3F1EA] tabular-nums">{event.timestamp}</span>
                            <span className="text-[#686A63]" aria-hidden="true">//</span>
                            <span className={event.isAi ? 'text-[#D6FF3F]' : 'text-[#A8AAA3]'}>
                              {event.actor}
                            </span>

                            {event.badge && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-[2px] bg-[#1C2210] border border-[#3A451D] text-[#D6FF3F] text-[9px] font-bold tracking-widest ml-auto sm:ml-0">
                                {event.badge}
                              </span>
                            )}
                          </div>

                          {/* Event Description */}
                          <p
                            style={{ fontFamily: 'var(--font-ui)' }}
                            className="text-xs sm:text-sm text-[#F3F1EA] leading-snug"
                          >
                            {event.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Rail (~32% width -> lg:col-span-4) */}
              <div className="lg:col-span-4 flex flex-col justify-start bg-[#141513]/30 border-t lg:border-t-0 border-[#242522]">
                {/* Response Tasks Panel */}
                <div className="flex flex-col border-b border-[#242522]">
                  {/* Panel Header */}
                  <div
                    style={{ fontFamily: 'var(--font-technical)' }}
                    className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b border-[#242522] bg-[#0A0A0A]/80 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#A8AAA3]"
                  >
                    <span className="text-[#F3F1EA]">02 / RESPONSE TASKS</span>
                    <div className="flex items-center gap-2.5 sm:gap-3 text-[9px] sm:text-[10px]">
                      <span className="text-[#A8AAA3]">3 OPEN</span>
                      <span className="text-[#D6FF3F] font-bold">1 ACTIVE</span>
                    </div>
                  </div>

                  {/* Task Rows */}
                  <div className="divide-y divide-[#242522]/40">
                    {RESPONSE_TASKS.map((task) => (
                      <div
                        key={task.id}
                        className={`p-2.5 sm:p-3 space-y-1 transition-colors ${
                          task.status === 'IN PROGRESS'
                            ? 'bg-[#1C2210]/30 border-l-2 border-l-[#D6FF3F]'
                            : task.status === 'DONE'
                            ? 'bg-[#0A0A0A]/30 opacity-70'
                            : 'hover:bg-[#181916]/40'
                        }`}
                      >
                        {/* Top Row: Seq + Title + Status */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-baseline gap-2 min-w-0">
                            <span
                              style={{ fontFamily: 'var(--font-technical)' }}
                              className="text-[10px] font-bold text-[#686A63] tabular-nums shrink-0"
                            >
                              {task.seq}
                            </span>
                            <h4
                              style={{ fontFamily: 'var(--font-ui)' }}
                              className={`text-xs sm:text-sm font-medium leading-tight ${
                                task.status === 'DONE'
                                  ? 'text-[#A8AAA3] line-through decoration-[#686A63]'
                                  : 'text-[#F3F1EA]'
                              }`}
                            >
                              {task.title}
                            </h4>
                          </div>

                          <span
                            style={{ fontFamily: 'var(--font-technical)' }}
                            className={`shrink-0 px-1.5 py-0.5 rounded-[2px] text-[9px] font-bold tracking-wider uppercase border ${
                              task.status === 'IN PROGRESS'
                                ? 'bg-[#1C2210] border-[#3A451D] text-[#D6FF3F]'
                                : task.status === 'READY'
                                ? 'bg-[#1C1F16] border-[#353D22] text-[#F3F1EA]'
                                : task.status === 'DONE'
                                ? 'bg-[#0A0A0A] border-[#242522] text-[#686A63]'
                                : 'bg-[#0A0A0A] border-[#242522] text-[#A8AAA3]'
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>

                        {/* Bottom Row: Priority, Source, Assignee */}
                        <div
                          style={{ fontFamily: 'var(--font-technical)' }}
                          className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-[#A8AAA3]"
                        >
                          <span
                            className={`px-1.5 py-0.5 rounded-[2px] border ${
                              task.priority === 'CRITICAL'
                                ? 'bg-[#2C1010] border-[#5C1D1D] text-[#FF5555]'
                                : task.priority === 'HIGH'
                                ? 'bg-[#221C10] border-[#4A3B18] text-[#E2B93B]'
                                : 'bg-[#0A0A0A] border-[#242522] text-[#A8AAA3]'
                            }`}
                          >
                            {task.priority}
                          </span>

                          <span className="text-[#686A63]" aria-hidden="true">//</span>

                          <span
                            className={`px-1.5 py-0.5 rounded-[2px] border ${
                              task.source === 'AI SUGGESTION'
                                ? 'bg-[#1C2210] border-[#3A451D] text-[#D6FF3F]'
                                : 'bg-[#0A0A0A] border-[#242522] text-[#A8AAA3]'
                            }`}
                          >
                            {task.source}
                          </span>

                          <span className="text-[#686A63]" aria-hidden="true">//</span>

                          <span className={task.assignee === 'UNCLAIMED' ? 'text-[#686A63]' : 'text-[#F3F1EA]'}>
                            {task.assignee}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Responders Panel */}
                <div className="flex flex-col border-b border-[#242522]">
                  {/* Panel Header */}
                  <div
                    style={{ fontFamily: 'var(--font-technical)' }}
                    className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b border-[#242522] bg-[#0A0A0A]/80 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#A8AAA3]"
                  >
                    <span className="text-[#F3F1EA]">03 / RESPONDERS</span>
                    <span className="text-[#D6FF3F] text-[9px] sm:text-[10px] font-bold tracking-wider">
                      3 ONLINE
                    </span>
                  </div>

                  {/* Responder Rows */}
                  <div className="divide-y divide-[#242522]/40">
                    {RESPONDERS.map((responder) => (
                      <div
                        key={responder.id}
                        className="p-2.5 sm:p-3 space-y-1 hover:bg-[#181916]/40 transition-colors"
                      >
                        {/* Top Line: Seq + Name + Role */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              style={{ fontFamily: 'var(--font-technical)' }}
                              className="text-[10px] font-bold text-[#686A63] tabular-nums shrink-0"
                            >
                              {responder.seq}
                            </span>
                            <h4
                              style={{ fontFamily: 'var(--font-ui)' }}
                              className="text-xs sm:text-sm font-semibold text-[#F3F1EA] truncate"
                            >
                              {responder.name}
                            </h4>
                          </div>

                          <span
                            style={{ fontFamily: 'var(--font-technical)' }}
                            className="shrink-0 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-[#A8AAA3] px-1.5 py-0.5 rounded-[2px] bg-[#0A0A0A] border border-[#242522]"
                          >
                            {responder.role}
                          </span>
                        </div>

                        {/* Bottom Line: Assignment + Presence Status */}
                        <div
                          style={{ fontFamily: 'var(--font-technical)' }}
                          className="flex items-center justify-between gap-2 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-[#A8AAA3]"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-[#686A63]">ASSIGNMENT:</span>
                            <span className="text-[#F3F1EA] truncate">{responder.assignment}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 text-[#D6FF3F]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F]" aria-hidden="true" />
                            <span>{responder.presence}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Incident Metadata Panel */}
                <div className="flex flex-col border-b lg:border-b-0 border-[#242522]">
                  {/* Panel Header */}
                  <div
                    style={{ fontFamily: 'var(--font-technical)' }}
                    className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b border-[#242522] bg-[#0A0A0A]/80 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#A8AAA3]"
                  >
                    <span className="text-[#F3F1EA]">04 / INCIDENT METADATA</span>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 divide-x divide-y divide-[#242522]/40 bg-[#0A0A0A]/20">
                    {INCIDENT_METADATA.map((item) => (
                      <div
                        key={item.label}
                        style={{ fontFamily: 'var(--font-technical)' }}
                        className="p-2 sm:p-2.5 flex flex-col justify-center space-y-0.5"
                      >
                        <span className="text-[9px] font-bold tracking-wider uppercase text-[#686A63] truncate">
                          {item.label}
                        </span>
                        <span
                          className={`text-[10px] sm:text-[11px] font-bold tracking-wider uppercase truncate ${
                            item.highlight === 'lime'
                              ? 'text-[#D6FF3F]'
                              : item.highlight === 'red'
                              ? 'text-[#FF5555]'
                              : 'text-[#F3F1EA]'
                          }`}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
