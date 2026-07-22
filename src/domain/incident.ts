/**
 * SignalFold — Canonical Incident Domain Types
 */

export type SeverityLevel = 'SEV1' | 'SEV2' | 'SEV3' | 'SEV4';

export type IncidentStatus =
  | 'reported'
  | 'triaging'
  | 'investigating'
  | 'identified'
  | 'monitoring'
  | 'resolved'
  | 'closed';

export const SEVERITY_CONFIG: Record<
  SeverityLevel,
  { label: string; fullLabel: string; bg: string; text: string; border: string; indicator: string }
> = {
  SEV1: {
    label: 'SEV1',
    fullLabel: 'SEV1 · Critical',
    bg: 'bg-[#FF4D3D]/10',
    text: 'text-[#FF4D3D]',
    border: 'border-[#FF4D3D]/30',
    indicator: 'bg-[#FF4D3D]',
  },
  SEV2: {
    label: 'SEV2',
    fullLabel: 'SEV2 · Major',
    bg: 'bg-[#F2B84B]/10',
    text: 'text-[#D98E04] dark:text-[#F2B84B]',
    border: 'border-[#F2B84B]/30',
    indicator: 'bg-[#F2B84B]',
  },
  SEV3: {
    label: 'SEV3',
    fullLabel: 'SEV3 · Moderate',
    bg: 'bg-[#4B78FF]/10',
    text: 'text-[#4B78FF]',
    border: 'border-[#4B78FF]/30',
    indicator: 'bg-[#4B78FF]',
  },
  SEV4: {
    label: 'SEV4',
    fullLabel: 'SEV4 · Low',
    bg: 'bg-[#28A66A]/10',
    text: 'text-[#28A66A]',
    border: 'border-[#28A66A]/30',
    indicator: 'bg-[#28A66A]',
  },
};

export const STATUS_CONFIG: Record<
  IncidentStatus,
  { label: string; bg: string; text: string; border: string; dotTone: 'critical' | 'warning' | 'info' | 'success' | 'neutral' }
> = {
  reported: {
    label: 'Reported',
    bg: 'bg-[#242522]/10 dark:bg-white/10',
    text: 'text-[#242522] dark:text-[#F3F1EA]',
    border: 'border-[#242522]/20 dark:border-white/20',
    dotTone: 'neutral',
  },
  triaging: {
    label: 'Triaging',
    bg: 'bg-[#D6FF3F]/15 dark:bg-[#D6FF3F]/20',
    text: 'text-[#0A0A0A] dark:text-[#D6FF3F]',
    border: 'border-[#0A0A0A] dark:border-[#D6FF3F]/40',
    dotTone: 'warning',
  },
  investigating: {
    label: 'Investigating',
    bg: 'bg-[#F2B84B]/10',
    text: 'text-[#D98E04] dark:text-[#F2B84B]',
    border: 'border-[#F2B84B]/30',
    dotTone: 'warning',
  },
  identified: {
    label: 'Identified',
    bg: 'bg-[#4B78FF]/10',
    text: 'text-[#4B78FF]',
    border: 'border-[#4B78FF]/30',
    dotTone: 'info',
  },
  monitoring: {
    label: 'Monitoring',
    bg: 'bg-[#4B78FF]/10',
    text: 'text-[#4B78FF]',
    border: 'border-[#4B78FF]/30',
    dotTone: 'info',
  },
  resolved: {
    label: 'Resolved',
    bg: 'bg-[#28A66A]/10',
    text: 'text-[#28A66A]',
    border: 'border-[#28A66A]/30',
    dotTone: 'success',
  },
  closed: {
    label: 'Closed',
    bg: 'bg-[#A8AAA3]/10',
    text: 'text-[#5C5E58] dark:text-[#A8AAA3]',
    border: 'border-[#A8AAA3]/30',
    dotTone: 'neutral',
  },
};
