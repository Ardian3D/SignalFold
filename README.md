# SignalFold

> Turn signals into action.

SignalFold is an AI-assisted incident command center that transforms scattered incident reports into structured triage, coordinated response tasks, realtime-ready activity history, controlled resolution workflows, and human-reviewed Postmortems.

**Core Philosophy:** AI assists. Humans decide. The server is authoritative.

---

## 01 / Product Overview

SignalFold is an emergency response dashboard for high-velocity software engineering teams. In an outage or degradation event, SignalFold absorbs system and customer indicators, suggests severity levels, coordinates response tasks, tracks an append-only timeline, and guides a controlled resolution plus a human-approved Postmortem. The application uses a "calm during chaos" high-contrast industrial theme optimized for immediate readability under heavy cognitive load.

### Core P0 Capability

- Authenticated operator sessions via Base44.
- Tenant-scoped organizations, memberships, and role authority (Reporter / Responder / Incident Manager / Admin).
- Service catalog, incident creation, and a live dashboard.
- Incident Room with tasks, timeline, authority transitions, and resolution.
- DeepSeek server-side triage (suggestion only — human reviews and applies).
- Base44 realtime subscriptions with an owner-approved 10-second bounded reconciliation fallback.
- Human-reviewed Postmortem generation, editing, review, and approval.

---

## 02 / Technology Stack

- **Framework & Runtime:** React 19 + Vite 6
- **Language:** TypeScript 5.8 (Strict Mode Enabled)
- **Styling Engine:** Tailwind CSS v4
- **Routing:** React Router v7
- **Server State Management:** TanStack Query v5
- **Backend:** Base44 Developer Backend (`@base44/sdk`) with entity RLS and server-side functions
- **AI:** DeepSeek (server-side only)
- **Test Framework:** Vitest + React Testing Library + JSDOM

---

## 03 / Local Development

### Prerequisites

- Node.js (npm)
- A Base44 project link for backend mode (`base44/.app.jsonc`); mock mode works without it

### Install Dependencies

```bash
npm install
```

### Start Local Development Server

```bash
npm run dev
```

The application dev server starts on port `3000` at `http://localhost:3000`.

### Build

```bash
npm run build
```

### Test

```bash
npm test            # full suite, serial Vitest configuration
npm run test:run    # vitest run
```

### Typecheck and lint

```bash
npm run typecheck
npm run lint
```

---

## 04 / Environment Configuration

See `.env.example`. Only variables starting with `VITE_` are exposed to the client bundle. Secrets must **never** use a `VITE_` prefix.

Frontend-public variables:

- `VITE_DATA_MODE` — `"mock"` (default, standalone preview) or `"base44"` (live backend)
- `VITE_BASE44_APP_ID` — public Base44 application ID (not a secret)
- `VITE_BASE44_USE_LOCAL_DEV` — local-only development flag
- `VITE_BASE44_LOCAL_SERVER_URL` — defaults to `http://localhost:4400`

Server-only secrets (configured in the Base44 secret store, never in the repo or the browser):

- `DEEPSEEK_API_KEY` — required for live AI triage / Postmortem generation
- `DEEPSEEK_MODEL` — expected `deepseek-v4-flash`
- `DEEPSEEK_BASE_URL`, `DEEPSEEK_TIMEOUT_MS`, `AI_POSTMORTEM_TIMEOUT_MS` — optional tuning

There is intentionally **no** `VITE_DEEPSEEK_API_KEY`.

---

## 05 / Mock Mode

When `VITE_DATA_MODE="mock"` (or the app is not configured), SignalFold runs a deterministic frontend mock:

- No backend writes; operations are read-only previews.
- Demo helper text appears where appropriate.
- Realtime is a no-op and the 10-second reconciliation does not run.

Mock mode is for design QA and isolated preview. Production behavior uses `VITE_DATA_MODE="base44"` with a linked Base44 app.

---

## 06 / Authenticated Routes

- `/app` — Operations Dashboard
- `/app/onboarding` — First-time organization setup
- `/app/incidents` — Incident list (search, filters, sort)
- `/app/incidents/new` — Create incident
- `/app/incidents/:incidentId` — Incident Room (Timeline / Tasks / Details)
- `/app/incidents/:incidentId/postmortem` — Postmortem editor
- `/app/services` — Service catalog
- `/app/team` — Team / members
- `/app/settings` — Organization settings (incl. demo workspace)

---

## 07 / Demo Workspace

SignalFold ships a deterministic demo workspace for presentation:

- Canonical demo organization **Northstar Commerce** (`is_demo=true`), owned by the Admin who loads it.
- Four canonical services: Checkout Web, Payments API, Order Processor, Customer Portal.
- Secondary seed records: one active SEV2 incident, one resolved sample with an approved Postmortem fixture, and low-priority historical incidents.
- The **live main incident** ("Checkout payments failing after latest deployment") is intentionally **not** pre-seeded — the presenter creates it during the demo so AI suggestions are real.

### Load Demo Workspace

Admin-only, from an empty dashboard or the demo helper card. Calls the `seed-demo-data` backend function.

### Reset Demo Workspace

Admin-only, from the demo helper card. Requires typing the exact confirmation **`RESET DEMO DATA`**. Reset only removes the current organization's demo-owned records (Incidents and their Postmortem / Tasks / Timeline / incident-scoped AiRun children). Services, the organization, memberships, and non-demo records are preserved.

---

## 08 / DeepSeek Setup (high level)

1. Configure `DEEPSEEK_API_KEY` and `DEEPSEEK_MODEL` as Base44 server secrets.
2. Live triage and Postmortem generation run entirely server-side in backend functions. The browser never calls `api.deepseek.com` directly and never holds the key.
3. AI output is strictly validated, bounded, and treated as a draft/suggestion until a human applies or approves it.

---

## 09 / Realtime

- Base44 entity subscriptions (`Incident`, `IncidentTask`, `IncidentUpdate`) are the **primary** synchronization transport for the active Incident Room.
- In the current hosted environment, Base44 service-role backend-function writes do not currently produce observed `update_model` frames to other clients. This is a proven platform delivery limitation, not a SignalFold adapter defect.
- The product owner approved a **degraded fallback** (PRD 1.1): while an authenticated active Incident Room is online and document-visible, the hook performs a bounded authoritative read reconciliation every **10 seconds** (`REALTIME_RECONCILIATION_INTERVAL_MS`).
- Fallback-discovered data is **never** labeled LIVE; LIVE is reserved for a genuine subscription callback. No 1-second or high-frequency polling is used, and no polling exists outside the active Incident Room.

---

## 10 / Security & Authority

- The server is authoritative: actor, timestamps, organization scope, approver identity, and approval time are all server-derived.
- `Membership.role` is authoritative. `User.role` is never used for authorization.
- Reporter and Responder cannot mutate severity/status/commander/resolution, run AI triage, generate/approve Postmortems, or reset demo data.
- All privileged writes go through backend functions; entity RLS denies direct client writes.
- DeepSeek never changes authority: it produces suggestions/drafts only.
- No secrets are exposed to the browser; no service-role client is used in the bundle.

---

## 11 / Testing

```bash
npm test
```

SignalFold uses the serial Vitest configuration (`--maxWorkers=1`). The full suite covers authorization, tenant isolation, authority transitions, task concurrency, AI safety, realtime/fallback behavior, Postmortem approval, and demo seed/reset safety.

---

## 12 / Production Deployment

1. Ensure `VITE_DATA_MODE="base44"` and `VITE_BASE44_APP_ID` point at the hosted app.
2. Deploy backend functions that changed (targeted `npx base44 functions deploy <name> ...`).
3. Build and deploy the site: `npm run build && npx base44 site deploy -y`.
4. Never run a full `npx base44 deploy` without owner intent; never `auth push` unless an auth configuration change is required.

---

## 13 / Known Limitations

- Base44 hosted realtime delivery for service-role backend-function writes is not currently observed (documented platform behavior); the 10-second bounded reconciliation covers it.
- `npm audit` reports pre-existing advisories in transitive dependencies (`nanoid`, `react-router`) that require a breaking dependency/framework migration to resolve.
- The production bundle emits a large-chunk warning; no breaking code-split refactor was applied.

---

## 14 / Repository

- Product document: `PRD_SignalFold.md` (version 1.1).
- Backend handoff: `docs/BACKEND_HANDOFF.md`.
- Demo runbook: `docs/DEMO_RUNBOOK.md`.
- Production readiness: `docs/PRODUCTION_READINESS.md`.
