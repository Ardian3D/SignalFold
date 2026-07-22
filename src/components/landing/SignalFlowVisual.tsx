import React from 'react';

export interface SignalFlowVisualProps {
  className?: string;
}

export const SignalFlowVisual: React.FC<SignalFlowVisualProps> = ({ className = '' }) => {
  return (
    <div
      className={`relative w-full aspect-[4/3] max-w-[560px] mx-auto bg-[#141513] border border-[#242522] rounded-[4px] p-4 sm:p-6 flex flex-col justify-between overflow-hidden select-none font-mono ${className}`}
      aria-label="Abstract Incident Signal Flow Topology"
    >
      {/* Background subtle technical grid pattern */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#242522_1px,transparent_1px),linear-gradient(to_bottom,#242522_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Header Bar inside Visual */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#242522] pb-3 text-[10px] tracking-widest text-[#A8AAA3] uppercase">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D6FF3F] animate-pulse motion-reduce:animate-none" />
          <span>SIGNAL_ROUTING // LIVE_PIPELINE</span>
        </div>
        <span className="text-[#5C5E58] hidden sm:inline">LATENCY: &lt;12MS</span>
      </div>

      {/* SVG Topology Diagram */}
      <div className="relative z-10 my-auto py-4">
        <svg
          viewBox="0 0 500 240"
          className="w-full h-auto overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="signalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A8AAA3" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#D6FF3F" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#28A66A" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Lines connecting scattered left nodes to central hub */}
          {/* Path 1: REPORT (Top Left) -> Center Hub */}
          <path
            d="M 100 40 L 180 40 L 250 120"
            stroke="#242522"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M 100 40 L 180 40 L 250 120"
            stroke="url(#signalGrad)"
            strokeWidth="1.5"
            className="opacity-70"
          />

          {/* Path 2: TRIAGE (Mid Left) -> Center Hub */}
          <path
            d="M 100 120 L 250 120"
            stroke="#242522"
            strokeWidth="2"
          />
          <path
            d="M 100 120 L 250 120"
            stroke="#D6FF3F"
            strokeWidth="2"
            strokeDasharray="8 12"
            className="animate-[dash_8s_linear_infinite] motion-reduce:animate-none opacity-80"
          />

          {/* Path 3: ASSIGN (Bottom Left) -> Center Hub */}
          <path
            d="M 100 200 L 180 200 L 250 120"
            stroke="#242522"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M 100 200 L 180 200 L 250 120"
            stroke="url(#signalGrad)"
            strokeWidth="1.5"
            className="opacity-70"
          />

          {/* Central Hub -> Output Path */}
          <path
            d="M 250 120 L 340 120 L 400 70"
            stroke="#28A66A"
            strokeWidth="2"
            strokeOpacity="0.8"
          />
          <path
            d="M 250 120 L 340 120 L 400 170"
            stroke="#D6FF3F"
            strokeWidth="2"
          />

          {/* Animated Active Moving Node Point along primary pipeline */}
          <circle r="4" fill="#D6FF3F" className="motion-reduce:hidden">
            <animateMotion
              path="M 100 120 L 250 120 L 340 120 L 400 170"
              dur="3.5s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Pulse Ripple at Central Hub */}
          <circle cx="250" cy="120" r="12" stroke="#D6FF3F" strokeWidth="1" opacity="0.3" className="animate-ping motion-reduce:animate-none" />
          <circle cx="250" cy="120" r="6" fill="#0A0A0A" stroke="#D6FF3F" strokeWidth="2" />

          {/* Left Scattered Nodes */}
          {/* Node 1: REPORT */}
          <g transform="translate(20, 28)">
            <rect width="80" height="24" rx="2" fill="#0A0A0A" stroke="#242522" strokeWidth="1" />
            <circle cx="12" cy="12" r="3" fill="#FF4D3D" />
            <text x="22" y="15" fill="#F3F1EA" fontSize="9" fontFamily="monospace" fontWeight="bold">
              REPORT
            </text>
          </g>

          {/* Node 2: TRIAGE */}
          <g transform="translate(20, 108)">
            <rect width="80" height="24" rx="2" fill="#0A0A0A" stroke="#D6FF3F" strokeWidth="1" />
            <circle cx="12" cy="12" r="3" fill="#D6FF3F" />
            <text x="22" y="15" fill="#F3F1EA" fontSize="9" fontFamily="monospace" fontWeight="bold">
              TRIAGE
            </text>
          </g>

          {/* Node 3: ASSIGN */}
          <g transform="translate(20, 188)">
            <rect width="80" height="24" rx="2" fill="#0A0A0A" stroke="#242522" strokeWidth="1" />
            <circle cx="12" cy="12" r="3" fill="#F2B84B" />
            <text x="22" y="15" fill="#F3F1EA" fontSize="9" fontFamily="monospace" fontWeight="bold">
              ASSIGN
            </text>
          </g>

          {/* Right Coordinated Nodes */}
          {/* Node 4: RESPOND */}
          <g transform="translate(400, 58)">
            <rect width="80" height="24" rx="2" fill="#0A0A0A" stroke="#28A66A" strokeWidth="1" />
            <circle cx="12" cy="12" r="3" fill="#28A66A" />
            <text x="22" y="15" fill="#F3F1EA" fontSize="9" fontFamily="monospace" fontWeight="bold">
              RESPOND
            </text>
          </g>

          {/* Node 5: RESOLVE */}
          <g transform="translate(400, 158)">
            <rect width="80" height="24" rx="2" fill="#D6FF3F" stroke="#D6FF3F" strokeWidth="1" />
            <circle cx="12" cy="12" r="3" fill="#0A0A0A" />
            <text x="22" y="15" fill="#0A0A0A" fontSize="9" fontFamily="monospace" fontWeight="bold">
              RESOLVE
            </text>
          </g>
        </svg>
      </div>

      {/* Bottom Technical Coordinates Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between border-t border-[#242522] pt-3 text-[10px] text-[#5C5E58]">
        <span>NODE_ID: SF-CENTRAL-01</span>
        <span className="text-[#D6FF3F]">FLOW: COORDINATED</span>
        <span>SYS_STATUS: ACTIVE</span>
      </div>
    </div>
  );
};
