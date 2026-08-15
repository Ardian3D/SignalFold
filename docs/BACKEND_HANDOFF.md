# SignalFold — Backend Handoff Document
## System Phase 2: Grok CLI & Backend Integration

This document outlines the authoritative blueprint for transitioning **SignalFold** from its highly validated, responsive Frontend Phase (Phase 1) to the backend implementation phase.

## 00 / Backend Phase 01B Foundation Progress

The Phase 01B foundation is established with a basic backend-only Base44 project and `@base44/sdk` runtime boundary.

- **CLI:** Base44 CLI `0.1.5`, invoked through `npx base44@latest`.
- **SDK:** `@base44/sdk@0.8.40`.
- **Configuration:** `base44/config.jsonc`, with site output configured as `./dist`; developer app metadata remains ignored in `base44/.app.jsonc`.
- **Integration boundary:** `src/integrations/base44/config.ts`, `client.ts`, and `index.ts`.
- **Environment:** `VITE_DATA_MODE` defaults to `mock`; optional public Base44 settings are documented in `.env.example`.
- **Safety boundary:** The SDK client is lazy, mock mode does not instantiate it, and missing configuration is non-fatal.
- **Not implemented:** Authentication, entities, functions, realtime, persistence, seed data, and DeepSeek integration.
- **Deployment:** No Base44 deployment occurred.

The next phase is authentication and session foundation.

## 00A / Backend Phase 02A Auth Foundation

Phase 02A prepares authentication locally without changing the frozen Login or Signup UI.

- **Local auth configuration:** `base44/auth/config.jsonc`; email/password is enabled locally. The existing Google provider setting was preserved, while Microsoft, Facebook, Apple, and SSO remain disabled.
- **Remote state:** The local auth configuration has not been pushed and no deployment occurred.
- **Contracts and adapters:** `src/features/auth/domain`, `ports/AuthGateway.ts`, `adapters/Base44AuthGateway.ts`, and `adapters/MockAuthGateway.ts`.
- **Gateway selection:** `src/features/auth/authGateway.ts`; mock mode remains the default and Base44 mode without configuration returns a controlled unavailable result.
- **Session state:** `src/features/auth/session/authSessionMachine.ts` distinguishes uninitialized, restoring, authenticated, unauthenticated, unavailable, and recoverable error states.
- **Error normalization:** `src/features/auth/domain/authErrors.ts` maps authentication failures to safe typed codes without exposing SDK responses or credentials.
- **Token ownership:** Authentication tokens remain managed by the Base44 SDK. SignalFold does not read, persist, or expose them.
- **Role boundary:** Base44 `User.role` is not mapped to SignalFold organization authority. Organization roles require the future Membership layer.
- **Not wired yet:** Login, Signup, OTP UI, logout controls, route guards, Organization, Membership, tenant authorization, entities, functions, realtime, and DeepSeek integration.

The next phase is live authentication UI wiring and route guards.

## 00B / Backend Phase 02B Remote Auth Activation

The approved authentication configuration has now been pushed to Base44 and verified by pulling it back from the remote project.

- **Email/password:** Enabled remotely.
- **Google OAuth:** Enabled remotely using Base44-managed default OAuth credentials.
- **Custom OAuth credentials:** None; no Google client ID or secret is configured.
- **Other providers:** Microsoft, Facebook, Apple, and SSO remain disabled.
- **Remote operation:** Only the authentication configuration was pushed. No user was created and no deployment occurred.
- **Frontend status:** Login, Signup, Google login UI, route guards, and session-provider wiring remain intentionally unconnected.
- **Authorization boundary:** Authentication does not establish organization membership, tenant access, or SignalFold role authority. Organization and Membership remain unimplemented.

The next phase is live authentication UI integration.

## 00C / Backend Phase 02C Live Auth Integration

Phase 02C connects the frozen authentication surfaces to the existing Base44 foundation while preserving mock mode.

- **Provider:** `src/features/auth/AuthProvider.tsx`; exposes the typed session state and authentication actions through `useAuth()`.
- **Gateway:** `Base44AuthGateway` now supports Base44-managed Google provider login in addition to email/password and OTP operations.
- **Login and Signup:** `src/pages/LoginPage.tsx` and `src/pages/SignupPage.tsx` delegate live-mode actions without changing their approved mock-mode presentation.
- **OTP:** `/verify-email` is available for the verification-required registration result; passwords and OTP values remain transient.
- **Route guards:** `src/features/auth/AuthRouteGuards.tsx`, applied by `RootLayout`, protects `/app` routes and redirects authenticated users away from Login, Signup, and verification pages.
- **Return paths:** `src/features/auth/routing/returnPath.ts` accepts only internal `/app` paths and falls back safely to `/app`.
- **Logout:** Live-mode Sign Out delegates to the gateway and clears local session state; mock mode remains unchanged.
- **Session restoration:** The provider restores once at application startup and distinguishes authenticated, unauthenticated, unavailable, and recoverable error states.
- **Manual verification:** Browser automation was unavailable in this environment, so real email/OTP and Google consent flows remain pending external verification.
- **Not implemented:** Organization, Membership, tenant authorization, incident permissions, entities, backend functions, realtime, and DeepSeek integration.

The next phase is session completion and onboarding boundary work.

## 00D / Backend Phase 02C.1 Runtime Verification

- **Base44-mode configuration:** Verified from ignored local project metadata using a temporary `.env.local`; no runtime credential or secret was stored.
- **Automated coverage:** Added test-mode mock isolation and AuthProvider restoration tests. The suite covers mock preservation, one-time restoration, safe identity mapping, recoverable restoration errors, gateway contracts, OTP boundaries, Google provider delegation, and return-path safety.
- **Runtime HTTP checks:** Landing, Login, Signup, and protected-route entry points served successfully from the local Vite development server.
- **Live email/OTP/Google verification:** Not completed because the in-app browser runtime was unavailable. No real account, password, OTP, or Google consent flow was exercised.
- **Visual verification:** Pending browser availability; no visual code changes were made beyond the existing Phase 02C implementation.
- **Security boundary:** SDK token ownership remains unchanged. No Organization, Membership, tenant authorization, entities, functions, realtime, or DeepSeek integration exists.

Phase 02D remains blocked until external live-auth and browser visual verification are completed.

## 00E / Backend Phase 02C.2 Auth Redirect and Verification Layout Hardening

- **Hosted auth redirects:** The external SDK client uses only `appId` in hosted mode. It does not override `appBaseUrl`, so Base44-hosted SignalFold uses the SDK's native same-origin `/api/apps/auth/*` routes.
- **Local Base44 development:** A local server URL is accepted only when Base44 mode, explicit local development, development mode, and the exact `http://localhost:4400` origin are all present.
- **Google and logout:** Redirect-based Google OAuth and SDK logout are blocked on localhost because those same-origin routes belong to Base44 hosting. On a deployed origin, provider initiation remains `loginWithProvider('google', safePath)` and logout delegates once to `logout('/login')`. Mock logout remains unchanged.
- **Verify Email:** Login, Signup, and Verify Email now render through the shared authentication shell. Verify Email also uses shared main-layout and form-card primitives, including full-width OTP and responsive action controls.
- **Runtime verification:** A site-only Base44 deployment is still pending explicit approval. No full Base44 deployment or backend-resource deployment has occurred.
- **Scope:** No Organization, Membership, tenant authorization, entities, functions, realtime, or DeepSeek integration was added.

## 00F / Backend Phase 02D Session and Onboarding Boundary

- **Safe identity projection:** `src/features/auth/domain/userProjection.ts` is the single Base44 User projection. Application code receives only ID, email, nullable display name, and email-verification state; SDK tokens, metadata, and Base44 `User.role` remain excluded.
- **Session lifecycle:** `AuthProvider` restores once at bootstrap, deduplicates concurrent restoration, clears stale identity on invalid sessions and logout, and permits a controlled retry after recoverable network or service failures.
- **Application entry:** `getAuthenticatedEntryPath()` centralizes the `/app` default and safe protected deep-link validation for email login, Google OAuth, signup verification handoff, route guards, and authenticated public-route redirects.
- **Session failures:** Expired sessions resolve to unauthenticated and preserve a safe protected return path. Network and service failures remain distinct from logout and use the existing authentication-unavailable presentation with an accessible retry action.
- **AppShell identity:** Base44 mode reads only the projected identity through `useAuth()`. It displays a real display name or email fallback and marks organization context as unresolved; mock mode preserves `OPERATOR_01` and `NORTHSTAR COMMERCE`.
- **Onboarding boundary:** Mock onboarding remains unchanged. Base44 mode keeps `/app/onboarding` protected but does not create or join an organization, create Membership, assign a role, persist completion locally, or claim workspace entry succeeded.
- **Phase 03 integration point:** A future authoritative Membership resolver will determine organization context and whether onboarding is required. Authentication alone continues to prove identity only.
- **Scope:** No Organization, Membership, tenant authority, backend domain entity, function, realtime integration, or DeepSeek integration exists.
- **Runtime status:** Phase 02C email/password, OTP, Google OAuth, callback, restoration, logout, verification layout, and mock-mode behavior were manually accepted on Base44 hosting. The Phase 02D site-only deployment also passed hosted verification for safe AppShell identity, unresolved organization context, protected onboarding, the non-persisting organization setup boundary, hard-refresh restoration, logout to `/login`, and protected-route rejection after logout.
- **Major Phase 02 status:** Authentication and session boundaries are complete and verified. Organization, Membership, tenant authorization, and authoritative onboarding persistence remain explicitly deferred to Backend Phase 03.

---

## 01 / Frontend Freeze Status
The frontend codebase is **fully frozen**. All visual layouts, design typography, color tokens, and interactive flows are verified, tested, and complete.
- **Automated Coverage:** 27 test files, 232 test cases (all passing).
- **Type Safety:** 100% compliant TypeScript with zero unresolved compiler or linter errors.
- **Production Build:** Successfully bundled and compiled for static serving.

---

## 02 / Existing Frontend Routes
These routes are locked and must be maintained without renaming or changing hierarchies:

### Public Routes:
- `/` — Landing Page (Official branding, Core CTA, Walkthrough guide)
- `/login` — Operator authentication gate (frontend-complete with connection status indicators)
- `/signup` — Organization onboarding entrance
- `/privacy` — Privacy Policy
- `/terms` — Terms of Service
- `*` — Fallback 404 Page (Custom brand styling)

### Authenticated & Preview Routes:
- `/app` — Operational Dashboard (Module 01 - 07, summarizing status, workload, and quick actions)
- `/app/onboarding` — Interactive Multi-Step Operator Onboarding Flow
- `/app/incidents` — Complete Incident Directory (with sorting, searching, and filter controls)
- `/app/incidents/new` — Triage creation workspace
- `/app/incidents/SF-2026-0042` — Canonical Active Incident Command Room (payments fail story)
- `/app/incidents/resolved-seed` — Canonical Resolved Incident Room
- `/app/incidents/resolved-seed/postmortem` — Approved Postmortem and Reconstruction workspace
- `/app/services` — Read-only Directory of monitored applications
- `/app/team` — Read-only Directory of responders and on-call operators
- `/app/settings` — Read-only operator preferences and organization settings frontend reference

---

## 03 / Shared Domain Types & Mock Repositories
The current local application architecture models data in `src/domain/` and stores mock implementations in `src/data/`.

### Shared Domain Types
- `IncidentStatus`: `REPORTED` | `INVESTIGATING` | `IDENTIFIED` | `MITIGATED` | `RESOLVED`
- `Severity`: `SEV0` | `SEV1` | `SEV2` | `SEV3` (with a `NOT CONFIRMED` unassigned state)
- `Incident`: Maps core schema: id, incidentId, title, status, severity, recommendedSeverity, commander, services, signalStrength, reportsCount, reportedAt, resolvedAt, tasks, timeline.
- `IncidentTask`: id, text, completed, blocked, assignee.
- `TimelineEvent`: id, timestamp, type, title, description, author.

### Existing Mock Repositories
- `IncidentRepository` (`src/data/repositories/`) is utilized to mock queries for the primary incident `SF-2026-0042` and the resolved seed `SF-2026-0043`.
- Backend developers must implement real database queries wrapping these existing contracts.

---

## 04 / UI State Machines & Feedback Taxonomy
The frontend manages asynchronous operations, AI generations, and network failures through standard query-parameter hooks:

### Asynchronous Operations Feedback Matrix:
- `previewUiState=loading` & `previewUiScope=<settings|incidents|etc>` — Renders custom skeletons.
- `previewUiState=forbidden` — Renders high-contrast "Access Denied" panels.
- `previewUiState=network-error` — Renders connection failure views with retry logic.
- `previewUiState=empty` & `previewUiState=empty-filtered` — Standardized empty-state drawings.

### AI Operations (DeepSeek Simulation):
- `previewAiOperation=triage` | `previewAiOperation=postmortem`
- `previewAiState=pending` — Pulsing analytical technical console.
- `previewAiState=unavailable` — Graceful fallback, code details, and direct manually enabled control triggers.
- `previewAiState=timeout` | `previewAiState=rate-limited` — Detailed retry notifications.

---

## 05 / Required Backend Domains (Entities)
The following relational or document schemas must be established in Phase 2:

1. **User**
   - *Fields:* id, email, passwordHash, displayName, avatarUrl, timezone, defaultOrgId, createdAt.
   - *Dependent UI surfaces:* Active commander badge, operator dropdown, preferences panel.
2. **Organization**
   - *Fields:* id, name, slug (e.g., `northstar-commerce`), status, createdAt.
   - *Dependent UI surfaces:* Header breadcrumbs, workspace settings.
3. **Membership**
   - *Fields:* id, userId, organizationId, role (`OPERATOR` | `ADMIN`), verified, joinedAt.
   - *Dependent UI surfaces:* Navigation authorization guards, settings action state.
4. **Service**
   - *Fields:* id, name, status, averageResponseTime, errorRate, activeIncidentId, createdAt.
   - *Dependent UI surfaces:* Services Directory `/app/services`, Incident room impact rail.
5. **Incident**
   - *Fields:* id, incidentId (e.g., `SF-2026-0042`), organizationId, title, status, severity, recommendedSeverity, reportsCount, signalStrength, commanderUserId, reportedAt, resolvedAt.
   - *Dependent UI surfaces:* Incidents directory, Dashboard metrics, Command room.
6. **IncidentTask**
   - *Fields:* id, incidentId, text, completed, blocked, assigneeUserId, createdAt, completedAt.
   - *Dependent UI surfaces:* Command room Section 03 (Response Tasks).
7. **IncidentUpdate (Timeline/Audit Log)**
   - *Fields:* id, incidentId, timestamp, type (`SYSTEM` | `OPERATOR` | `AI`), title, description, authorUserId, isAuditLogOnly.
   - *Dependent UI surfaces:* Section 04 (Timeline log).
8. **Postmortem**
   - *Fields:* id, incidentId, status (`DRAFT` | `APPROVED`), draftContent (JSON), createdByUserId, approvedAt, approvedByUserId.
   - *Dependent UI surfaces:* Reconstruction workspace, Postmortem PDF exporter.
9. **AiRun**
   - *Fields:* id, type (`TRIAGE` | `POSTMORTEM`), status (`PENDING` | `COMPLETED` | `FAILED`), inputContent, outputContent, errorCode, requestedAt.
   - *Dependent UI surfaces:* AI command centers.
10. **Notification**
    - *Fields:* id, userId, title, message, read, createdAt.
11. **AuditLog**
    - *Fields:* id, organizationId, userId, action, ipAddress, timestamp.

---

## 06 / Required Backend Privileged Functions
Each operation must enforce specific server-side validation, authority rules, and timeline triggers:

| Function | Authority Required | Expected Validation | Timeline Event Created | Concurrency / Idempotency |
| :--- | :--- | :--- | :--- | :--- |
| **Create Incident** | `OPERATOR` | Title length $\ge 10$, active services must exist | Yes (System reported) | Idempotent on token |
| **Change Status** | `OPERATOR` | Transition order matches rules (no skipping steps) | Yes (Operator state change) | Concurrent write protection |
| **Change Severity** | `ADMIN` or `COMMANDER` | Valid severity enum value | Yes (Severity updated) | - |
| **Assign Commander** | `OPERATOR` | Target user must be a verified organization member | Yes (Commander assigned) | Prevent double assignment via transaction |
| **Create Task** | `OPERATOR` | Task text not empty | Yes (Task added) | - |
| **Claim Task** | `OPERATOR` | Task must be unassigned | No (Task list update) | **Strict optimistic locking** to prevent double claims |
| **Complete Task** | `ASSIGNEE` or `COMMANDER` | Task must not be blocked | Yes (Task complete) | - |
| **Add Timeline Update** | `OPERATOR` | Message body not empty | Yes (Appended) | Append-only sequence |
| **Resolve Incident** | `COMMANDER` | All Sev0/Sev1 tasks must be completed or documented | Yes (Resolved) | Update resolvedAt timestamp |
| **Generate Postmortem** | `OPERATOR` | Incident status must be `RESOLVED` | No | - |
| **Approve Postmortem** | `ADMIN` | Content must meet review requirements | Yes (Approved) | - |
| **Seed / Reset Demo** | `ADMIN` (internal) | Restricted to development environments | No (Clean sweep) | - |

---

## 07 / Backend Integration Boundaries
- **Base44 Enforcements:** Auth tokens, user authentication, tenant and database isolation, role and permission mapping.
- **DeepSeek Boundaries:** Secure API proxy routing to hide private credentials. Model outputs remain in an append-only drafts state until approved by an operator. DeepSeek must never run raw SQL or modify databases directly.
- **Realtime Integration:** Operational dashboard and active incident room should receive SSE or WebSockets for live timeline events and task actions.

---

## 08 / Recommended Backend Implementation Order
The following sequence guarantees a stable incremental build with minimized regression risks:

1. **01 / Base44 Project and SDK Setup:** Bootstrap the backend service.
2. **02 / Authentication and Session Restore:** Expose `/api/auth` login/register routes.
3. **03 / Organization and Membership:** Establish organizations and set up authorization middleware.
4. **04 / Service and Incident Read Repositories:** Integrate GET endpoints for services and incident records.
5. **05 / Demo Seed Data:** Enable a secure endpoint to initialize the standard demo state.
6. **06 / Incident Creation:** Build the incident triage creation API.
7. **07 / Incident Room Authoritative Reads:** Serve live incident room sections securely.
8. **08 / Incident Notes and Timeline:** Expose append-only update endpoints.
9. **09 / Task Creation and Concurrency-Safe Claiming:** Build active task list APIs with optimistic lock verification.
10. **10 / Status, Severity, and Commander Functions:** Implement privileged state functions.
11. **11 / Resolution Workflow:** Enforce validation rules for incident resolution.
12. **12 / Realtime Subscriptions:** Deploy SSE or WebSockets.
13. **13 / DeepSeek Triage Function:** Build secure proxies to send incident logs to DeepSeek.
14. **14 / Postmortem Generation and Versioning:** Integrate draft, approval, and version planning states.
15. **15 / Error Handling and Observability:** Roll out telemetry logs and API error boundary handling.
16. **16 / Final E2E and Deployment:** Conduct final regression runs and deploy to production containers.

## 09 / Major Phase 03 — Organization, Membership, and Tenant Context

Phase 03 is implemented and hosted-runtime verified on `backend/base44-phase-03-org-membership`.

- Organization, Membership, and the supported built-in User extension live in `base44/entities/`. Direct Organization and Membership client CRUD is deny-by-default; `User.role` is never used as SignalFold authority.
- Server-authoritative onboarding and context operations are in `base44/functions/complete-organization-onboarding`, `resolve-organization-context`, `select-active-organization`, and `list-organization-members`.
- The framework-neutral organization domain, gateway, provider, route guards, and capability presentation model live under `src/features/organization/`.
- Authentication remains identity-only. SignalFold role is read only from an active Membership; Base44 `User.role` is not used.
- Mock mode retains the approved Northstar demo organization and canonical records. Base44 mode is separated from mock incident/service data and requires an active organization context.
- Onboarding creates an Organization and creator Admin Membership only through the server workflow, with safe retry/reconciliation behavior. No Service, Incident, invitation, or demo seed resources are included.
- Team and Settings integration remains read-only at this boundary. Full invitation, role mutation, services, incidents, and dashboard backend work remain later phases.
- Organization, Membership, the User extension, and the four targeted organization functions were deployed without a full Base44 deployment. The site-only deployment passed hosted verification for onboarding, active Admin Membership restoration, AppShell identity, Team, Settings, real-data empty boundaries, logout/session behavior, responsive presentation, and mock-data isolation.
- The final automated baseline is 38 test files and 300 tests, passing twice consecutively. Shared test teardown now clears rendered DOM, timers, and spies after every test to prevent cross-test timing leakage without increasing test timeouts.
- Phase 04 remains responsible for Services, Dashboard metrics, Incidents, tasks, timeline, demo seed data, realtime, AI, and Postmortem backend resources.

## 10 / Major Phase 04 — Operational Data Foundation (pre-deployment)

The Phase 04 branch adds the tenant-scoped operational data boundary for
Services, Incidents, and append-only IncidentUpdate activity. The local entity
manifest intentionally retains User, Organization, and Membership and adds
only Service, Incident, and IncidentUpdate; Task, Postmortem, AI, notification,
audit, and realtime resources remain out of scope.

Typed operational gateways live under `src/features/operations/` and keep
components independent of Base44. Base44 mode uses server-authoritative
functions for service reads/writes, incident creation and reads, dashboard
overview, and demo seed/reset. Mock mode remains unchanged and makes no hosted
operational request. Query keys are scoped by data mode and organization ID so
workspace changes cannot display stale tenant data.

All new entities deny direct client CRUD. Backend functions authenticate the
current user, require an active Membership in the requested organization, and
return sanitized DTOs. Incident creation derives the reporter, organization,
code, status, severity baseline, and timestamps server-side, then appends an
`incident_created` update. Demo seed/reset uses exact confirmations and only
touches records marked `is_demo` in the authorized demo organization.

The Base44 frontend boundaries are implemented for the Dashboard, Services,
Incident List, New Incident, and read-only Incident Room. Task workflows,
timeline mutations, status/severity/commander changes, resolution, AI,
realtime, notifications, public status, and postmortems remain deferred.

Resource and hosted runtime deployment are intentionally pending the approved
Phase 04 deployment gate. Pre-deployment verification currently passes with
42 test files and 322 tests; TypeScript, lint, and production build pass.

## 11 / Major Phase 04 — Operational Data Foundation

Phase 04 is implemented and hosted-runtime verified on
`backend/base44-phase-04-incidents-dashboard`.

- **Entity deployment:** `Service`, `Incident`, and `IncidentUpdate` were
  added while preserving `User`, `Organization`, and `Membership`.
- **Function deployment:** `create-service`, `update-service`, `list-services`,
  `create-incident`, `list-incidents`, `get-incident`,
  `get-dashboard-overview`, `seed-demo-data`, and `reset-demo-data` were
  deployed with targeted function deployment only.
- **Dashboard read behavior:** `get-dashboard-overview` is read-only. It
  queries existing incidents, services, and incident updates, then deduplicates
  the projected activity stream in memory. It does not repair records or write
  back fallback activity.
- **Incident creation idempotency:** `create-incident` creates one
  `incident_created` update for a new incident and returns an existing incident
  on retry without appending another update.
- **Activity deduplication:** Legacy duplicate `incident_created` records are
  collapsed in the dashboard read model by stable canonical identity so the UI
  shows one creation activity per incident.
- **Hosted runtime verification:** Real dashboard refreshes no longer create
  IncidentUpdate records. Services creation/persistence, incident creation,
  server-generated incident codes, dashboard updates, incident list updates,
  and the honest open-tasks unavailable state were verified on the deployed
  site.
- **Deferred work:** Incident tasks, full timeline mutation, status/severity
  mutation, commander assignment, resolution workflow, AI, realtime,
  notifications, public status, and postmortems remain out of scope.
- **Deployment status:** Backend resources were deployed with targeted
  function deployment only. No full Base44 deployment occurred.

## 12 / Major Phase 05 — Test Runner Baseline Note

Phase 05 retains full canonical test coverage and serializes Vitest execution
with the accepted command:

```
npx vitest run --maxWorkers=1
```

Package scripts:

- `npm test` → `vitest --maxWorkers=1` (watch-capable serial runner)
- `npm run test:run` → `vitest run` (single-pass; prefer explicit
  `--maxWorkers=1` for accepted full-suite verification)

The original merged-main script was plain `vitest`. During the Phase 05
prerequisite audit, the default multi-worker pool and a two-worker run produced
worker-startup timeouts and legacy heavy UI timeouts, while the same files
passed individually and the full suite passed with one worker. This is a local
test-runner resource constraint, not a production runtime difference and not a
claim that application code is unsafe under concurrency.

## 13 / Major Phase 05 — Tasks, Timeline, and Coordination (COMPLETE)

**Status:** COMPLETE — hosted visual freeze, interactive-affordance gate, and
all applicable hosted runtime checks accepted by the product owner.

**Branch:** `backend/base44-phase-05-tasks-timeline`
**Phase 04 merge base:** `c60f1a3` (Merge pull request #4 —
`backend/base44-phase-04-incidents-dashboard`)

### Entity manifest

Approved local entity set (exactly seven resources):

1. `User`
2. `Organization`
3. `Membership`
4. `Service`
5. `Incident`
6. `IncidentUpdate`
7. `IncidentTask` (Phase 05 addition)

Not present and not introduced:

- `Postmortem`
- `AiRun`
- `Notification`
- `AuditLog`
- realtime subscription resources
- DeepSeek provider resources

### IncidentTask schema

Path: `base44/entities/incident-task.jsonc`

- Tenant scope: required `organization_id`, `incident_id`
- Content: `title`, optional `description`
- Canonical `priority`: `critical` | `high` | `medium` | `low`
- Canonical `status`: `todo` | `in_progress` | `blocked` | `done` | `cancelled`
- Optional assignee: `assignee_user_id` (validated server-side to active same-org
  Membership)
- Server-owned: `source`, `order_index`, `claimed_at`, `completed_at`,
  `created_by_user_id`, timestamps
- Optional: `due_at`, `blocking_reason`, `completion_note`, `ai_run_id`,
  `is_demo`, idempotency `request_id`
- Direct client RLS: create/read/update/delete all denied (`rls` false)

### IncidentUpdate compatibility mapping

- Physical deployed field remains `event_type` (not renamed)
- Domain projections expose canonical timeline `type` / `eventType`
- Phase 05 extends the `event_type` enum for coordination events while
  preserving existing incident lifecycle values
- Coordination event types include: `task_created`, `task_claimed`,
  `task_unclaimed`, `task_assigned`, `task_reassigned`, `task_blocked`,
  `task_unblocked` / resume representation, `task_completed`,
  `task_cancelled`, `internal_note_added`
- Timeline UI shows safe actor, timestamp, visibility, and message only —
  no raw metadata JSON and no raw internal record IDs

### Task transition and action contract

Domain: `src/features/tasks/domain/taskTypes.ts`
Visibility helper: `getTaskActionVisibility(task, role, currentUserId)`

| Status | Typical actions (when role-authorized) |
|---|---|
| `todo` unassigned | CLAIM; managers may assign / block |
| `todo` assigned | managers may reassign / block; no COMPLETE |
| `in_progress` | UNCLAIM (owner/manager), MARK BLOCKED, COMPLETE |
| `blocked` | RESUME (owner/manager); no COMPLETE |
| `done` / `cancelled` | terminal — no mutation actions |

Additional rules:

- COMPLETE only on `in_progress` for authorized owner or manager
- Critical confirmation required only when priority is `critical` and COMPLETE
  is otherwise allowed
- HIGH / MEDIUM / LOW never show critical confirmation
- Reporter task presentation remains read-only for task mutations
- Backend remains authoritative; UI waits for server confirmation

### Role and capability contract

SignalFold authority remains on **Membership.role**, never Base44 `User.role`.

| Capability (representative) | Roles |
|---|---|
| Create task | responder, incident_manager, admin |
| Claim / unclaim own / progress own | responder, incident_manager, admin |
| Assign / reassign / cancel / broader metadata | incident_manager, admin |
| Add internal note | reporter, responder, incident_manager, admin |
| Manage services / org settings | prior Phase 03–04 capabilities unchanged |

Assignee validation requires an **active same-organization Membership**.
Inactive and cross-organization users are rejected (`ASSIGNEE_NOT_ACTIVE`).

### Task function inventory

| Function | Purpose |
|---|---|
| `list-incident-tasks` | Tenant-scoped task list + summary |
| `create-incident-task` | Create task; append `task_created` |
| `claim-task` | Conditional claim to `in_progress` |
| `unclaim-task` | Return to unassigned `todo` |
| `assign-incident-task` | Manager assign/reassign |
| `update-incident-task` | Block / resume / complete / cancel path |

Shared helpers: `base44/functions/_shared/task-workflow.ts`,
`base44/functions/_shared/coordination.ts`.

### Timeline and Internal Note function inventory

| Function | Purpose |
|---|---|
| `list-incident-timeline` | Ordered internal timeline read (zero-write) |
| `add-incident-note` | Append `internal_note_added` (INTERNAL visibility) |

Existing read/mutation companions updated for tasks:

- `get-incident` — includes tasks, timeline, assignment options, capabilities
- `get-dashboard-overview` — open tasks, team load, needs attention, activity
- `seed-demo-data` — reconciles canonical system demo tasks + bounded events
- `reset-demo-data` — demo-only isolation including IncidentTask
- `create-incident` — preserved; no task fake data leakage into live mode

### Claim concurrency mechanism

`claim-task` uses Base44 service-role **conditional `updateMany`** matching:

- task `id`
- `organization_id`
- `incident_id`
- `status = todo`
- empty / unassigned `assignee_user_id`

Exactly one concurrent winner updates the row to `in_progress` with
server-owned `claimed_at` and assignee. Losers receive
`TASK_ALREADY_CLAIMED` and append **no** timeline event.

### Idempotency behavior

- Client `requestId` is normalized and stored where applicable
- Mutation helpers reuse an existing `IncidentUpdate` for the same
  organization/incident/`request_id`/`event_type` instead of double-appending
- Legitimate separate claim cycles (claim → unclaim → claim) produce distinct
  `task_claimed` events and are not incorrectly collapsed
- Create-task and note paths follow the same request-id safety pattern

### Read-path zero-write guarantee

The following perform **zero writes** on read:

- `list-incident-tasks`
- `list-incident-timeline`
- `get-incident` (read projection only)
- `get-dashboard-overview`

Reads may normalize/project in memory and deduplicate true logical duplicates
for display. They do **not** repair persistence, reconcile missing events into
storage, or create timeline/task records.

Hosted product-owner verification confirmed five-refresh zero-write behavior
for Incident Room Timeline, Internal Notes, and Dashboard.

### Query keys and invalidation

Frontend query key modules:

- `src/features/tasks/queryKeys.ts`
- `src/features/timeline/queryKeys.ts`
- existing `src/features/operations/queryKeys.ts`

Successful mutations invalidate operational / task / timeline query scopes so
Dashboard, Incident Room, and Team load refresh from authoritative reads.
No optimistic fake completion is applied for claim, unclaim, block, resume,
or complete.

### Incident Room Tasks integration

Live Base44 surface: `LiveIncidentRoom` in
`src/features/operations/OperationalViews.tsx`

- Tasks panel behind TIMELINE / TASKS / DETAILS tab shell
- CREATE TASK collapsed opener; form submit is primary action
- REFRESH is compact neutral outlined control
- CLAIM / UNCLAIM / MARK BLOCKED / RESUME / COMPLETE use shared operational
  action affordances
- Assignment uses native select form control (not button chrome)
- Role-based action visibility via `getTaskActionVisibility`
- Mock mode continues to render the frozen frontend Incident Room preview

### Incident Room Timeline integration

- Default order: Latest First (`desc`)
- Oldest First supported via native select
- ADD INTERNAL NOTE collapsed opener; submit primary
- Events display safe message, type label, timestamp, visibility/actor type
- Distinct task lifecycle events remain separate after repeated reads

### Dashboard Task metrics

- OPEN TASKS = authoritative count of TODO + IN_PROGRESS + BLOCKED
- DONE and CANCELLED excluded from open load
- Needs Attention uses deterministic blocked / overdue / unassigned-critical /
  active severe-incident rules
- Team Load aggregates open workload per active member
- Recent Activity includes bounded task and note events without duplicates
- Dashboard reads invoke no mutation functions

### Team Task load

Live Team boundary (`OrganizationReadBoundaries`) shows organization-scoped
open / in-progress / blocked load for active members only. No Team mutation
controls. No cross-tenant members or tasks.

### Demo Task seed / reseed / reset

- Existing demo workspace is reused (no new fake users)
- Canonical Phase 05 demo tasks seed with `source = system` (not AI)
- Re-seed reconciles without duplicating tasks or timeline events
- Reset requires exact confirmation phrase
- Reset affects only demo Service / Incident / IncidentUpdate / IncidentTask
  data for the authorized demo organization
- User, Organization, Membership, and real workspace tasks remain untouched
- Repeated reset remains safe

### Visual-freeze restoration

Product-owner hosted visual retest accepted:

- Phase 04 visual identity preserved
- Incident Room TIMELINE / TASKS / DETAILS with single visible panel
- Details remains dedicated read-only surface
- Create Task and Internal Note remain collapsed behind openers
- Dashboard, Team, AppShell, Landing, Auth, Onboarding, Services, Incident
  List, New Incident, Settings, brand, typography, spacing preserved

### Application-wide affordance correction

Shared operational affordance tokens:
`src/components/ui/operationalActions.ts`

- Primary solid lime, secondary outlined lime, neutral outlined, warning
  outline, form controls, tab active/inactive, interactive nav rows
- CREATE TASK, REFRESH, CLAIM, UNCLAIM, MARK BLOCKED, COMPLETE, ADD INTERNAL
  NOTE, tabs, selects, Sign Out, Services ADD SERVICE corrected
- Static metrics, READ ONLY labels, and metadata remain non-interactive
- Design-system `Button` / `IconButton` include honest cursor treatment

### Hosted runtime results (product owner)

All applicable hosted runtime checks PASSED, including:

- Task create / claim / unclaim / reclaim cycles with exact event counts
- Block without reason rejected; block with reason accepted once
- Resume once; normal HIGH completion once; critical confirmation gate
- One internal note; timeline ordering; dashboard and team load
- Demo seed / reseed idempotency / reset isolation
- Responsive Incident Room at 430px / 390px / 360px
- Out-of-scope network audit: no DeepSeek, realtime, AiRun, postmortem
  backend, or incident status/severity/commander/resolution mutations

### Hosted second-user assignment and claim concurrency

| Check | Hosted result |
|---|---|
| Multi-member assignment / reassignment | **NOT AVAILABLE** (no second real active same-organization member was used for hosted verification; no fabricated users) |
| Two-user concurrent claim | **NOT AVAILABLE** (same constraint) |

Automated coverage remains the verified implementation evidence for concurrent
claim conflict handling (`TASK_ALREADY_CLAIMED`, single winner, zero loser
events) and for authorization / active-membership / tenant-isolation paths.

### Automated concurrency verification

Automated claim concurrency and task-contract tests PASS under the serial
Vitest configuration (see Phase 05 test inventory). Implementation evidence is
retained even when hosted two-user exercise is NOT AVAILABLE.

### Tenant isolation and direct write denial

- Frontend never mutates `IncidentTask` or `IncidentUpdate` entities directly
- All task/timeline writes go through deployed functions
- `organization_id` and `incident_id` are server-validated against membership
- Client cannot set source, actor, status transitions, order index, or server
  timestamps
- Claim is server-authoritative
- Critical completion confirmation is enforced server-side
- Demo reset isolates demo data only

### Deployment posture for Phase 05

- Targeted entity/function deployment for Phase 05 coordination resources was
  performed as part of the Phase 05 workstream (not a full Base44 deploy)
- Frontend site-only deploys used for visual/affordance gates
- No full Base44 deployment
- No auth configuration push during Phase 05 finalization
- No Phase 06 backend added

### Deferred after Phase 05 (completed in Phase 06 where listed)

Phase 06 implements status/severity/commander/resolve/close authority.
Still deferred beyond Phase 06:

- Reopening resolved Incidents
- Public status updates
- Realtime subscriptions
- DeepSeek / AiRun
- Notifications and AuditLog
- Postmortem backend
- Team membership mutation admin workflows

### Known non-blocking advisories

- Existing React Router future-flag / advisory messages (if present in dev)
  remain environmental and do not block Phase 05
- Vite production build may emit the existing large-chunk size warning for the
  main bundle; accepted non-blocking advisory, not a Phase 05 functional defect

### Major Phase 05 completion statement

Major Phase 05 (Tasks, Timeline, and Coordination) is complete and accepted.
Merged to main as `f697d5d` (includes original commit `f9b268d`).

## 14 / Major Phase 06 — Incident Authority, Controlled State Transitions & Resolution

**Status:** COMPLETE on
`backend/base44-phase-06-incident-authority-resolution` — implemented, deployed,
and product-owner hosted runtime verified.

**Branch:** `backend/base44-phase-06-incident-authority-resolution`
**Main baseline:** `f697d5d` (Phase 05 merge)
**Phase 05 ancestry:** `f9b268d` is an ancestor of `origin/main`.

### Entity manifest

Unchanged seven-entity set:

1. User
2. Organization
3. Membership
4. Service
5. Incident (schema extended)
6. IncidentUpdate (event enum extended)
7. IncidentTask

No Postmortem, AiRun, Notification, or AuditLog entity.

### Incident schema extensions

Path: `base44/entities/incident.jsonc`

Added when missing:

- `root_cause_known`: `yes` | `no` | `unknown`
- `resolution_override_reason`: bounded string for critical-task override

Preserved: status machine values, severity, commander, timestamps
(`acknowledged_at`, `resolved_at`, `closed_at`), resolution_summary,
recovery_verified, remaining_risk, demo markers, AI compatibility fields.

Direct client RLS remains denied for create/read/update/delete.

### IncidentUpdate compatibility

Physical field remains `event_type`.

Authority events (physical names):

- `status_changed`
- `severity_changed`
- `commander_assigned`
- `commander_reassigned`
- `commander_unassigned`
- `incident_resolved`
- `incident_closed`

Phase 04/05 task and note events remain valid. Timeline remains append-only;
reads perform zero writes.

### State machine

Domain: `src/features/incidents/domain/incidentStateMachine.ts`

Statuses: reported, triaging, investigating, identified, monitoring, resolved, closed.

Non-resolution transitions enforced server-side in `change-incident-state`.
`resolved` is never entered via generic state change — only via `resolve-incident`.
`resolved -> investigating` (reopen) is excluded.

### Role contract (MVP)

- Reporter / Responder: read authority state; existing note/task rights unchanged; no Incident status/severity/commander/resolve/close mutations.
- Incident Manager / Admin: status (allowed transitions), severity (reason required), commander assign/reassign/unassign, resolve, close resolved.
- Unknown role: deny privileged mutations.
- Base44 `User.role` never grants SignalFold authority.

### Backend functions

| Function | Purpose |
|---|---|
| `change-incident-state` | Conditional status transitions + close resolved |
| `change-incident-severity` | Conditional severity change; `severity_source=human` |
| `assign-incident-commander` | Assign/reassign/unassign eligible commanders |
| `resolve-incident` | Resolve with recovery, root cause, risk, critical override |

Helpers follow Phase 05 function-local copy pattern:

- `coordination.ts`
- `incident-authority.ts`

Shared source of truth also kept under `base44/functions/_shared/`.

### Concurrency and idempotency

- Status: `updateMany` match on `id` + `organization_id` + `status=expectedStatus`
- Severity: match on severity expected value
- Commander: match on current commander precondition
- Resolve: match on expectedStatus
- Losing concurrent callers receive conflict codes and append no event
- `requestId` reuses prior logical event and returns reconciled DTO

### Timestamp rules

- First exit from `reported` sets `acknowledged_at` once
- Resolve sets `resolved_at`; preserves `acknowledged_at`
- Close from `resolved` sets `closed_at`; preserves `resolved_at`
- Client cannot set authority timestamps

### Open critical-task guard

Server counts tasks with `priority=critical` and status in
`todo|in_progress|blocked`. Default reject with `OPEN_CRITICAL_TASKS`.
Override requires `overrideOpenCriticalTasks=true` + bounded reason.

### Optional service recovery

When `restoreServiceOperational=true` and affected service is non-operational
and same-org: set service `operational_status=operational` after successful
resolution. Not claimed atomic multi-entity transaction.

### Frontend integration

- Gateway: `changeIncidentState`, `changeIncidentSeverity`,
  `assignIncidentCommander`, `resolveIncident`
- Live Incident Room compact authority strip + collapsed forms
- Uses Phase 05 operational action affordances
- Tabs/shell preserved; Details shows resolution read-only block when resolved/closed
- Mock mode does not call Base44 authority mutations

### Read model

`get-incident` returns zero-write authority presentation:

- allowedTransitions
- authority capability flags
- commanderOptions (active IM/Admin only)
- openCriticalTaskCount

### Tests

Phase 06 automated coverage:

- `src/test/phase06IncidentAuthority.test.ts`
- `src/test/phase06IncidentAuthorityUi.test.tsx`

Serial Vitest: `npx vitest run --maxWorkers=1`.

### Explicitly out of scope (confirmed)

Reopen, DeepSeek, AI triage/AiRun, realtime, postmortem backend, public status,
notifications, AuditLog, team invite/role mutation, external connectors.

### Hosted deployment and runtime

Targeted entity + function deployment and product-owner hosted verification were
completed as gates. Multi-member commander assignment remains **NOT AVAILABLE**
when no second real active IM/Admin member exists (no fabricated users).

### Commander null/absent CAS bug and correction

The original `assign-incident-commander` used an empty-string sentinel for the
unassigned commander precondition while the persisted field was `null`/absent,
causing `COMMANDER_CONFLICT` (HTTP 409) on first assignment. Corrected to use
`null` CAS values (`currentCommander ?? null`, `nextCommander ?? null`) and the
function was redeployed. Hosted verification: first assignment HTTP 200,
persistence after refresh PASSED, exactly one `commander_assigned` timeline
event across five refreshes.

### Final Dashboard / Incident List propagation correction

Earlier Phase 06 deployment intentionally did not redeploy `list-incidents` and
`get-dashboard-overview` because they were believed to require no packaging
changes. Hosted evidence showed the live Incident List / Dashboard did not
expose the full Phase 06 authority state.

Root cause (verified by pulling deployed functions): the deployed versions of
both read-model functions contained the **Phase 04/05 `safeIncident`
projection**, which omitted authority fields:

- `get-dashboard-overview` deployed `safeIncident` dropped `commander_user_id`,
  `resolved_at`, `closed_at`, `acknowledged_at`, `impact_summary`,
  `observed_start_at`, resolution fields, `created_date`, `updated_date`.
- `list-incidents` deployed `safeIncident` dropped `resolution_summary`,
  `root_cause_known`, `remaining_risk`, `resolution_override_reason`.

The Phase 06 working tree already carried the corrected full projection in
`base44/functions/_shared/operations.ts`,
`base44/functions/list-incidents/operations.ts`, and
`base44/functions/get-dashboard-overview/operations.ts`, but those functions
were never redeployed. The frontend gateway (`projectIncident`) already mapped
every authority field, the Incident List already read `status` / `severity`
query parameters and passed them to the backend, and query invalidation already
covered the `['operations', mode, org.id]` scope — no frontend change was
required.

Correction: targeted redeployment of `list-incidents` and
`get-dashboard-overview` with the Phase 06 projections. No entity, auth, or
mutation-function changes.

### Final hosted runtime verification (post redeployment)

| Check | Result |
|---|---|
| Incident List final status in DTO | PASSED — closed incident present |
| Incident List severity in DTO | PASSED — SEV3 present per row |
| Incident List commander projection | PASSED — `commander_user_id` in DTO; never rendered raw |
| Status filter `?status=closed` | PASSED — only closed rows returned |
| Severity filter `?severity=SEV3` | PASSED — only SEV3 rows returned |
| Commander filter | **NOT AVAILABLE** — not present in approved live surface |
| Page refresh preserves state | PASSED |
| Dashboard active metrics | PASSED — ACTIVE 1, SEV1/SEV2 0, RESOLVED THIS WEEK 1, OPEN TASKS 0 |
| Dashboard Needs Attention | PASSED |
| Dashboard Recent Activity | PASSED — authority events bounded, no duplication |
| Dashboard five-refresh stability | PASSED — zero authority-mutation writes |
| Screenshots | `30-incident-list-final-propagation.png`, `31-dashboard-final-propagation.png`, `32-incident-list-status-filter.png`, `33-incident-list-severity-filter.png` |

### Open critical-task resolution guard disposition

HOSTED OPEN-CRITICAL RESOLUTION GUARD:
NOT AVAILABLE — AUTOMATED SERVER CONTRACT COVERAGE PASSED

No safe existing open CRITICAL Task was available on the verified incident, and
creating another runtime Task would add unnecessary hosted data. Automated
coverage verifies the full server contract: todo / in_progress / blocked
critical tasks block resolution, done / cancelled do not, override flag and
override reason are required, the server calculates the count, a rejected
attempt appends no resolution event, and a successful override appends exactly
one `incident_resolved` event.

### Zero-write read confirmation

- Timeline five-refresh zero-write: PASSED
- Dashboard five-refresh zero-write: PASSED (authority reads append no events)
- `list-incidents`, `get-dashboard-overview`, `get-incident` remain read-only

### Explicitly out of scope (confirmed final)

Reopen, DeepSeek, AI triage/AiRun, realtime, postmortem backend, public status,
notifications, AuditLog, team invite/role mutation, external connectors.

### Remaining advisories

- Vite production build large-chunk warning for the main bundle remains an
  accepted non-blocking advisory.
- React Router future-flag advisory (if present in dev) remains environmental.

### Major Phase 06 completion statement

Major Phase 06 (Incident Authority, Controlled State Transitions & Resolution)
is complete and accepted on
`backend/base44-phase-06-incident-authority-resolution`:

- Commander PASSED (null-CAS corrected, hosted verified)
- Severity PASSED
- Status PASSED
- Resolution PASSED
- Close PASSED
- Persistence PASSED
- Timeline zero-write PASSED
- Dashboard propagation PASSED
- Incident List propagation PASSED
- Responsive PASSED (430 / 390 / 360)
- Network / out-of-scope audit PASSED
- Critical guard explicitly documented NOT AVAILABLE with complete automated
  coverage
- Final baseline: 49 test files / 372 tests, passed twice consecutively under
  the serial Vitest configuration
- TypeScript, lint, and production build PASS

Recommended next step: backend Phase 07 (DeepSeek triage) and human review.

## 15 / Major Phase 07 — DeepSeek Triage & Human Review

**Status:** IMPLEMENTED on
`backend/base44-phase-07-deepseek-triage-human-review` — local automated
verification PASSED, targeted resources deployed. Hosted success-path AI
verification is **PENDING** the product-owner action to configure the
`DEEPSEEK_API_KEY` server-side secret. The AI fallback path was verified hosted.

**Base commit:** `5141fc5` (Phase 06 merge `633e097` verified as ancestor of
`origin/main`).

### Phase 07 architecture

- Server-authoritative `analyze-incident` orchestrates: authorize → load
  Incident + Service → minimize input → build fingerprint → cache check →
  create AiRun(started) → append `ai_analysis_requested` → call DeepSeek
  (non-thinking, JSON mode) → validate → at most one repair → append
  `ai_analysis_completed` → return typed suggestion. It never mutates Incident
  severity/status and never creates tasks.
- Server-authoritative `apply-incident-analysis` applies only explicitly
  human-reviewed values: ai fields, optional severity (Phase 06 rules),
  optional status transition (Phase 06 state machine), selected AI tasks
  (`source=ai`, `ai_run_id`), and marks the AiRun review `applied`.
- `get-incident` exposes a safe `aiSuggestion` read model (analysis + review
  status + model + generatedAt + confidence) from the latest succeeded triage.
- AI is an adviser only: `AI SUGGESTION`, `REVIEW REQUIRED`, human apply.

### AiRun

- Entity `base44/entities/airun.jsonc` (feature/provider/model/prompt_version/
  status/request_fingerprint/token counts/duration/error_code/result_summary/
  requested_by_user_id/timestamps). RLS deny-by-default (no direct frontend
  CRUD). Phase 07 uses only `feature=triage`.
- `result_summary` stores a small bounded snapshot: validated analysis +
  review state + provenance. No API key, no chain of thought, no raw provider
  envelope, no reasoning_content.

### DeepSeek provider boundary

- `base44/functions/_shared/ai-workflow.ts` (copied into each function folder):
  strict validation, bounded output, prompt builder, fingerprint, AiRun
  helpers, and `callDeepSeekTriage` adapter.
- Provider request uses the current official DeepSeek V4 API: `thinking:
  {type:"disabled"}` (thinking is enabled by default and must be explicitly
  disabled), `response_format:{type:"json_object"}`, `stream:false`, bounded
  `max_tokens`, no `tools`. No chain-of-thought is requested or retained.
- Model from `DEEPSEEK_MODEL` (expected `deepseek-v4-flash`); key from
  `DEEPSEEK_API_KEY`; timeout from `DEEPSEEK_TIMEOUT_MS` (default 20000ms);
  base URL from `DEEPSEEK_BASE_URL` (default `https://api.deepseek.com`).
- Environment variable NAMES only are documented; values are never printed.

### Environment configuration

- Non-secret `DEEPSEEK_MODEL=deepseek-v4-flash` configured through the Base44
  environment/secret mechanism.
- `DEEPSEEK_API_KEY` must be configured server-side by the product owner
  through the official Base44 secret mechanism before hosted AI verification.
  The coding executor does not hold or print the key.

### Prompt, injection defence, and bounds

- Prompt version `triage-v1`. System prompt explicitly treats Incident content
  as UNTRUSTED DATA: no instruction-following from Incident text, no tools,
  no infrastructure claims, no hidden reasoning, unknown stays unknown.
- Validation rejects invalid enums, out-of-range confidence, oversized strings,
  oversized arrays, invalid task priorities, unsafe shapes; strips HTML.
- No `dangerouslySetInnerHTML`; no chain-of-thought or full prompt in the UI.

### Caching and regeneration

- `request_fingerprint` derived from server-authoritative incident inputs +
  prompt/model version. Cache hit returns the prior succeeded result without a
  new provider call, without a duplicate AiRun, and without duplicate timeline
  events.
- Regeneration requires `forceRegenerate=true` AND explicit `confirmRegenerate`;
  never automatic.

### Timeline events

- `ai_analysis_requested`, `ai_analysis_completed`, `ai_analysis_failed`
  (IncidentUpdate enum extended). Success = 1 requested + 1 completed; failure
  = 1 requested + 1 failed. Cache hits and repeated reads append nothing.

### Human review and apply

- Suggestion starts `pending`. Human can edit summary, severity suggestion,
  category, impact, risk flags, clarifying questions, recommended tasks,
  immediate next action. Confidence remains model provenance.
- Apply: accepted AI severity with `severity_source=ai_suggested` (human-edited
  severity remains `human`); no fake severity event when unchanged; legal status
  transition only when explicitly selected; selected reviewed tasks created with
  `source=ai`; idempotent by request id; no auto-assignee.

### Known PRD ambiguity (documented, not silently changed)

- The functional prose mentions an "Affected area" proposal, but the canonical
  `IncidentAnalysisResult` contract has no `affectedArea` field. Phase 07
  preserves the canonical TypeScript contract and keeps Service as the
  authoritative affected-service context. No schema/output field was invented.

### Tests

- New: `phase07AiDomain.test.ts`, `phase07AiProvider.test.ts`,
  `phase07AiBackend.test.ts`, `phase07AiAuthority.test.ts`,
  `phase07AiUi.test.tsx`.
- Coverage includes domain validation, provider success/failure/repair,
  prompt injection defence, fingerprint/cache, timeline event counts, human
  review invariants, tenant isolation, and frontend behavior (analyze,
  review, apply, fallback, no direct writes, tabs preserved).
- Final baseline: 54 test files / 460 tests, passed twice consecutively under
  the serial Vitest configuration.

### Hosted runtime verification (all gates PASSED)

- Gate 1 baseline PASSED: Analyze visible for Manager/Admin, no AI call on page
  load, manual controls present.
- AI fallback PASSED (before key configured): clicking Analyze returns the safe
  `AI_NOT_CONFIGURED` fallback; no direct browser DeepSeek request; incident
  workflow unaffected.
- Gate 2 PASSED: real hosted DeepSeek analysis with `DEEPSEEK_API_KEY`
  configured. `analyze-incident` returned HTTP 200 with a structured AI
  SUGGESTION (summary, suggested severity, category, impact, confidence, risk
  flags, clarifying questions, recommended tasks, immediate next action, model
  `deepseek-v4-flash`, generated timestamp, REVIEW PENDING). Browser never
  called `api.deepseek.com` directly.
- Gate 3 PASSED: suggestion survives refresh with REVIEW PENDING; severity and
  status unchanged by analysis; zero AI tasks silently inserted; manual
  authority controls intact.
- Gate 4 PASSED: exactly 1 × AI ANALYSIS REQUESTED, 1 × AI ANALYSIS COMPLETED,
  0 × AI ANALYSIS FAILED; five-refresh counts stable (zero-write).
- Gate 5 PASSED: REGENERATE requires explicit confirmation; cached successful
  result reused without a second provider call or duplicate AiRun/events.
- Gate 6 PASSED: human review/editor editable for all fields; one of 3 AI
  recommended tasks selected; explicit human severity acceptance with reason;
  legal status transition selected (reported → triaging).
- Gate 7 PASSED: APPLY REVIEWED SUGGESTIONS returned HTTP 200; review status
  APPLIED after refresh; accepted metadata persists (category payments,
  ai_summary, ai_confidence 0.8, ai_risk_flags, ai_analysis_version triage-v1,
  ai_last_analyzed_at); severity SEV2 (severity_source=ai_suggested); status
  triaging. AI itself caused no autonomous transition.
- Gate 8 PASSED: 1 × SEVERITY CHANGED, 1 × STATUS CHANGED, 1 × TASK CREATED,
  1/1/0 AI counts stable; five-refresh zero-write.
- Gate 9 PASSED: selected AI task created exactly once (source=ai), not
  auto-assigned, normal Phase 05 controls available.
- Responsive PASSED at 430 / 390 / 360 (AI surface, no overflow, tabs +
  manual controls usable).
- Screenshots: `screenshot/phase-07/01-ai-baseline.png`, `02-ai-suggestion.png`,
  `03-ai-pending-review-after-refresh.png`, `04-ai-timeline.png`,
  `05-ai-timeline-zero-write.png`, `06-ai-cache-regeneration-guard.png`,
  `07-human-review.png`, `08-human-review-applied.png`,
  `09-human-apply-timeline.png`, `10-ai-reviewed-task.png`,
  `11-mobile-430.png`, `12-mobile-390.png`, `13-mobile-360.png`.
  Network audit: `screenshot/phase-07/network-audit.md`.

### Phase 07 read-model correction (found during hosted Gate 7 verification)

- Root cause: `get-incident` `safeIncident` projection omitted the AI-accepted
  Incident fields (category, ai_summary, ai_confidence, ai_risk_flags,
  ai_analysis_version, ai_last_analyzed_at). The data was persisted by
  `apply-incident-analysis` but not returned to the frontend read model.
- Fix: added the fields to `get-incident/operations.ts` `safeIncident` and the
  shared/local `safeIncidentAuthority` projections. Regression test added.
- Deployed: `get-incident` only.
- Commit: `83c0bc7`.
  `13-mobile-360.png`. Network audit: `screenshot/phase-07/network-audit.md`.

### Deployments

- Entities pushed: AiRun created; IncidentUpdate/Incident/etc. updated.
- Functions deployed (targeted): `analyze-incident`, `apply-incident-analysis`,
  `get-incident`.
- Site-only deployment performed. No full `base44 deploy`, no auth push.

### Explicitly out of scope (confirmed)

Realtime, Postmortem, Notification, AuditLog, public status mutation, reopen,
Slack/Discord/email, vector/embeddings/RAG, web search, autonomous remediation,
agent loops, Phase 08.

### Known non-blocking advisories

- npm audit reports 3 high severity advisories in transitive deps
  (`nanoid <3.3.17`, `react-router` 7.12–7.18.1 CSRF) present since prior
  phases. No breaking upgrade or React Router major migration was performed
  this phase.

## 16 / Major Phase 08 � Realtime Coordination & Multi-Client Synchronization

**Status:** COMPLETE on
`backend/base44-phase-08-realtime-coordination` � implemented, tested (57 files /
487 tests, passed twice consecutively), site-deployed, and hosted-verified on the
authenticated client.

**Base commit:** `9bc5f6d` (Phase 07 merge verified as ancestor of `origin/main`).

### Phase 08 architecture

- Realtime is a transport/coordination layer only; it is never an authority layer.
- A realtime event is an invalidation signal, never authoritative UI state. The UI
  always refetches the authoritative safe projection through existing reads.
- Gateway abstraction: `OperationalGateway.subscribeToIncidentRoom(scope, listener)`
  returning an unsubscribe. `Base44OperationalGateway` implements it; the mock gateway
  returns a safe no-op.
- `useIncidentRealtimeSync` hook in the Incident Room: subscription lifecycle,
  Incident-scoped filtering, 50ms event coalescing, TanStack Query invalidation,
  connection state, offline/reconnect, visibility recovery, and Timeline LIVE marker.

### Base44 SDK realtime contract (verified)

- Installed `@base44/sdk@0.8.41`.
- `entities.<Entity>.subscribe(callback)` is entity-level only, returns `unsubscribe()`;
  event shape `{ type: "create"|"update"|"delete", data, id, timestamp }`.
- NO filtered subscribe API exists; SignalFold subscribes to the three required entities
  only while an Incident Room is active and discards unrelated events in the adapter.
- NO public connection-status API; the SDK exposes a client-wide `cleanup()` (not called
  from room unmount). Browser `online`/`offline` events + subscription setup failures
  drive the connection state.

### Subscriptions and filtering

- Subscribed entities: `Incident`, `IncidentTask`, `IncidentUpdate`.
- Incident events accepted only when `id === activeIncidentId` and
  `organization_id === activeOrganizationId`.
- Task/Timeline events accepted only when `organization_id` AND `incident_id` match.
- Stale-scope callbacks are ignored via a generation token.

### Query invalidation / coalescing

- Relevant events invalidate the active incident read model, task list, and both
  timeline directions. No full page reload, no polling, no arbitrary route reload.
- A 50ms coalescing window batches the multiple events a single backend action may
  produce (Incident + IncidentUpdate + optional Task) into one refetch round.

### Self-echo and server authority

- Self-originated realtime events are expected and harmless; a realtime callback never
  calls a mutation function and never writes domain state.
- All Phase 04-07 mutation paths are unchanged (status, severity, commander, tasks,
  resolution, AI analyze/apply). No direct frontend writes.

### Connection state UX / offline / reconnect / visibility

- Disconnected state shows exactly: "Realtime disconnected � retrying." in an accessible
  polite live region, no flashing, reduced-motion safe.
- True offline emulation verified hosted: banner shown, offline mutation not delivered,
  reconnect clears the banner and refetches authoritative Incident/Tasks/Timeline.
- On `visibilitychange` to visible, a bounded authoritative reconciliation refetches
  the active Incident, Tasks, and Timeline without duplicates.

### Timeline LIVE marker and scroll

- Only a Timeline item received via a realtime IncidentUpdate after subscription is
  active gets a subtle `LIVE` label (no flashing/gradient/neon). Initial page-load
  events are never marked LIVE.
- Realtime refresh does not call scroll APIs or reset the active tab; scroll position
  is preserved (hosted verified: no forced jump).

### Route / incident / organization cleanup

- Subscriptions tear down on Incident Room unmount, route change, incident change,
  organization change, logout, mode switch, and offline.
- The route-cleanup gate verified hosted: after navigating away, the old Incident Room
  makes zero refetches of get-incident/tasks/timeline.
- Shared Base44 client `cleanup()` is not called from room unmount (only entity-level
  unsubscribe handles are used).

### Hosted verification (authenticated client)

- Realtime self-echo verified: internal note and status change appear WITHOUT manual
  refresh via realtime invalidation + authoritative refetch; LIVE marker shown.
- Offline/reconnect PASSED with true network emulation.
- Route cleanup PASSED (zero old-room refetches on Dashboard).
- Passive zero-write PASSED (timeline counts stable); zero DeepSeek on passive realtime.
- Responsive realtime UX PASSED at 430/390/360 (no overflow, tabs + authority controls).
- Latency: internal note ~1984ms, status ~3407ms (self-echo includes full authoritative
  mutation round-trip + realtime refetch).

### Multi-client disposition

- MULTI-CLIENT SAME ACCOUNT hosted cross-observation: NOT AVAILABLE in this automated
  session (only one authenticated profile exists; a second independent profile requires
  manual owner authentication). No fabricated identity used. The full mechanism is
  verified hosted on the authenticated client (self-echo), and the dual-independent-client
  contract is covered by 27 automated realtime tests.
- Screenshots: `screenshot/phase-08/01-client-a-baseline.png`,
  `03-status-realtime.png`, `09-timeline-note-realtime.png`,
  `12-realtime-disconnected.png`, `13-realtime-reconnected.png`,
  `14-mobile-430.png`, `15-mobile-390.png`, `16-mobile-360.png`.
  Evidence: `runtime-evidence.md`, `realtime-latency.md`, `network-audit.md`.

### Deployment

- Entities push: NO (no schema change; 8-entity manifest unchanged).
- Function deploy: NONE (no backend function change).
- Site-only deployment performed.
- Full Base44 deploy: NO. Auth push: NO.

### Out of scope (confirmed)

Postmortem, Notification, AuditLog, public status, realtime Notifications, AI status
drafting, reopen, Team mutations, new integrations, WebRTC/Socket.IO/Firebase/Supabase/
Pusher/Ably, custom websocket server, polling as primary transport, frontend redesign.

### Known non-blocking advisories

- npm audit reports 3 high severity advisories in transitive deps
  (`nanoid <3.3.17`, `react-router` 7.12-7.18.1 CSRF) present since prior phases.
  No breaking upgrade or React Router major migration was performed this phase.
- Full-suite heavy-UI tests intermittently time out at 5s under local memory pressure
  (documented environmental constraint from Phases 05-08); they pass on rerun.

## 16.1 / Phase 08 owner-approved bounded reconciliation fallback (PRD 1.1)

### Hosted Base44 realtime limitation (proven)

During hosted dual-independent-client verification (Phase 08 continuation):

- Two independent persistent Camoufox profiles authenticated as the same account
  (MULTI-CLIENT SAME ACCOUNT; identity aimxyz18 / ORGANIZATION ADMIN).
- Both clients connected to the same safe Incident; baseline state agreed.
- Client A performed a legal status transition; the server mutation succeeded.
- The observing client received ZERO entity realtime frames and performed ZERO
  realtime-triggered authoritative refetches, despite no manual refresh.
- Deep transport diagnostics confirmed the client socket connects to
  wss://base44.app/ws-user-apps/socket.io, authenticates, joins the
  Incident / IncidentTask / IncidentUpdate rooms, and stays alive (heartbeat), but
  Base44 hosted delivered no update_model frames in this environment for mutations
  made through service-role backend functions.
- SignalFold''s realtime implementation follows the documented
  @base44/sdk@0.8.41 subscribe contract exactly; no adapter/hook defect was proven.

### Owner-approved fallback decision

The product owner approved a controlled architecture deviation (PRD 1.1):

- Base44 realtime subscriptions remain the PRIMARY transport and stay mounted.
- A SECONDARY BOUNDED AUTHORITATIVE RECONCILIATION safety net is added for the
  active Incident Room only: while the Room is mounted, authenticated, online, and
  document-visible, the hook performs an authoritative read reconciliation every
  10 seconds.
- The fallback is read-only (query invalidation/refetch only): it never creates or
  mutates Incident/IncidentTask/IncidentUpdate, never calls AI, never reloads the
  page, and never performs direct client writes.
- The fallback stops when hidden, offline, unmounted, on route/incident/organization
  change, logout, or backend-mode switch.
- Fallback-discovered data is never marked LIVE; LIVE remains reserved for a genuine
  Base44 subscription callback.
- No fake connection status; "Realtime disconnected - retrying." remains reserved for
  known browser offline / supported connection setup failure.
- One logical scheduler (not three intervals); no overlapping ticks; one timer after
  React Strict Mode stabilization.

### Implementation

- `src/features/operations/useIncidentRealtimeSync.ts` exports
  `REALTIME_RECONCILIATION_INTERVAL_MS = 10_000` (single source of truth).
- A single `setInterval` scheduler gates on
  `active && organizationId && incidentId && online && visible && !mock && authenticated`,
  reconciles the active Incident read model, active Tasks, and active Timeline (both
  directions) through existing TanStack Query invalidation.
- Realtime events still win: a subscription callback triggers the existing immediate
  coalesced refetch and does not wait for the fallback tick.

### Verification

- Automated: new `src/test/phase08ReconciliationFallback.test.tsx` (15 tests) covers
  scheduler start gating, one-tick Incident/Tasks/Timeline reconciliation, no
  mutation/DeepSeek/reload/write, LIVE truthfulness (fallback does not set LIVE,
  realtime callback does), visibility pause/resume, offline pause/immediate
  reconnect, incident-switch timer cleanup, unmount cleanup, realtime+fallback
  coexistence, request bounds over 60s, and React Strict Mode single-timer behavior.
- Expected degraded propagation bound: normally <= approximately 12 seconds
  (10-second scheduler plus request/render time). This is NOT realtime latency.
- Hosted fallback gates F1-F8 results are recorded in
  `screenshot/phase-08/runtime-evidence.md`.

### PRD / docs

- PRD_SignalFold.md updated to version 1.1 with a revision history entry dated
  12 Aug 2026 and a minimal 18.2.1 degraded-realtime-fallback subsection.
- No schema changes; no backend function changes; no entity/function deployment.

## 17 / Phase 09 Postmortem & Human Approval (PRD 1.1)

### Entity

- New 9th entity `Postmortem` (`base44/entities/postmortem.jsonc`): tenant
  `organization_id`, unique `incident_id` parent, `status` enum
  `draft|in_review|approved|published`, all PRD document sections, structured
  `timeline_summary` and `preventive_actions`, `generated_by_ai`, `ai_run_id`,
  `version` (starts 1), server-managed `approved_by_user_id` / `approved_at` /
  `published_at`. RLS denies all direct client writes.
- Final entity manifest is exactly 9: User, Organization, Membership, Service,
  Incident, IncidentUpdate, IncidentTask, AiRun, Postmortem. No Notification,
  no AuditLog, no PostmortemVersion, no ReviewComment, no Publication, no
  FollowUpTask.
- `AiRun.result_summary` extended with a bounded `postmortem` provenance snapshot.
- `IncidentUpdate.event_type` extended with `postmortem_generated` and
  `postmortem_approved`; frontend `INCIDENT_UPDATE_EVENTS` updated to match.

### State machine

- `draft -> in_review -> approved`; `in_review -> draft` (return to draft) is the
  explicit human correction path. `published` remains a valid canonical terminal
  state but the public publishing workflow is OUT OF PHASE 09.
- Server enforces transitions; invalid transitions return
  `POSTMORTEM_INVALID_STATE_TRANSITION` (409).
- Human authority is non-negotiable: AI creates drafts only, AI never approves.
  Approval requires an active Incident Manager/Admin membership.

### Authorization

- Every Postmortem backend function validates authenticated user + active
  Membership + same organization + Incident ownership + allowed role via
  `canMutateIncidentAuthority` (incident_manager/admin). `Membership.role` is
  authoritative; `User.role` is never used.
- Reporter and Responder cannot generate, edit, submit, return-to-draft, or
  approve. They may only read when they can view the Incident.

### Generation flow (`generate-postmortem`)

- Requires Incident status `resolved` or `closed`; other statuses return
  `INCIDENT_NOT_ELIGIBLE`.
- Loads authoritative Incident, Service, Tasks, and bounded chronological
  Timeline server-side; never trusts frontend copies of source data.
- Builds deterministic request fingerprint from source data + prompt version.
- Creates a started `AiRun` (feature `postmortem`, provider `deepseek`,
  `prompt_version` `postmortem-v1`), calls DeepSeek with `thinking: disabled`,
  `response_format: json_object`, ~30s timeout, strict JSON output validation,
  and at most one repair attempt.
- On success: creates or versions the Postmortem as `draft`,
  `generated_by_ai=true`, links `ai_run_id`, marks the AiRun succeeded, and
  appends exactly one `postmortem_generated` Timeline event.
- Never approves, submits, publishes, changes Incident status, or creates Tasks.
- Failure handling: `AI_NOT_CONFIGURED`, `AI_TIMEOUT`, `AI_RATE_LIMITED`,
  `AI_PROVIDER_UNAVAILABLE`, `AI_INVALID_RESPONSE`; Incident and any existing
  Postmortem/human edits remain untouched; AiRun records a safe failure; no
  success event; no provider body leakage.

### Regeneration guard

- Explicit `forceRegenerate + confirmRegenerate` only. Existing draft is returned
  without a new provider call when not forced (fingerprint cache).
- Regeneration increments `version`, preserves prior output via AiRun history,
  and never overwrites an APPROVED Postmortem (`POSTMORTEM_APPROVED_IMMUTABLE`).
- Frontend requires an explicit confirmation dialog and prevents regeneration
  while unsaved local edits exist.

### Human edit / review / approval

- `save-postmortem-draft`: Manager/Admin, status `draft`, validates all editable
  sections; no AI call, no new AiRun, no generation event.
- `submit-postmortem-for-review`: Manager/Admin, `draft -> in_review`, requires
  content complete; no AI.
- `return-postmortem-to-draft`: Manager/Admin, `in_review -> draft`; no AI, no
  version change.
- `approve-postmortem`: Manager/Admin, `in_review -> approved`; sets
  `approved_by_user_id` and `approved_at` server-side; concurrency-safe
  `updateMany` expected-state pattern so exactly one logical approval succeeds
  and exactly one `postmortem_approved` event is appended.
- Approved Postmortem is immutable for normal editing: no save, no regenerate,
  no resubmit, no return-to-draft. Copy/export stays allowed.

### Manual fallback

- `create-postmortem-draft`: Manager/Admin, `resolved`/`closed` Incident only,
  creates an empty `draft` with `generated_by_ai=false` and `ai_run_id=null`;
  no AI call and no AiRun. The product remains useful when DeepSeek is
  unavailable.

### Read model / frontend

- `get-postmortem`: authoritative read returning editor fields, status, version,
  AI provenance (model / prompt version / generated timestamp), approval display
  metadata (human-readable approver when available), and role-derived
  `canEdit`/`canApprove`. Never exposes raw provider payloads, fingerprints, API
  keys, or hidden reasoning.
- `get-incident` now exposes safe `postmortem` CTA metadata (status, version,
  generatedByAi, approvedAt) so the Incident Room can render the correct action.
- New route `/app/incidents/:incidentId/postmortem`; Incident Room CTA shows
  GENERATE POSTMORTEM / VIEW POSTMORTEM / VIEW APPROVED POSTMORTEM based on
  status and role. Editor states: NO POSTMORTEM, GENERATING, DRAFT, SAVING,
  SAVED, IN REVIEW, APPROVING, APPROVED, AI ERROR, REGENERATION CONFIRMATION.
- COPY POSTMORTEM uses the browser Clipboard API; copying never changes status.
- The Postmortem is NOT added to the Phase 08 realtime subscription scope;
  normal query refetch/onSuccess is sufficient. Phase 08 realtime subscriptions
  and the 10-second bounded reconciliation remain exactly as approved in PRD 1.1.

### Deployment

- Target functions: `generate-postmortem`, `get-postmortem`,
  `save-postmortem-draft`, `submit-postmortem-for-review`,
  `return-postmortem-to-draft`, `approve-postmortem`,
  `create-postmortem-draft`, plus `get-incident` (source changed to expose the
  Postmortem CTA metadata). `base44 entities push` deployed the 9-entity
  manifest. Site deployed via `npx base44 site deploy -y`. No full Base44
  deploy, no auth push.

### Hosted verification

- Gate results recorded in `screenshot/phase-09/runtime-evidence.md`; network
  evidence in `screenshot/phase-09/network-audit.md`; latency in
  `screenshot/phase-09/realtime-latency.md`.
