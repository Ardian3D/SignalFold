# SignalFold Demo Runbook

Target: **90–120 seconds** of presented product story (excluding login and initial setup).

## Pre-Demo Checklist

- Hosted app reachable: https://signal-fold-fb55961b.base44.app
- Admin signed in (persistent profile, not counted in the timer).
- `DEEPSEEK_API_KEY` configured; model `deepseek-v4-flash`.
- Demo workspace loaded (Northstar Commerce) so the Dashboard is meaningful.
- Client A: Dashboard ready. Client B: same workspace, Dashboard/Incident List ready.
- Create-incident form reachable.

## The 90–120 Second Story

| # | Step | Presenter action | Note |
|---|------|------------------|------|
| 1 | Dashboard | Show seeded Dashboard (metrics, active SEV2, recent activity). | T0. |
| 2 | Create Incident | Create "Checkout payments failing after latest deployment", service Payments API, description with "37 reports in last 12 minutes". | One submit; server-generated code. |
| 3 | Analyze with AI | Click **ANALYZE WITH AI** once. | Real DeepSeek server call; browser never calls the provider directly. |
| 4 | Show suggestion | Show summary, severity suggestion (target SEV1), category, impact, confidence, risk flags, recommended tasks. | Record actual model/severity/confidence. |
| 5 | Human review | Open the review; confirm severity; select one AI-recommended Task. | Human authority. |
| 6 | Apply | Apply the reviewed suggestion. | Selected Task created once, `source=ai`, unassigned. |
| 7 | Second client | Client B opens the same Incident; claim/complete the Task. | Server-authoritative. |
| 8 | Auto-sync | Client A updates without manual refresh. | Realtime event if delivered, otherwise the 10s degraded reconciliation. |
| 9 | Monitoring | Move the Incident legally to `monitoring`. | Uses the legal state machine; do not jump states. |
| 10 | Resolve | Resolve with a story-consistent summary and verified recovery. | Backend function; status `resolved`. |
| 11 | Postmortem | Click **GENERATE POSTMORTEM** once. | Real DeepSeek draft; show structured sections + AI provenance. |
| 12 | Architecture | Briefly summarize Base44 auth, tenant RLS, backend functions, AiRun provenance, realtime + fallback, human Postmortem approval. | No giant page required. |

## Presenter Notes on Realtime

- If actual `update_model` delivery is absent (the known hosted limitation), say:

  > "SignalFold keeps Base44 subscriptions active and automatically reconciles the authoritative Incident Room as a degraded safety path."

- Do **not** claim a fallback-delivered update was a WebSocket event or took 1–2 seconds via realtime.

## Optimization Only

- Optimize presenter navigation, redundant clicks, and wording — never remove human review, server authority, or legal transitions to hit the timer.
- Manual refresh during the core demo: **zero**.
