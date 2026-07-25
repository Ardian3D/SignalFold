# SignalFold — Frontend Freeze Document
## Verified Release and Handoff Baseline

This document establishes the official frontend baseline for **SignalFold**. As of the freeze date, all visual design elements, interactive user layouts, component interfaces, and local query mocks are locked.

---

## 01 / Metadata & Scope Baseline
- **Freeze Date:** July 25, 2026
- **Release Version:** `v1.0.0-frontend-freeze`
- **Frontend Core Lead:** AI Coding Agent
- **Freeze Scope:** Covers all public routes, authenticated pages, dashboard modules, incident room workspaces, and unit/integration test suites.

---

## 02 / Approved Visual Identity
The visual identity is locked to the official **SignalFold "Calm during Chaos"** brand design system:
- **Core Canvas:** Bright, warm, neutral off-white background (`#FAFAF9`) paired with a dark neutral charcoal sidebar (`#0E0F0D`).
- **Accent Palette:** High-visibility industrial values. Signals use Alert Amber (`#F59E0B`), Critical Red (`#EF4444`), Active Lime (`#D6FF3F`), and Slate/Zinc neutrals.
- **Typography:**
  - *Display (Headings):* Sora (Symmetric, technical tracking)
  - *Technical/Mono (Code, Labels):* IBM Plex Mono (Precise alignment)
  - *Body Text:* Inter (Optimized for readability under operational stress)
- **Logos:**
  - *Primary Brand Lockup:* PNG image loaded directly via the `/SignalFold-logo.png` relative asset.
  - *Favicon (BrandMark):* PNG icon loaded via `/favicon.ico`.

---

## 03 / Locked Routes
No new routes may be introduced, and no current paths may be renamed. This structure forms the exact endpoint mapping for the API proxy router:

| Route Path | Type | State / Status | Primary Component |
| :--- | :--- | :--- | :--- |
| `/` | Public | Active / Functional | `LandingPage` |
| `/login` | Public | Active / Mock Validated | `LoginPage` |
| `/signup` | Public | Active / Mock Validated | `SignupPage` |
| `/privacy` | Public | Active / Functional | `PrivacyPage` |
| `/terms` | Public | Active / Functional | `TermsPage` |
| `/app` | Authenticated | Active / Preview Mapped | `DashboardPage` |
| `/app/onboarding` | Authenticated | Active / Complete Flow | `OnboardingPage` |
| `/app/incidents` | Authenticated | Active / Filter Mapped | `IncidentsPage` |
| `/app/incidents/new` | Authenticated | Active / Form Validated | `CreateIncidentPage` |
| `/app/incidents/SF-2026-0042` | Authenticated | Active / Incident Room | `IncidentRoomPage` |
| `/app/incidents/resolved-seed` | Authenticated | Active / Resolved Room | `ResolvedIncidentPage` |
| `/app/incidents/resolved-seed/postmortem` | Authenticated | Active / Complete Flow | `PostmortemFoundationPage` |
| `/app/services` | Authenticated | Enabled Foundation | `ServicesPage` (Read-only Preview) |
| `/app/team` | Authenticated | Enabled Foundation | `TeamPage` (Read-only Preview) |
| `/app/settings` | Authenticated | Enabled Foundation | `SettingsPage` (Read-only Preview) |

---

## 04 / Locked Canonical Data
The local frontend operates under strict mock data constraints to ensure predictable UX walkthroughs. The following entities and initial records are frozen:

- **Incident SF-2026-0042:**
  - *Title:* "Checkout payments failing after latest deployment"
  - *Target Service:* `PAYMENTS API` (Impacted status)
  - *Status:* `REPORTED`
  - *Severity:* `NOT CONFIRMED` (Recommended: `SEV1`)
  - *Commander:* `UNASSIGNED`
  - *Reports / Strength:* 37 reports in 12 minutes, Signal strength: High.
  - *Timeline Events:* Exactly 4 default chronological mock logs.
  - *Active Tasks:* Exactly 5 recommended response tasks.
- **Monitored Services:** Exactly four canonical entries (`CHECKOUT WEB`, `PAYMENTS API`, `ORDER PROCESSOR`, `CUSTOMER PORTAL`).
- **Resolved Incident Seed:** `SF-2026-0043` is marked as resolved and serves as the gateway to the postmortem workflow.
- **Team Directory:** Read-only mock cards without fabricated external team members or credentials.

---

## 05 / Verified Viewport Matrix
The layout has been meticulously validated under 100% browser zoom against the following responsive viewports:
- **1440px / 1280px (Ultra-Wide & Desktop):** Two-column layout with pinned left sidebar navigation and right-rail collapsible metadata grids.
- **1024px (Tablet Landscape):** Standard responsive alignment. Left sidebar transitions smoothly.
- **768px (Tablet Portrait):** Left sidebar collapses. Hamburger menu drawer acts as primary navigation trigger. Right rail content stacks under main logs.
- **430px / 390px / 360px (Mobile Screen sizes):** Single column scrolling. Left drawer is fully tactile. Text items use strict `white-space: nowrap` inside tag containers to avoid single-character overflow. Bottom navigation retains full clearance above OS margins.

---

## 06 / QA Verification Status
- **Automated Test Suite:**
  - *Total Test Files:* 27 passing files
  - *Total Tests:* 232 passing test cases
  - *Test Engine:* Vitest + React Testing Library + JSDOM
- **TypeScript Compiler Output:** Clear compilation with zero errors under `tsc --noEmit`.
- **Linter Status:** Passing checks (`npm run lint` verified).
- **Production Build:** Successfully bundles static chunks to the `/dist` directory via Vite.

---

## 07 / Known Non-Application Artefacts
- **HMR WebSocket Warnings:** During local container sandbox execution, the browser console may log `[vite] failed to connect to websocket`.
- *Clarification:* This is a byproduct of the disabled Hot Module Replacement (HMR) environment proxy and does not affect production application runtimes or execution.

---

## 08 / Change-Control Policy
Post-freeze, no modification is permitted on the frontend files unless it falls under these exceptions:
1. **Critical Blocking Bug:** A repeatable crash, visual clipping, or navigational dead-end is discovered.
2. **Backend API Adaptation:** Modifying local repositories to fetch from dynamic fetch routes.
3. **Explicit Product Owner Authorization:** Design changes approved and documented beforehand.

### Required Delta Checklist for Approved Modifications:
1. Define the specific route and target component affected.
2. Estimate and document regression risks.
3. Validate visual and structural parity across the viewport matrix (1440px to 360px).
4. Run the full test suite (`npm run test:run`) and append relevant tests.
5. Secure official approval before merging changes.
