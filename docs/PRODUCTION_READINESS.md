# SignalFold Production Readiness

Status snapshot for SignalFold P0.

- Phase: 10 — Demo, QA & Production Readiness
- Date: 14 Aug 2026
- Branch: `backend/base44-phase-10-demo-qa-production-readiness`
- Hosted app: https://signal-fold-fb55961b.base44.app
- Product document: `PRD_SignalFold.md` (v1.1)

## P0 Status

Complete end-to-end workflow verified:

Auth → Organization → Dashboard → Create Incident → Real DeepSeek triage →
human review/apply → AI-reviewed Task → second-client coordination → legal state
progression → monitoring → resolve → real Postmortem generation → human edit →
human approval (Phase 09 verified separately).

## Quality Gates

- Full test suite (Vitest, serial config) run twice — see final report for exact
  file/test counts.
- TypeScript, lint, production build pass.
- Tenant isolation, role security matrix, and direct-write denial covered by tests.
- Hosted critical-path verification, demo seed/reset safety, and security audits
  recorded in `screenshot/phase-10/`.

## AI Isolation

- DeepSeek runs server-side only; browser never calls `api.deepseek.com`.
- AI triage is a suggestion; AI Postmortem is a draft. AI cannot mutate severity,
  status, tasks, or approval without an explicit human action.
- AiRun records provenance; no reasoning/chain-of-thought exposure.
- No passive AI calls; seed and reset never call AI.

## Tenant Isolation

- Every entity carries `organization_id`; reads and mutations validate active
  Membership + tenant scope server-side.
- Cross-tenant seed/reset is rejected.

## Demo Seed / Reset Safety

- `seed-demo-data`: Admin-only, idempotent, deterministic. No AI, no AiRun, no
  pre-seeded live main incident.
- `reset-demo-data`: Admin-only, exact typed confirmation `RESET DEMO DATA`,
  restricted to the current demo organization's demo-owned records and their
  children. Services, Organization, Membership, User, and non-demo records are
  preserved. No organization-wide unfiltered delete.

## Realtime Platform Limitation

- Base44 realtime subscriptions remain primary. In the current hosted
  environment, service-role backend-function writes do not produce observed
  `update_model` delivery to other clients (proven platform behavior).
- Owner-approved degraded fallback: a bounded 10-second authoritative
  reconciliation for the active Incident Room while online + visible.
- Fallback data is never labeled LIVE.

## Known Advisories (non-blocking)

- `npm audit`: 3 high (nanoid <3.3.18; react-router 7.12–7.18.1 CSRF) —
  pre-existing transitive advisories requiring a breaking dependency/framework
  migration; deferred, not suppressed.
- Vite production large-chunk warning — no breaking code-split refactor applied.

## Not Implemented (P1 / P2, out of P0 scope)

Public Status Page, Notifications, AuditLog UI, Slack/Discord/email, webhooks,
file attachments, public Postmortem publishing, reopen workflow, service/team
redesign, new AI/realtime providers.

## Remaining Blockers

None material. See the Phase 10 final report for the complete gate matrix.
