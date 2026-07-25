# SignalFold

> Turn signals into action.

SignalFold is an AI-assisted incident command center that transforms scattered incident reports into structured triage, coordinated response tasks, realtime-ready activity history, controlled resolution workflows, and actionable Postmortems.

**Core Philosophy:** AI assists. Humans decide. The server is authoritative.

---

## 01 / Product Overview
SignalFold stands as an emergency response dashboard for high-velocity software engineering teams. In an outage or degradation event, SignalFold absorbs system and customer indicators, suggests severity levels, automates task assignments, and orchestrates live operator checklists. The application design features a "calm during chaos" theme, built in high-contrast industrial style, optimized for immediate readability under heavy cognitive load.

---

## 02 / Frontend Status
- **Current Phase:** Frontend Phase (Phase 1) is **Complete and Frozen**.
- **Backend Integrations:** Base44, DeepSeek, and Realtime SSE/WebSocket services are **not yet connected**.
- **Preview Operations:** Operational actions performed inside the UI during preview mode are strictly client-side and non-authoritative.
- **Security Check:** Production backend and API key isolation are not yet verified.

---

## 03 / Technology Stack
- **Framework & Runtime:** React 19 + Vite 6
- **Language:** TypeScript 5.8 (Strict Mode Enabled)
- **Styling Engine:** Tailwind CSS v4
- **Local Typography Assets:** `@fontsource-variable/sora`, `@fontsource-variable/inter`, `@fontsource/ibm-plex-mono` (Zero external Google Font API calls)
- **Routing:** React Router v7
- **Server State Management:** TanStack Query v5
- **Form Handling:** React Hook Form + Zod
- **Accessible Layers:** Radix UI Dialog (`@radix-ui/react-dialog`)
- **Icons:** Lucide React
- **Test Framework:** Vitest + React Testing Library + JSDOM

---

## 04 / Local Development
Ensure Node.js is installed locally, then run the following commands:

### Install Dependencies
```bash
npm install
```

### Start Local Development Server
```bash
npm run dev
```
*The application dev server starts on port `3000` at `http://localhost:3000`.*

---

## 05 / Environment Configuration
SignalFold uses local environments for frontend configuration. See `.env.example` for details.

### Crucial Security Declarations:
- Only variables starting with `VITE_` are exposed to the client-side bundle.
- Sensitive environment secrets (such as Base44 credentials or DeepSeek API keys) **must never** use `VITE_` prefixes. They belong strictly in backend and server-side configurations.
- `VITE_DATA_MODE="mock"` is the default frontend configuration for standalone preview and QA validation.

---

## 06 / Available Routes
The application is structured into public-facing information routes and authenticated operator command paths:

### Public Routes:
- `/` — Landing Page (Official brand lockup and high-visibility entryways)
- `/login` — Operator Login Gate
- `/signup` — Organization Registration Gateway
- `/privacy` — Privacy Policy
- `/terms` — Terms of Service

### Authenticated & Preview Routes:
- `/app` — Operations Dashboard (Live summaries, quick-create, response workload charts)
- `/app/onboarding` — Interactive Multi-Step Responder Onboarding Workstation
- `/app/incidents` — Directory of active and historical incidents (Searching, sorting, status filters)
- `/app/incidents/new` — Guided triage submission desk
- `/app/incidents/SF-2026-0042` — Canonical Active Command Room (Payments Fail Story)
- `/app/incidents/resolved-seed` — Canonical Resolved Command Room
- `/app/incidents/resolved-seed/postmortem` — Approved Postmortem and Reconstruction workspace
- `/app/services` — Monitored Services Directory (Read-only foundation awaiting backend API)
- `/app/team` — On-Call Responders Directory (Read-only foundation awaiting backend API)
- `/app/settings` — Workspace Preferences & Org Settings (Read-only foundation awaiting backend API)

---

## 07 / Canonical Demo Story
SignalFold is designed to demo a chronological operational journey:

```
REPORT (Indicator Signal)
  ↓
TRIAGE (Severity Recommendation & AI Analysis)
  ↓
COORDINATE (Active Tasks, Responder Assigns & Timeline Events)
  ↓
RESOLVE (Verification checklist, Resolved Incident Seed)
  ↓
LEARN (Postmortem Generation, Version Control & Reconstruction)
```

### Walkthrough Sequence:
1. **Landing:** Start on `/` and click "Enter Workspace".
2. **Dashboard:** Analyze active incidents on `/app`.
3. **Command Room (`SF-2026-0042`):** Step into the core outage room. Examine the incident header, trigger deep analysis under AI Triage, assign tasks to operators, and witness the append-only timeline log.
4. **Postmortem Foundation:** Visit `/app/incidents/resolved-seed` and step into `/postmortem` to run through the three-step postmortem approval, version check, and draft generation.

*Note: `SF-2026-0042` is reporting as active and cannot be permanently mutated by the local preview. The resolved state is accessed via `/app/incidents/resolved-seed`.*

---

## 08 / QA Preview Parameters
The development server features dedicated query-string QA overrides to test diverse visual, network, and system states without modifying database records:

### Connectivity States
- `?previewConnection=offline` — Forces system connectivity alert to "OFFLINE".
- `?previewConnection=reconnecting` — Displays technical reconnecting banner.
- `?previewConnection=restored` — Triggers restored success feedback.

### AI (DeepSeek) Simulation State
- `?previewAiOperation=<triage|postmortem>&previewAiState=pending` — Pulsing diagnostic analytical log.
- `?previewAiState=unavailable` — Custom error modal displaying detailed code `DS-503-PRO` with fallback local controls.
- `?previewAiState=timeout` — Triggers time limit exceeded status (`TIMEOUT_EXCEEDED`).
- `?previewAiState=rate-limited` — Emulates rate throttling with interactive retries.
- `?previewAiState=invalid` — Simulates structured payload validation errors.

### Route UI States
- `?previewUiState=loading&previewUiScope=<settings|incidents|etc>` — Renders custom bone-skeletons.
- `?previewUiState=forbidden` — Displays full-screen Access Denied dashboard banner.
- `?previewUiState=network-error` — Renders database retrieval error status with interactive retry buttons.
- `?previewUiState=empty` — Displays baseline empty empty-states.

---

## 09 / Testing
SignalFold features automated unit and integration tests across every visual layout and interaction.

### Run Full Test Suite
```bash
npm run test:run
```
*Current Coverage: 27 test files, 232 test cases (100% passing).*

---

## 10 / Production Build
Vite bundles and minifies static files into the local `/dist` folder.

### Run Production Compilation
```bash
npm run build
```

---

## 11 / Architecture Boundaries
- **Frontend Responsibilities:** Handles view layout, typography scaling, local form validator checks, client-side routing, negative-space balancing, interactive animation layers, and simulated mock workflows.
- **Future Base44 (Backend) Responsibilities:** Tenant and organization database isolation, user credential verification, authoritative membership permissions, concurrent task tracking (via optimistic locking), append-only chronological audits, and real-time state synchronization.
- **Future DeepSeek Responsibilities:** Provides telemetry parsing, structured incident summaries, postmortem timeline draft generation, and draft review feedback. DeepSeek remains a suggestion engine; write actions must be approved by an authorized human operator.

---

## 12 / Backend Integration Plan
Backend integration is structured to roll out progressively in Phase 2 via the Grok CLI:
1. Initialize Base44 project structure and client-side SDK.
2. Secure authentication session persistence.
3. Establish tenant organizations and member permissions.
4. Replace local mock stores with GET fetch API hooks.
5. Create writing functions for incidents, tasks, and audit logs.
6. Connect real-time Server-Sent Events (SSE) or WebSockets.
7. Wrap DeepSeek proxies around secure backend paths.

---

## 13 / Known Development Artefacts
During local container execution, the browser developer console may log:
`[vite] failed to connect to websocket`
This is a standard environment artifact resulting from the disabled HMR proxy layer. It has no bearing on compilation, application build integrity, or production runtimes.

---

## 14 / Security Notes
- Private keys, OAuth application credentials, and DeepSeek authorization tokens must belong strictly in backend system configurations.
- Client browsers must never be served with administrative secrets or direct raw database connections.

---

## 15 / Frontend Freeze Policy
The SignalFold frontend is **frozen**. Any structural changes to layout, stylesheets, paths, or default data files must comply with the change-control procedures documented in `/docs/FRONTEND_FREEZE.md`.
