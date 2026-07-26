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
