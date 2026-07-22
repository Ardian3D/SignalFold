import React, { useState, useEffect } from 'react';
import { BrandLogo, BrandMark } from '@/components/brand';
import {
  Button,
  IconButton,
  Field,
  Input,
  Textarea,
  Select,
  Checkbox,
  Switch,
  SearchInput,
  SeverityBadge,
  IncidentStatusBadge,
  StatusDot,
  Badge,
  Surface,
  SectionHeader,
  Divider,
  Metric,
  Avatar,
  Tag,
  Dialog,
  Tooltip,
} from '@/components/ui';
import {
  InlineAlert,
  EmptyState,
  Skeleton,
  Spinner,
  ProgressBar,
} from '@/components/feedback';
import {
  ShieldAlert,
  Sun,
  Moon,
  Sparkles,
  Info,
  Check,
  Search,
  Activity,
  Layers,
  Terminal,
} from 'lucide-react';

export const DesignSystemPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Design System — SignalFold';
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Form states
  const [inputValue, setInputValue] = useState('SF-2026-0042');
  const [selectValue, setSelectValue] = useState('sev1');
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [searchValue, setSearchValue] = useState('checkout-service');
  const [tags, setTags] = useState(['k8s-cluster-01', 'us-east-1', 'payment-gateway']);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const colors = [
    { name: 'Ink', hex: '#0A0A0A', desc: 'Primary dark background & body text', text: 'text-white' },
    { name: 'Paper', hex: '#F3F1EA', desc: 'Off-white canvas background', text: 'text-black' },
    { name: 'Surface', hex: '#FFFFFF', desc: 'Card & modal container background', text: 'text-black' },
    { name: 'Graphite', hex: '#242522', desc: 'Dark borders & secondary buttons', text: 'text-white' },
    { name: 'Muted', hex: '#A8AAA3', desc: 'Disabled states & meta labels', text: 'text-black' },
    { name: 'Signal Lime', hex: '#D6FF3F', desc: 'Primary AI & CTA accent', text: 'text-black' },
    { name: 'Critical (SEV1)', hex: '#FF4D3D', desc: 'SEV1 Critical outage & destruction', text: 'text-white' },
    { name: 'Warning (SEV2)', hex: '#F2B84B', desc: 'SEV2 Major degradation & warnings', text: 'text-black' },
    { name: 'Success (SEV4)', hex: '#28A66A', desc: 'SEV4 Low & Resolved status', text: 'text-white' },
    { name: 'Info (SEV3)', hex: '#4B78FF', desc: 'SEV3 Moderate & Link focus ring', text: 'text-white' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-root)] text-[var(--color-text-primary)] transition-colors duration-200 p-6 md:p-12 max-w-7xl mx-auto space-y-12">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-[#D8D4C8] dark:border-[#2A2C28] gap-4">
        <div className="space-y-2">
          <BrandLogo size="lg" />
          <p className="text-xs font-mono font-medium text-[#5C5E58] dark:text-[#A8AAA3]">
            CANONICAL DESIGN SYSTEM & COMPONENT SPECIFICATION — VERIFIED PHASE 1
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleTheme}
            leadingIcon={isDarkMode ? <Sun className="w-4 h-4 text-[#D6FF3F]" /> : <Moon className="w-4 h-4" />}
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
          <Badge variant="signal" size="md">
            Phase 1 Verified
          </Badge>
        </div>
      </header>

      {/* 1. Brand Principles & Official Assets */}
      <section className="space-y-4">
        <SectionHeader
          eyebrow="1. Brand Principles & Official Assets"
          title="Official Logo & Lockup Architecture"
          description="SignalFold uses strictly official brand assets (src/assets/brand/SignalFold-logo.png and public/favicon.ico)."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Surface variant="default" padding="md" className="space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase text-[#5C5E58]">
              OFFICIAL BRANDLOGO (PNG LOCKUP)
            </span>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <BrandLogo size="sm" />
                <span className="text-xs font-mono text-[#5C5E58]">size="sm" (24px)</span>
              </div>
              <div className="flex items-center gap-2">
                <BrandLogo size="md" />
                <span className="text-xs font-mono text-[#5C5E58]">size="md" (32px)</span>
              </div>
              <div className="flex items-center gap-2">
                <BrandLogo size="lg" />
                <span className="text-xs font-mono text-[#5C5E58]">size="lg" (48px)</span>
              </div>
            </div>
          </Surface>

          <Surface variant="default" padding="md" className="space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase text-[#5C5E58]">
              OFFICIAL BRANDMARK (FAVICON ICO)
            </span>
            <p className="text-xs text-[#5C5E58]">
              Used strictly for small icon contexts (&le; 32px) to prevent raster pixelation.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex flex-col items-center gap-1">
                <BrandMark size="sm" />
                <span className="text-[10px] font-mono">16px</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <BrandMark size="md" />
                <span className="text-[10px] font-mono">24px</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <BrandMark size="lg" />
                <span className="text-[10px] font-mono">32px</span>
              </div>
            </div>
          </Surface>

          <Surface variant="muted" padding="md" className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase text-[#5C5E58]">
              BRAND PHILOSOPHY
            </span>
            <h4 className="font-['Sora'] font-bold text-sm">"Calm during chaos."</h4>
            <p className="text-xs text-[#5C5E58] leading-relaxed">
              No decorative fluff, gradients, glassmorphism, or unrequested features. Precision industrial layout built for high-stress incident command.
            </p>
          </Surface>
        </div>
      </section>

      {/* 2. Color Palette */}
      <section className="space-y-4">
        <SectionHeader
          eyebrow="2. Color Matrix"
          title="Canonical Color Palette"
          description="WCAG 2.2 AA compliant palette from PRD_SignalFold.md Section 20.3."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {colors.map((c) => (
            <Surface key={c.name} padding="sm" className="space-y-2">
              <div
                className={`h-14 w-full rounded-[4px] p-2 flex flex-col justify-end ${c.text} shadow-xs border border-black/10`}
                style={{ backgroundColor: c.hex }}
              >
                <span className="font-mono text-[10px] font-bold">{c.hex}</span>
              </div>
              <div>
                <p className="font-bold text-xs">{c.name}</p>
                <p className="text-[10px] text-[#5C5E58] dark:text-[#A8AAA3] line-clamp-2">{c.desc}</p>
              </div>
            </Surface>
          ))}
        </div>
      </section>

      {/* 3. Typography */}
      <section className="space-y-4">
        <SectionHeader
          eyebrow="3. Typography"
          title="Type Scale & Local Font Architecture"
          description="Sora (Display), Inter (UI Body), and IBM Plex Mono (Technical Metadata) loaded locally via @fontsource."
        />

        <Surface variant="default" padding="md" className="space-y-4">
          <div>
            <span className="text-[10px] font-mono text-[#5C5E58] uppercase">Display Header (Sora Bold)</span>
            <h1 className="font-['Sora'] text-2xl md:text-3xl font-bold tracking-tight">
              Checkout payment transactions failing following deploy
            </h1>
          </div>

          <div>
            <span className="text-[10px] font-mono text-[#5C5E58] uppercase">Section Title (Sora SemiBold)</span>
            <h2 className="font-['Sora'] text-lg md:text-xl font-semibold tracking-tight">
              Incident Response Room & System Health Status
            </h2>
          </div>

          <div>
            <span className="text-[10px] font-mono text-[#5C5E58] uppercase">Body Copy (Inter Regular)</span>
            <p className="font-sans text-sm text-[var(--color-text-secondary,#242522)] dark:text-[#A8AAA3] leading-relaxed">
              SignalFold correlates operational signals into clear, actionable incident response workflows. High contrast design prevents cognitive fatigue during critical SEV1 outages.
            </p>
          </div>

          <div>
            <span className="text-[10px] font-mono text-[#5C5E58] uppercase">Technical Code & Metadata (IBM Plex Mono)</span>
            <div className="font-mono text-xs bg-[#0A0A0A] text-[#D6FF3F] p-3 rounded-[4px]">
              INCIDENT_CODE: SF-2026-0042 | SEVERITY: SEV1_CRITICAL | ACKNOWLEDGED_AT: 2026-07-21T14:39:10Z
            </div>
          </div>
        </Surface>
      </section>

      {/* 4. Action Buttons & IconButton */}
      <section className="space-y-4">
        <SectionHeader
          eyebrow="4. Action Controls"
          title="Canonical Button & IconButton Primitives"
          description="Button variants: primary, secondary, quiet, destructive, link. IconButton with mandatory accessible label."
        />

        <Surface variant="default" padding="md" className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="quiet">Quiet</Button>
            <Button variant="destructive" leadingIcon={<ShieldAlert className="w-4 h-4" />}>
              Destructive
            </Button>
            <Button variant="link">Link Style</Button>
            <Button variant="primary" isLoading loadingText="Analyzing Signal...">
              Loading
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>

          <Divider label="IconButton Primitives" />

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <IconButton icon={<Sparkles className="w-4 h-4" />} aria-label="AI Signal Triage" variant="primary" />
              <span className="text-xs font-mono">Primary</span>
            </div>

            <div className="flex items-center gap-2">
              <IconButton icon={<Search className="w-4 h-4" />} aria-label="Search incidents" variant="secondary" />
              <span className="text-xs font-mono">Secondary</span>
            </div>

            <div className="flex items-center gap-2">
              <IconButton icon={<Info className="w-4 h-4" />} aria-label="Incident Information" variant="quiet" />
              <span className="text-xs font-mono">Quiet</span>
            </div>

            <div className="flex items-center gap-2">
              <IconButton icon={<ShieldAlert className="w-4 h-4" />} aria-label="Declare SEV1" variant="destructive" />
              <span className="text-xs font-mono">Destructive</span>
            </div>

            <div className="flex items-center gap-2">
              <IconButton icon={<Activity className="w-4 h-4" />} aria-label="Disabled Action" disabled />
              <span className="text-xs font-mono">Disabled</span>
            </div>
          </div>
        </Surface>
      </section>

      {/* 5. Form Primitives */}
      <section className="space-y-4">
        <SectionHeader
          eyebrow="5. Form Control Primitives"
          title="Field, Input, Textarea, Select, Checkbox, Switch, SearchInput"
          description="Accessible form controls with proper ARIA wiring, keyboard navigation, and field composition."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Surface variant="default" padding="md" className="space-y-4">
            <Input
              label="Incident Identifier"
              isMono
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              helperText="Unique organization incident identifier"
              required
            />

            <Select
              label="Incident Severity Level"
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              options={[
                { value: 'sev1', label: 'SEV1 — Critical Outage' },
                { value: 'sev2', label: 'SEV2 — Major Degradation' },
                { value: 'sev3', label: 'SEV3 — Moderate Issue' },
                { value: 'sev4', label: 'SEV4 — Low Severity' },
              ]}
              helperText="Determines response SLA and notification escalation"
            />

            <SearchInput
              label="Search Systems & Logs"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue('')}
              helperText="Supports search by pod, service, or cluster ID"
            />
          </Surface>

          <Surface variant="default" padding="md" className="space-y-4">
            <Textarea
              label="Symptom & Impact Notes"
              placeholder="Describe observed behavior, failing endpoints, and affected user cohorts..."
              rows={3}
              helperText="Provides context for AI summary engine"
            />

            <Checkbox
              label="Acknowledge page notification SLA"
              description="Confirms incident commander has taken ownership"
              checked={checkboxChecked}
              onChange={(e) => setCheckboxChecked(e.target.checked)}
            />

            <Switch
              label="Enable automated telemetry aggregation"
              description="Routes cluster metrics directly to incident room"
              checked={switchChecked}
              onCheckedChange={setSwitchChecked}
            />
          </Surface>
        </div>
      </section>

      {/* 6. Canonical Domain Badges & Status */}
      <section className="space-y-4">
        <SectionHeader
          eyebrow="6. Domain Status Primitives"
          title="SeverityBadge, IncidentStatusBadge, StatusDot, Tag"
          description="Domain-specific status and severity badges driven by canonical domain types in src/domain/incident.ts."
        />

        <Surface variant="default" padding="md" className="space-y-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#5C5E58] block mb-2">
              CANONICAL SEVERITIES (SEV1-4)
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <SeverityBadge level="SEV1" />
              <SeverityBadge level="SEV2" />
              <SeverityBadge level="SEV3" />
              <SeverityBadge level="SEV4" />
              <SeverityBadge level="SEV1" compact />
            </div>
          </div>

          <Divider label="Incident Workflow Statuses" />

          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#5C5E58] block mb-2">
              CANONICAL WORKFLOW STATUSES
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <IncidentStatusBadge status="reported" />
              <IncidentStatusBadge status="triaging" />
              <IncidentStatusBadge status="investigating" />
              <IncidentStatusBadge status="identified" />
              <IncidentStatusBadge status="monitoring" />
              <IncidentStatusBadge status="resolved" />
              <IncidentStatusBadge status="closed" />
            </div>
          </div>

          <Divider label="StatusDot & Metadata Tags" />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <StatusDot tone="critical" showLabel label="Critical" />
              <StatusDot tone="warning" showLabel label="Warning" />
              <StatusDot tone="info" showLabel label="Info" />
              <StatusDot tone="success" showLabel label="Healthy" />
              <StatusDot tone="signal" showLabel label="AI Active" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {tags.map((t) => (
                <Tag key={t} label={t} onRemove={() => handleRemoveTag(t)} />
              ))}
            </div>
          </div>
        </Surface>
      </section>

      {/* 7. Surface & Data Primitives */}
      <section className="space-y-4">
        <SectionHeader
          eyebrow="7. Surface & Data Display Primitives"
          title="Surface Variants, Metric, Avatar, Divider"
          description="Structural data display controls with tabular numbers and accessible avatars."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Metric label="MTTR Target" value="14.2m" trend={{ direction: 'down', value: '-3.1m' }} context="vs 30-day baseline" />
          <Metric label="Active Incidents" value="2" trend={{ direction: 'up', value: '+1' }} context="1 SEV1 critical" />
          <Metric label="Telemetry Health" value="99.9%" trend={{ direction: 'neutral', value: '0%' }} context="All pipelines active" />
          <Metric label="AI Resolution Rate" value="88%" trend={{ direction: 'up', value: '+5%' }} context="Confidence >90%" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <Surface variant="default" padding="md" className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase text-[#5C5E58]">SURFACE: DEFAULT</span>
            <p className="text-xs text-[#5C5E58]">Standard white/dark container with sharp border.</p>
          </Surface>

          <Surface variant="muted" padding="md" className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase text-[#5C5E58]">SURFACE: MUTED</span>
            <p className="text-xs text-[#5C5E58]">Off-white paper container for secondary cards.</p>
          </Surface>

          <Surface variant="inverse" padding="md" className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase text-[#D6FF3F]">SURFACE: INVERSE</span>
            <p className="text-xs text-[#A8AAA3]">High contrast dark container for operational callouts.</p>
          </Surface>
        </div>

        <Surface variant="default" padding="md" className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name="Sarah Chen" size="lg" />
            <div>
              <p className="text-xs font-bold font-mono">Sarah Chen</p>
              <p className="text-[10px] text-[#5C5E58]">Primary Incident Commander</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Avatar name="Alex Rivera" size="md" />
            <Avatar name="David Kim" size="md" />
            <Avatar name="System Agent" size="sm" />
          </div>
        </Surface>
      </section>

      {/* 8. Feedback & State Primitives */}
      <section className="space-y-4">
        <SectionHeader
          eyebrow="8. Operational Feedback Primitives"
          title="InlineAlert, EmptyState, Skeleton, Spinner, ProgressBar"
          description="Accessible, non-disruptive feedback indicators for real-time triage."
        />

        <div className="space-y-3">
          <InlineAlert
            variant="critical"
            title="SEV1 Outage Active — Checkout API"
            description="500 Internal Server Error rate exceeds 24% on endpoint /v2/payments/charge."
            action={<Button variant="destructive" size="sm">Acknowledge</Button>}
          />

          <InlineAlert
            variant="warning"
            title="High Latency Detected on Replica DB"
            description="Read operations experiencing 450ms p99 response times."
          />

          <InlineAlert
            variant="success"
            title="Automated Rollback Completed"
            description="Deployment build v2.4.1 restored. Error rate normalized to <0.01%."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <Surface variant="default" padding="md" className="space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase text-[#5C5E58]">PROGRESS & SPINNER</span>
            <ProgressBar value={72} label="AI Root Cause Analysis" showValueLabel tone="signal" />
            <ProgressBar value={40} label="Telemetry Ingestion" showValueLabel tone="critical" />

            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                <span className="text-xs font-mono">Small</span>
              </div>
              <div className="flex items-center gap-2">
                <Spinner size="md" className="text-[#D6FF3F]" />
                <span className="text-xs font-mono">Signal Spinner</span>
              </div>
              <Tooltip content="Confidence score: 96%">
                <Button variant="secondary" size="sm" leadingIcon={<Info className="w-3.5 h-3.5" />}>
                  Hover Tooltip
                </Button>
              </Tooltip>
            </div>
          </Surface>

          <Surface variant="default" padding="md" className="space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase text-[#5C5E58]">SKELETON PLACEHOLDERS</span>
            <div className="space-y-2 pt-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </Surface>
        </div>

        <EmptyState
          icon={<Terminal className="w-5 h-5" />}
          title="No Resolved Incidents in View"
          description="All active incidents are currently being managed in the triage queue."
          action={<Button variant="primary" size="sm">View All Queue Items</Button>}
        />
      </section>

      {/* 9. Accessible Dialog Demo */}
      <section className="space-y-4">
        <SectionHeader
          eyebrow="9. Dialog & Modal Specification"
          title="Radix Dialog Focus Trap & Keyboard Navigation"
          description="Fully accessible dialog with focus containment, Escape listener, and screen reader labels."
        />

        <Surface variant="muted" padding="md" className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm">Interactive Dialog Verification</h4>
            <p className="text-xs text-[#5C5E58]">Click to test accessible Radix Dialog focus trap, ESC key, and return focus.</p>
          </div>

          <Button variant="primary" onClick={() => setIsDialogOpen(true)} leadingIcon={<Layers className="w-4 h-4" />}>
            Open Dialog
          </Button>
        </Surface>

        <Dialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="Declare SEV1 Critical Incident"
          description="This action will trigger primary responder paging and open an incident command room."
          footer={
            <>
              <Button variant="quiet" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => setIsDialogOpen(false)}>
                Confirm SEV1 Declaration
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-left">
            <Input
              label="Affected Service / Endpoint"
              defaultValue="/v2/payments/charge"
              isMono
              required
            />
            <Textarea
              label="Impact Brief"
              defaultValue="500 Errors spiking on primary payment gateway during checkout."
              rows={3}
              required
            />
          </div>
        </Dialog>
      </section>
    </div>
  );
};
