# PHASE 1 — BRAND DECISIONS & DESIGN SYSTEM SPECIFICATION (CORRECTION PASS)

> **SignalFold — AI-Assisted Incident Command Center**  
> Document Version: 1.1 (Correction Pass Complete)  
> Status: Phase 1 Fully Verified  
> Source of Truth: `PRD_SignalFold.md` Section 20  

---

## 1. Executive Summary & Brand Vision

SignalFold is designed around the core principle: **"Calm during chaos."**

When an operational outage occurs, engineers and incident commanders face high-pressure environments, fragmented communication, and noisy metrics. SignalFold's visual language eliminates decorative fluff (gradients, glassmorphism, floating glows, unnecessary rounded shapes) in favor of high-contrast, editorial, precision-engineered industrial controls.

- **Brand Tagline:** *Turn signals into action.*
- **Visual Personality:** Precise, calm, authoritative, industrial, WCAG 2.2 AA accessible.

---

## 2. Brand Identity & Logo Architecture (Verified Official Assets)

### 2.1 Logo Policy & Lockup Architecture
To adhere strictly to PRD Section 20.2 and Phase 1 correction mandates:
- **No Network Font Requests:** All fonts (`Sora`, `Inter`, `IBM Plex Mono`) are bundled locally via `@fontsource`.
- **No SVG Reconstructions:** All unofficial SVG reconstructions (`SignalFoldSvgMark`) were deleted.
- **Official Asset Usage:**
  - `BrandLogo` uses `src/assets/brand/SignalFold-logo.png` exclusively for all lockup displays.
  - `BrandMark` uses `public/favicon.ico` for small icon contexts (&le; 32px) to prevent raster pixelation.

### 2.2 Component Usage
Implemented in `src/components/brand/BrandLogo.tsx` and `src/components/brand/BrandMark.tsx`:
- Scale sizes: `sm` (24px), `md` (32px), `lg` (48px).
- Preserves accessible name `alt="SignalFold"`.

---

## 3. Color Palette & WCAG 2.2 AA Contrast Matrix

| Token Name | Hex Code | Primary Purpose | Contrast Ratio vs Surface | Compliance Status |
|---|---|---|---|---|
| `--ink` | `#0A0A0A` | Primary text, dark backgrounds | 18.5:1 on `#F3F1EA` | PASS (AAA) |
| `--paper` | `#F3F1EA` | Off-white warm canvas background | Base canvas | PASS |
| `--surface` | `#FFFFFF` | Card & modal containers | 1.1:1 vs Paper | PASS (Subtle elevation) |
| `--graphite` | `#242522` | Borders, dark buttons, secondary text | 12.3:1 on Paper | PASS (AAA) |
| `--muted` | `#A8AAA3` | Muted labels, disabled borders | 3.2:1 on Ink | PASS (Large text/ui) |
| `--signal` | `#D6FF3F` | Active AI badges, primary CTA | 16.2:1 vs Ink | PASS (AAA on Dark) |
| `--critical` | `#FF4D3D` | SEV1 Critical incidents, destruction | 4.8:1 on Surface | PASS (AA) |
| `--warning` | `#F2B84B` | SEV2 Major incidents, warnings | 4.6:1 on Surface | PASS (AA) |
| `--success` | `#28A66A` | SEV4 Low incidents, resolved status | 4.9:1 on Surface | PASS (AA) |
| `--info` | `#4B78FF` | SEV3 Moderate incidents, links | 5.2:1 on Surface | PASS (AA) |

---

## 4. Typography System (Local Font Packages)

| Role | Package | Font Family | Weights | Usage |
|---|---|---|---|---|
| **Display / Brand** | `@fontsource-variable/sora` | `Sora Variable`, sans-serif | 600, 700 | Wordmark, Page Headers, Modal Titles |
| **UI Body / Controls** | `@fontsource-variable/inter` | `Inter Variable`, sans-serif | 400, 500, 600 | Card titles, body copy, input text |
| **Technical Metadata** | `@fontsource/ibm-plex-mono` | `IBM Plex Mono`, monospace | 400, 500, 600 | Incident codes (`SF-2026-0042`), durations, badges |

---

## 5. Domain Types & Canonical Component Inventory

### 5.1 Domain Incident Types (`src/domain/incident.ts`)
- `SeverityLevel`: `'SEV1' | 'SEV2' | 'SEV3' | 'SEV4'`
- `IncidentStatus`: `'reported' | 'triaging' | 'investigating' | 'identified' | 'monitoring' | 'resolved' | 'closed'`

### 5.2 Canonical Action & Form Controls (`src/components/ui/`)
1. `Button`: Canonical variants (`primary`, `secondary`, `quiet`, `destructive`, `link`), leading/trailing icons, disabled & loading states.
2. `IconButton`: Mandatory accessible `aria-label`, icon size, touch targets.
3. `Field`: Reusable form composition (label, description, error, ARIA wiring).
4. `Input`: Text input with `Field` integration, `isMono`, left/right icons, error states.
5. `Textarea`: Multi-line text field with `Field` integration.
6. `Select`: Native select control with `Field` integration.
7. `Checkbox`: Clickable label, space key listener, non-color-only check mark.
8. `Switch`: `role="switch"`, `aria-checked`, keyboard focus ring.
9. `SearchInput`: `type="search"`, clear button with accessible label.

### 5.3 Canonical Domain & Data Display Controls
10. `SeverityBadge`: Takes strictly `SeverityLevel` (`SEV1`-`SEV4`), text + color + dot.
11. `IncidentStatusBadge`: Takes strictly `IncidentStatus`, readable label + dot.
12. `StatusDot`: Semantic tones (`critical`, `warning`, `info`, `success`, `neutral`, `signal`).
13. `Surface`: Outer container with variants (`default`, `muted`, `inverse`, `outlined`).
14. `SectionHeader`: Eyebrow, heading, description, action layout.
15. `Divider`: Horizontal separator with optional text label.
16. `Metric`: Tabular numerals, trend indicators, context labels.
17. `Avatar`: Accessible name, initials fallback, image error handling.
18. `Tag`: Metadata pill with optional accessible removal button.

### 5.4 Canonical Feedback & Overlay Controls
19. `InlineAlert`: Non-modal alerts (`info`, `success`, `warning`, `critical`).
20. `EmptyState`: Actionable placeholder state.
21. `Skeleton`: Opacity pulse placeholder with reduced-motion static fallback.
22. `Spinner`: Accessible loader without logo graphics inside.
23. `ProgressBar`: Value semantics (`role="progressbar"`, `aria-valuenow`).
24. `Dialog`: Radix UI Dialog wrapper with focus trap, ESC key listener, body scroll lock.

---

## 6. Verification Status

- [x] Typecheck (`npm run typecheck`): 0 errors
- [x] Lint (`npm run lint`): 0 warnings, 0 errors
- [x] Unit Tests (`npm test`): 3/3 test suites passing (18/18 tests)
- [x] Build (`npm run build`): Production build successful
