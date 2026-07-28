/**
 * Shared operational affordance classes for the SignalFold dark ops shell.
 * Preserves Phase 04 visual identity (lime primary / outlined secondary / neutral outline)
 * while guaranteeing buttons, selects, and tabs read as interactive controls.
 */

const actionBase =
  'inline-flex items-center justify-center gap-1.5 text-xs font-mono font-bold tracking-wider uppercase rounded-[1px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer select-none';

/** Solid lime primary action (CREATE INCIDENT, CREATE TASK submit, COMPLETE, note submit). */
export const primaryActionButton =
  `${actionBase} min-h-[40px] px-5 py-2.5 bg-[#D6FF3F] hover:bg-[#D6FF3F]/90 active:bg-[#c5ee2e] text-black focus-visible:outline-[#D6FF3F]`;

/** Outlined lime secondary action (CREATE TASK opener, ADD INTERNAL NOTE opener, CLAIM, RESUME). */
export const secondaryActionButton =
  `${actionBase} min-h-[36px] px-4 py-2 border border-[#D6FF3F]/40 bg-[#D6FF3F]/10 hover:bg-[#D6FF3F]/20 active:bg-[#D6FF3F]/25 text-[#D6FF3F] focus-visible:outline-[#D6FF3F]`;

/** Alias kept for call-site readability in incident coordination surfaces. */
export const limeActionButton = secondaryActionButton;

/** Neutral outlined action (REFRESH, UNCLAIM, CLOSE/CANCEL, RETRY). */
export const neutralActionButton =
  `${actionBase} min-h-[36px] px-4 py-2 border border-[#242522] bg-[#141513] hover:bg-[#1c1d1b] hover:border-[#5C5E58] hover:text-[#D6FF3F] active:bg-[#0f100e] text-[#F3F1EA] focus-visible:outline-[#D6FF3F]`;

/** Compact neutral outlined action for toolbar companions such as REFRESH. */
export const compactNeutralActionButton =
  `${actionBase} min-h-[32px] px-3 py-1.5 border border-[#242522] bg-[#141513] hover:bg-[#1c1d1b] hover:border-[#5C5E58] hover:text-[#D6FF3F] active:bg-[#0f100e] text-[#F3F1EA] focus-visible:outline-[#D6FF3F]`;

/** Warning outlined action (MARK BLOCKED and destructive confirmation companions). */
export const warningActionButton =
  `${actionBase} min-h-[36px] px-4 py-2 border border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 active:bg-amber-500/25 text-amber-400 focus-visible:outline-amber-400`;

/** Native select control affordance — form control, not an action button. */
export const selectControl =
  'bg-[#141513] border border-[#242522] px-3 py-2 text-xs text-[#F3F1EA] rounded-[1px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6FF3F] disabled:opacity-50 disabled:cursor-not-allowed';

/** Text input / textarea control affordance. */
export const textInputControl =
  'bg-[#141513] border border-[#242522] px-3 py-2 text-[#F3F1EA] rounded-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6FF3F] disabled:opacity-50 disabled:cursor-not-allowed';

/** Incident Room tab target base. Combine with tabButtonActive / tabButtonInactive. */
export const tabButton =
  'min-w-0 w-1/3 py-3 text-center text-xs font-mono font-bold tracking-widest border-b-2 transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6FF3F] focus-visible:outline-offset-2';

export const tabButtonActive = 'border-[#D6FF3F] text-[#D6FF3F] bg-[#141513]/20';

/** Inactive tabs remain interactive (not disabled-looking muted slate). */
export const tabButtonInactive =
  'border-transparent text-[#A8AAA3] hover:text-[#D6FF3F] hover:bg-[#141513]/20';

/** Full-row navigation link used by incident lists and dashboard rows. */
export const interactiveNavRow =
  'border-t border-[#242522] py-3 text-[#F3F1EA] hover:text-[#D6FF3F] hover:bg-[#141513]/30 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D6FF3F] cursor-pointer';
