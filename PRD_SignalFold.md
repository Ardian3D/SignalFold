# PRD — SignalFold

> **Canonical Product Requirements Document / Single Source of Truth**  
> Seluruh AI coding agent, frontend generator, reviewer, dan developer wajib mengikuti dokumen ini.  
> Apabila implementasi bertentangan dengan dokumen ini, dokumen ini yang menjadi acuan sampai ada perubahan versi tertulis.

---

## 0. Document Control

| Field | Value |
|---|---|
| Product | SignalFold |
| Tagline | **Turn signals into action.** |
| Document | `PRD_SignalFold.md` |
| Version | 1.0 |
| Status | Approved foundation / implementation-ready |
| Date | 22 July 2026 |
| Product type | AI-assisted incident command center |
| Target build | Base44 Backend Competition, 21–28 July 2026 |
| Primary frontend workflow | Google AI Studio → GitHub |
| Primary backend workflow | Git clone → Grok CLI → Base44 |
| Frontend stack | Vite + React + TypeScript |
| Backend platform | Base44 Developer Backend |
| AI provider | DeepSeek API |
| Primary AI model | `deepseek-v4-flash` |
| Budget target | Rp0 for Base44; minimal prepaid DeepSeek usage |
| Owner | Project owner / product lead |
| AI implementation reviewer | ChatGPT |
| Coding executor | Grok CLI |

### 0.1 Change Policy

Setiap perubahan yang memengaruhi fitur, schema, permission, user flow, atau API contract harus:

1. Dicatat pada bagian **Revision History**.
2. Menjelaskan alasan perubahan.
3. Menjelaskan file atau modul terdampak.
4. Tidak dilakukan diam-diam oleh coding agent.
5. Tidak menghapus requirement lama tanpa persetujuan pemilik proyek.

### 0.2 Revision History

| Version | Date | Change | Author |
|---|---|---|---|
| 1.0 | 22 Jul 2026 | Initial canonical PRD | Product team |

---

# 1. Product Summary

## 1.1 Product Name

**SignalFold**

Nama ini menggambarkan proses mengubah sinyal masalah yang tersebar—laporan pengguna, gangguan layanan, task, timeline, dan keputusan—menjadi satu respons terkoordinasi.

## 1.2 Product One-Liner

> SignalFold mengubah laporan insiden yang berantakan menjadi rencana respons terstruktur, ruang koordinasi realtime, dan postmortem yang dapat ditindaklanjuti.

## 1.3 Elevator Pitch

Ketika terjadi gangguan, tim sering kehilangan waktu karena laporan tersebar, severity tidak jelas, ownership membingungkan, dan status tidak konsisten. SignalFold menyediakan satu command center untuk menerima laporan, mengklasifikasikan insiden dengan bantuan DeepSeek, membentuk task respons, menyinkronkan aktivitas tim secara realtime, dan menghasilkan postmortem setelah insiden diselesaikan.

AI hanya memberikan saran dan draft. Keputusan operasional tetap berada di tangan manusia.

## 1.4 Core Transformation

```text
Scattered signals
      ↓
Structured incident
      ↓
AI-assisted triage
      ↓
Coordinated realtime response
      ↓
Verified resolution
      ↓
Actionable postmortem
```

## 1.5 Product Promise

SignalFold harus terasa:

- Cepat ketika tekanan tinggi.
- Tenang secara visual.
- Jelas dalam ownership.
- Transparan dalam timeline.
- Aman secara permission.
- Tetap berfungsi ketika AI gagal.
- Mudah dipahami juri dalam demo kurang dari dua menit.

---

# 2. Problem Statement

## 2.1 Masalah Utama

Tim kecil dan menengah sering menangani insiden menggunakan kombinasi chat, spreadsheet, tiket, dan percakapan verbal. Akibatnya:

- Laporan awal tidak terstruktur.
- Severity diputuskan secara inkonsisten.
- Tidak jelas siapa yang bertanggung jawab.
- Task penting terlewat atau dikerjakan ganda.
- Update tersebar di banyak tempat.
- Stakeholder menerima informasi yang tidak konsisten.
- Timeline sulit direkonstruksi.
- Postmortem tidak dibuat atau terlalu lama dibuat.

## 2.2 Existing Alternatives and Their Gaps

Produk enterprise incident management sering:

- Terlalu kompleks untuk tim kecil.
- Membutuhkan setup dan integrasi panjang.
- Memiliki biaya yang tidak cocok untuk tim awal.
- Menampilkan terlalu banyak data sebelum pengguna memahami tindakan selanjutnya.

SignalFold tidak mencoba menggantikan seluruh kategori enterprise. MVP berfokus pada satu alur yang sempurna:

> **Report → Triage → Coordinate → Resolve → Learn**

---

# 3. Product Goals and Non-Goals

## 3.1 Primary Goals

1. Pengguna dapat membuat insiden dalam waktu kurang dari 60 detik.
2. DeepSeek dapat mengubah deskripsi mentah menjadi analisis terstruktur.
3. Tim dapat berkoordinasi pada Incident Room yang berubah realtime.
4. Setiap perubahan penting tercatat dalam timeline.
5. Incident Manager dapat menutup insiden melalui proses yang terkontrol.
6. Sistem dapat menghasilkan postmortem draft dari data insiden.
7. Seluruh demo utama tetap dapat berjalan tanpa layanan berbayar tambahan selain penggunaan DeepSeek yang sangat kecil.
8. Produk terlihat polished, responsive, dan layak produksi.

## 3.2 Competition Goals

SignalFold harus menunjukkan pemakaian Base44 yang nyata dan terlihat:

- Authentication.
- Database entities.
- Row-level / field-level access control.
- Realtime subscriptions.
- Backend functions.
- Secure external API call.
- Hosting/deployment.
- Typed SDK integration.
- Error handling dan observability.

## 3.3 Non-Goals for MVP

MVP **tidak** membangun:

- PagerDuty replacement penuh.
- Native mobile app.
- WhatsApp, SMS, Slack, Teams, atau telephony integration.
- Complex on-call scheduling.
- Automated remediation terhadap production infrastructure.
- Full observability ingestion dari Datadog, Sentry, Grafana, atau cloud provider.
- Billing dan paid subscription.
- Marketplace integrations.
- Multi-region disaster recovery.
- Autonomous AI agent yang mengubah sistem produksi.
- Blockchain atau smart contract.
- Legal/compliance certification.
- Advanced SSO/SCIM.
- Full email campaign system.

---

# 4. Scope Prioritization

## 4.1 P0 — Must Ship

P0 wajib selesai, diuji, dan polished sebelum fitur lain.

1. Landing page.
2. Register, login, logout, session restore.
3. Onboarding organisasi sederhana.
4. Dashboard incident.
5. Incident list dengan filter.
6. Create Incident form.
7. AI Analyze Incident.
8. Incident Room realtime.
9. Incident task creation, claim, update, complete.
10. Internal activity timeline.
11. Controlled status transitions.
12. Resolve Incident workflow.
13. Generate Postmortem draft.
14. Responsive desktop/tablet/mobile.
15. Loading, empty, success, and error states.
16. Demo seed data dan satu demo story yang stabil.
17. Permission enforcement.
18. DeepSeek failure fallback.
19. Production build tanpa console error.
20. README setup untuk local development.

## 4.2 P1 — Ship Only After P0 Is Stable

1. Draft stakeholder/public status update dengan AI.
2. Public status page.
3. In-app notifications.
4. Service catalog.
5. Team management UI.
6. Reopen resolved incident.
7. Export/copy postmortem.
8. Dark/light appearance toggle bila tidak mengganggu deadline.
9. Audit log admin view.

## 4.3 P2 — Future

1. Email notifications.
2. Slack/Discord integrations.
3. Webhook ingestion.
4. File attachments.
5. Calendar follow-ups.
6. Incident templates/playbooks.
7. Analytics trends.
8. Custom domain.
9. Multiple AI providers.
10. Automated on-call rotation.
11. API keys for external clients.
12. Enterprise SSO.

---

# 5. Target Users and Personas

## 5.1 Reporter

Orang yang pertama menemukan atau menerima laporan masalah.

**Needs:**

- Melaporkan masalah dengan cepat.
- Tidak dipaksa memahami istilah teknis.
- Melihat apakah laporan sudah ditangani.
- Menambahkan konteks baru.

**Permissions:**

- Membuat incident.
- Melihat incident dalam organisasinya.
- Menambahkan note internal.
- Tidak dapat menetapkan severity final.
- Tidak dapat resolve atau close incident.

## 5.2 Responder

Engineer, support specialist, operator, atau anggota tim yang mengerjakan respons.

**Needs:**

- Mengetahui apa yang harus dilakukan.
- Claim task tanpa bentrok.
- Memperbarui progres.
- Melihat timeline terbaru tanpa refresh.

**Permissions:**

- Semua permission Reporter.
- Claim/unclaim task.
- Mengubah task yang ditugaskan kepadanya.
- Membuat task tambahan.
- Memperbarui incident update.
- Tidak dapat close incident kecuali juga memiliki role Incident Manager.

## 5.3 Incident Manager

Pemimpin respons insiden.

**Needs:**

- Menentukan severity dan status.
- Membagi ownership.
- Mengarahkan respons.
- Menyetujui komunikasi.
- Memastikan syarat resolusi terpenuhi.
- Membuat dan menyetujui postmortem.

**Permissions:**

- Semua permission Responder.
- Mengubah severity.
- Mengubah incident status.
- Assign commander dan assignee.
- Menjalankan AI analysis.
- Membuat stakeholder update draft.
- Resolve, reopen, dan close incident.
- Generate/approve postmortem.

## 5.4 Organization Admin

Mengelola workspace SignalFold.

**Permissions:**

- Semua permission Incident Manager.
- Mengelola anggota dan role.
- Mengelola service catalog.
- Mengelola organization settings.
- Menjalankan/reset demo seed.
- Melihat audit log.

---

# 6. Role and Permission Matrix

Legend:

- ✅ Allowed
- ⚠️ Allowed with constraints
- ❌ Not allowed

| Action | Reporter | Responder | Incident Manager | Admin |
|---|---:|---:|---:|---:|
| Create incident | ✅ | ✅ | ✅ | ✅ |
| View organization incidents | ✅ | ✅ | ✅ | ✅ |
| Add internal note | ✅ | ✅ | ✅ | ✅ |
| Run AI triage | ❌ | ⚠️ optional | ✅ | ✅ |
| Change severity | ❌ | ❌ | ✅ | ✅ |
| Change incident status | ❌ | ⚠️ limited | ✅ | ✅ |
| Create task | ⚠️ | ✅ | ✅ | ✅ |
| Claim task | ❌ | ✅ | ✅ | ✅ |
| Update own task | ❌ | ✅ | ✅ | ✅ |
| Reassign any task | ❌ | ❌ | ✅ | ✅ |
| Publish public update | ❌ | ❌ | ✅ | ✅ |
| Resolve incident | ❌ | ❌ | ✅ | ✅ |
| Generate postmortem | ❌ | ❌ | ✅ | ✅ |
| Approve postmortem | ❌ | ❌ | ✅ | ✅ |
| Manage services | ❌ | ❌ | ⚠️ | ✅ |
| Manage team | ❌ | ❌ | ❌ | ✅ |
| Reset demo workspace | ❌ | ❌ | ❌ | ✅ |

Permission harus diterapkan di backend/security rules. Menyembunyikan tombol di frontend **bukan** enforcement keamanan.

---

# 7. Core User Journeys

## 7.1 First-Time User Journey

```text
Landing
  → Create account
  → Verify/authenticate
  → Create organization or join organization
  → Select role/use case
  → See seeded example or empty dashboard
  → Create first incident
```

### Acceptance Criteria

- Pengguna baru tidak melihat layar kosong tanpa arahan.
- Onboarding maksimal tiga langkah.
- Pengguna dapat skip optional profile fields.
- Setelah onboarding, user diarahkan ke dashboard.
- Organization dan Membership dibuat secara konsisten.

## 7.2 Report Incident Journey

```text
Dashboard / Incident List
  → New Incident
  → Enter title + description + affected service
  → Submit
  → Incident created in "reported"
  → Optional "Analyze with AI"
  → AI proposes severity, category, impact, and tasks
  → Incident Manager reviews
  → Accept or edit recommendations
  → Incident enters "triaging" or "investigating"
```

### Minimum Form Fields

- Title — required, 5–120 chars.
- Description — required, 20–5,000 chars.
- Affected service — optional for first report.
- Observed start time — optional.
- Impact hint — optional.
- Reporter contact/context — derived from authenticated user.
- “Analyze immediately with AI” checkbox — default enabled only for authorized users; never blocks creation.

### Important Rule

Incident must be persisted **before** calling DeepSeek. If AI fails, the report must remain safely stored.

## 7.3 Incident Response Journey

```text
Incident Room
  → Review AI/human summary
  → Confirm severity
  → Assign commander
  → Create/accept tasks
  → Responders claim tasks
  → Realtime updates appear
  → Status moves through controlled state machine
  → Team verifies recovery
  → Incident Manager resolves
```

## 7.4 Resolution Journey

```text
Monitoring
  → Open Resolve dialog
  → Enter resolution summary
  → Confirm service recovery
  → Review unfinished critical tasks
  → Resolve incident
  → Record resolved timestamp
  → Generate postmortem draft
```

System may warn about unfinished tasks, but Incident Manager may override with an explicit reason.

## 7.5 Postmortem Journey

```text
Resolved Incident
  → Generate Postmortem
  → DeepSeek receives sanitized incident history
  → Draft is stored
  → Human edits
  → Human approves
  → Copy/export/publish
```

AI draft must never be marked approved automatically.

## 7.6 Demo Journey

Demo harus dapat dipresentasikan dalam 90–120 detik:

1. Open seeded dashboard.
2. Create incident:
   - “Checkout payments are failing after the latest deployment. 37 customers reported failed transactions.”
3. Run AI analysis.
4. Show structured SEV1 recommendation and generated tasks.
5. Open a second browser/user.
6. Claim and complete one task.
7. Show realtime update in first browser.
8. Move to monitoring.
9. Resolve.
10. Generate postmortem.
11. Show Base44 feature summary.

---

# 8. Information Architecture and Routes

## 8.1 Public Routes

| Route | Purpose |
|---|---|
| `/` | Marketing landing page |
| `/login` | Login |
| `/signup` | Account creation |
| `/demo` | Optional guided public demo |
| `/status/:organizationSlug` | Public status page, P1 |
| `/privacy` | Minimal privacy notice |
| `/terms` | Minimal terms page |

## 8.2 Authenticated Routes

| Route | Purpose |
|---|---|
| `/app` | Dashboard |
| `/app/onboarding` | First-time setup |
| `/app/incidents` | Incident list |
| `/app/incidents/new` | Create incident |
| `/app/incidents/:incidentId` | Incident Room |
| `/app/incidents/:incidentId/postmortem` | Postmortem editor |
| `/app/services` | Service catalog, P1 |
| `/app/team` | Membership management, P1 |
| `/app/notifications` | Notifications, P1 |
| `/app/settings` | User and organization settings |

## 8.3 Navigation

Desktop:

- Logo + SignalFold wordmark.
- Dashboard.
- Incidents.
- Services.
- Team.
- New Incident primary CTA.
- Search/command.
- Notifications.
- User menu.

Mobile:

- Compact header.
- Bottom navigation or accessible drawer.
- Persistent “New Incident” action.
- No horizontal overflow.

---

# 9. Functional Requirements

## 9.1 Landing Page

The landing page explains the product in under five seconds.

### Required Content

- SignalFold logo.
- Headline:
  - **Turn signals into action.**
- Supporting line:
  - “AI-assisted incident command for teams that need clarity fast.”
- Primary CTA: “Start a demo incident.”
- Secondary CTA: “Open dashboard.”
- A visual walkthrough of:
  - Report.
  - Triage.
  - Coordinate.
  - Resolve.
  - Learn.
- A product mockup that is visually consistent with the real app.
- Competition/demo badge may be present but must not dominate.
- No fake customer logos, testimonials, or metrics.

### Interaction

- Strong static composition first.
- Refined, controlled motion.
- No excessive scroll hijacking.
- `prefers-reduced-motion` support.
- CTA must work.

## 9.2 Authentication

### Requirements

- Email/password registration.
- Email/password login.
- Logout.
- Session restore on refresh.
- Protected routes.
- Redirect unauthenticated users to login.
- Redirect authenticated users away from login/signup.
- Friendly error messages.
- Disable submit during request.
- No password stored or logged by application code.

## 9.3 Dashboard

### Summary Metrics

- Active incidents.
- SEV1/SEV2 active incidents.
- Open tasks.
- Incidents resolved this week.
- Average time to acknowledge, if data exists.
- Average time to resolve, if data exists.

### Panels

- Active Incidents.
- Needs Attention.
- Recent Activity.
- Team Load or Open Tasks.
- Quick Create Incident.
- Demo helper card only in demo workspace.

### Empty State

When no incidents exist:

- Explain what an incident is.
- Show “Create your first incident.”
- Offer “Load demo workspace” for Admin.

## 9.4 Incident List

### Capabilities

- Search title, code, and description.
- Filter by severity.
- Filter by status.
- Filter by service.
- Filter by assigned commander.
- Sort by created time, severity, updated time.
- Desktop table and mobile card views.
- URL query parameters preserve filters.
- Loading skeleton.
- Empty filtered state.
- Pagination or incremental loading if required.

## 9.5 Create Incident

### Validation

- Client-side and server-side validation.
- No HTML/script injection.
- Submit remains idempotent.
- Double click does not create duplicate incident.

### On Success

- Redirect to Incident Room.
- Show success toast.
- Add timeline event `incident_created`.
- Optionally trigger AI analysis after creation.

## 9.6 AI Triage

### AI Output

AI proposes:

- Concise summary.
- Severity suggestion.
- Category.
- Affected area.
- Customer/business impact.
- Confidence score.
- Risk flags.
- Recommended tasks.
- Clarifying questions.
- Suggested immediate next action.

### Human-in-the-Loop

- Show “AI suggestion,” never “AI decision.”
- Incident Manager can edit all recommendations.
- Severity only changes after explicit acceptance.
- Generated tasks are reviewed before or immediately after insertion.
- Display model and timestamp in a compact metadata area.
- Never expose hidden reasoning or chain of thought.

## 9.7 Incident Room

Incident Room is the primary product surface.

### Header

- Incident code.
- Title.
- Status.
- Severity.
- Service.
- Commander.
- Started/detected duration.
- AI confidence, when applicable.
- Actions based on role.

### Main Layout

Desktop:

- Center: Timeline and updates.
- Right rail: Tasks, responders, incident metadata.
- Optional left subnavigation or compact summary.

Mobile:

- Header summary.
- Tabs: Timeline / Tasks / Details.
- Sticky critical actions.
- No information hidden permanently.

### Required Actions

- Add note.
- Change status.
- Change severity.
- Assign commander.
- Create task.
- Claim task.
- Complete task.
- Mark task blocked.
- Draft status update, P1.
- Resolve incident.
- Generate postmortem after resolution.

### Realtime Events

The following must update without refresh:

- Incident status.
- Severity.
- Commander.
- Task created.
- Task claimed.
- Task status changed.
- New timeline update.
- Resolution state.

## 9.8 Tasks

### Task Fields

- Title.
- Description.
- Priority.
- Status.
- Assignee.
- Due time optional.
- Source: human / AI / system.
- Blocking reason.
- Completion timestamp.

### Task Rules

- Claim must be concurrency-safe.
- A task cannot be claimed by two users.
- Only active members can be assignees.
- Done tasks remain visible.
- Critical tasks require explicit completion.
- Blocked task requires reason.
- Task changes generate timeline events.

## 9.9 Timeline

Timeline is append-oriented.

### Event Types

- Incident created.
- AI analysis requested/completed/failed.
- Severity changed.
- Status changed.
- Commander assigned.
- Task created/claimed/completed/blocked.
- Internal note.
- Public update drafted/published.
- Incident resolved/reopened/closed.
- Postmortem generated/approved.

### Timeline Requirements

- Reverse chronological by default, with option for chronological.
- Human-readable actor.
- Exact timestamp available.
- Semantic icons, not color only.
- Internal/public visibility label.
- Event creation is server-controlled for privileged actions.

## 9.10 Resolution

### Required Fields

- Resolution summary.
- Root cause known? yes/no/unknown.
- Service recovery verified checkbox.
- Remaining risk.
- Optional override reason when critical tasks remain open.

### Side Effects

- Status becomes `resolved`.
- `resolved_at` stored.
- Resolution timeline event created.
- Service status optionally returns to operational.
- Postmortem CTA appears.
- Notifications generated, P1.

## 9.11 Postmortem

### Sections

- Executive summary.
- Customer/business impact.
- Detection.
- Timeline.
- Root cause.
- Contributing factors.
- Resolution.
- What went well.
- What went poorly.
- Preventive actions.
- Owners and due dates for follow-ups.

### States

- `draft`
- `in_review`
- `approved`
- `published`

### Rules

- AI creates draft only.
- Human may edit.
- Approver identity and time are stored.
- Regeneration requires confirmation because it may overwrite edits.
- Prefer versioning or preserve prior snapshot.

## 9.12 Public Status Page — P1

### Public Data Only

- Organization display name.
- Current public incidents.
- Public-safe summary.
- Current status.
- Last update.
- Resolved incident history, limited.

Never expose:

- Internal notes.
- AI prompt.
- Membership.
- Internal task list.
- Raw incident description containing sensitive data.
- Internal root cause before approval.

---

# 10. Incident State Machine

## 10.1 Canonical Statuses

```text
reported
triaging
investigating
identified
monitoring
resolved
closed
```

Optional exceptional transition:

```text
resolved → investigating
```

This represents a reopened incident.

## 10.2 Allowed Transitions

| From | Allowed To |
|---|---|
| reported | triaging, investigating, closed |
| triaging | investigating, identified, closed |
| investigating | identified, monitoring, resolved |
| identified | investigating, monitoring, resolved |
| monitoring | investigating, resolved |
| resolved | closed, investigating |
| closed | none |

## 10.3 Transition Rules

- Reporter cannot change state.
- Responder may move `investigating → identified` and `identified → monitoring` only if configured; default MVP may reserve all status changes for Incident Manager.
- Only Incident Manager/Admin may resolve, reopen, or close.
- `resolved` requires resolution summary and recovery confirmation.
- `closed` requires a resolved incident.
- Every transition writes an IncidentUpdate.
- Invalid transitions return `409 INVALID_STATE_TRANSITION`.

## 10.4 Timestamp Rules

- `reported_at`: set at creation.
- `acknowledged_at`: first transition out of `reported`.
- `resolved_at`: transition to `resolved`.
- `closed_at`: transition to `closed`.
- Reopen does not erase previous timestamps; store reopen event in timeline and optionally `reopened_count`.

---

# 11. Severity Model

## 11.1 Canonical Severities

| Severity | Label | General Meaning |
|---|---|---|
| SEV1 | Critical | Broad outage, severe business impact, payment/security/safety critical |
| SEV2 | Major | Major degradation or high-impact partial outage |
| SEV3 | Moderate | Limited impact with workaround or smaller affected group |
| SEV4 | Low | Minor issue, cosmetic, or low urgency |

## 11.2 Deterministic Baseline

Before or alongside AI, server may calculate a baseline from explicit fields:

- Total service outage → at least SEV2.
- Payments entirely unavailable → likely SEV1.
- Confirmed security exposure → SEV1 and add security risk flag.
- Single-user issue with workaround → SEV3 or SEV4.
- Unknown impact → do not assume low; ask clarifying questions.

## 11.3 AI Rule

DeepSeek suggests severity. A human with Incident Manager permission confirms or changes it.

## 11.4 Severity Changes

Every change requires:

- Previous severity.
- New severity.
- Actor.
- Reason.
- Timestamp.
- AI-assisted flag if AI recommendation influenced it.

---

# 12. AI Product Requirements

## 12.1 Provider

DeepSeek API called only from Base44 backend functions.

## 12.2 Model Strategy

Default:

```text
deepseek-v4-flash
```

Use cases:

| Feature | Thinking | Response | Budget |
|---|---|---|---|
| Triage | Disabled | Strict JSON | Low |
| Status draft | Disabled | Strict JSON/text | Low |
| Postmortem | Disabled initially; enabled only if needed | Strict JSON | Controlled |

Configuration must be environment-driven so model behavior can be changed without rewriting UI.

## 12.3 AI Is Optional Infrastructure

Core incident workflow must operate if:

- DeepSeek is unavailable.
- API key is absent.
- Balance is insufficient.
- Request times out.
- Response is malformed.
- Rate limit is hit.

The user receives a retry action and can continue manually.

## 12.4 AI Call Budget

Per incident target:

1. One triage call.
2. Zero or one status draft call.
3. One postmortem call.

Rules:

- Never call AI on page load.
- Never call AI on every keystroke.
- Never regenerate automatically.
- Cache successful result.
- Require manual confirmation for regeneration.
- Store token usage and latency.
- Use bounded prompt sizes and output token limits.
- Trim timeline to relevant, structured events.

## 12.5 Triage Input Contract

```ts
interface AnalyzeIncidentInput {
  incidentId: string;
  title: string;
  description: string;
  service?: {
    name: string;
    criticality?: "low" | "medium" | "high" | "critical";
  };
  observedStartAt?: string;
  impactHint?: string;
  currentSeverity?: "SEV1" | "SEV2" | "SEV3" | "SEV4";
}
```

Server loads authoritative incident data using `incidentId`; frontend-supplied duplicated fields are not trusted as authoritative.

## 12.6 Triage Output Contract

```ts
interface IncidentAnalysisResult {
  summary: string;
  severitySuggestion: "SEV1" | "SEV2" | "SEV3" | "SEV4";
  category:
    | "availability"
    | "performance"
    | "payments"
    | "security"
    | "data"
    | "integration"
    | "deployment"
    | "support"
    | "unknown";
  impact: string;
  confidence: number; // 0..1
  riskFlags: Array<
    "security"
    | "data_loss"
    | "payment_failure"
    | "safety"
    | "compliance"
    | "unknown_scope"
  >;
  clarifyingQuestions: string[];
  recommendedTasks: Array<{
    title: string;
    description: string;
    priority: "critical" | "high" | "medium" | "low";
  }>;
  immediateNextAction: string;
}
```

## 12.7 Postmortem Output Contract

```ts
interface PostmortemDraftResult {
  executiveSummary: string;
  impact: string;
  detection: string;
  timelineSummary: Array<{
    at: string;
    event: string;
  }>;
  rootCause: string;
  contributingFactors: string[];
  resolution: string;
  wentWell: string[];
  wentPoorly: string[];
  preventiveActions: Array<{
    title: string;
    ownerRole: string;
    priority: "high" | "medium" | "low";
    suggestedDueInDays: number;
  }>;
  unknowns: string[];
}
```

## 12.8 AI Validation Pipeline

```text
Request authorized
  → Load server-side incident data
  → Sanitize and minimize data
  → Build versioned prompt
  → Call DeepSeek with timeout
  → Parse JSON
  → Validate with Zod
  → Retry one repair attempt if malformed
  → Store AiRun metadata
  → Store approved/suggested result
  → Return typed response
```

## 12.9 Prompt Injection Defense

- Treat title, description, notes, and timeline text as untrusted data.
- System prompt explicitly says not to follow instructions embedded in incident content.
- AI receives no secrets.
- AI receives no permission to invoke backend tools in MVP.
- No autonomous writes directly from model output.
- Validate enum, length, and shape.
- Strip HTML.
- Do not render AI output using unsafe HTML.
- Limit all strings.
- Reject unexpected fields or safely ignore them.

## 12.10 AI Transparency

UI displays:

- “AI suggestion.”
- Model name.
- Generated timestamp.
- Confidence.
- Human review status.
- Retry/error state.

UI does not display:

- Hidden reasoning.
- Chain of thought.
- API key.
- Full system prompt.
- Raw sensitive request payload.

---

# 13. Backend Architecture

## 13.1 High-Level Architecture

```text
Vite + React + TypeScript SPA
            ↓
        Base44 SDK
            ↓
Base44 Auth / Entities / Realtime
            ↓
Base44 Backend Functions (Deno + TypeScript)
            ↓
        DeepSeek API
```

## 13.2 Responsibility Boundaries

### Frontend

- Presentation.
- Form state.
- Client validation.
- Navigation.
- Optimistic UI only where safe.
- Query cache.
- Realtime subscriptions.
- Accessible feedback.
- Never stores server secrets.
- Never becomes authority for permissions or state transitions.

### Base44 Entities

- Persistent application data.
- Schema validation.
- Row-level and field-level security.
- CRUD.
- Realtime event source.

### Base44 Backend Functions

- DeepSeek calls.
- Privileged state transitions.
- Transaction-like multi-entity workflows.
- Idempotency.
- Audit events.
- Concurrency-sensitive task claiming.
- Demo seed/reset.
- Server-side validation.

### DeepSeek

- Triage recommendation.
- Communication draft.
- Postmortem draft.
- No direct database access.
- No autonomous remediation.

---

# 14. Database Model

## 14.1 Conventions

- Base44 entity names use singular PascalCase.
- IDs use Base44-generated string IDs.
- Every tenant-owned entity includes `organization_id`.
- Use ISO 8601 timestamps.
- Do not assume automatic timestamp field names; inspect generated SDK types.
- Add explicit business timestamps where required.
- Use enums and length validation.
- Avoid storing duplicate data unless needed for snapshot/history.
- Use soft status rather than destructive deletion for important records.

## 14.2 Entity Relationship Diagram

```text
User (built-in)
  └── Membership ───── Organization
                         ├── Service
                         ├── Incident
                         │    ├── IncidentTask
                         │    ├── IncidentUpdate
                         │    ├── Postmortem
                         │    └── AiRun
                         ├── Notification
                         └── AuditLog
```

---

## 14.3 User — Built-In, Extended

| Field | Type | Required | Notes |
|---|---|---:|---|
| display_name | string | yes | 2–80 chars |
| avatar_url | string | no | HTTPS URL |
| timezone | string | no | Default organization timezone fallback |
| default_organization_id | string | no | Current workspace |
| onboarding_completed | boolean | yes | Default false |
| preferences | object | no | Appearance and notification preferences |

Do not store role directly on User because role is organization-specific. Role belongs to Membership.

---

## 14.4 Organization

| Field | Type | Required | Notes |
|---|---|---:|---|
| name | string | yes | 2–100 chars |
| slug | string | yes | Unique, lowercase |
| logo_url | string | no | Optional |
| default_timezone | string | yes | Example `Asia/Jakarta` |
| incident_prefix | string | yes | Default `SF` |
| public_status_enabled | boolean | yes | Default false |
| public_status_title | string | no | P1 |
| public_status_description | string | no | P1 |
| created_by_user_id | string | yes | Owner |
| is_demo | boolean | yes | Demo workspace flag |
| settings | object | no | Future-safe bounded settings |

Constraints:

- `slug` unique.
- `incident_prefix` 2–8 uppercase alphanumeric chars.
- Only Admin may update organization settings.

---

## 14.5 Membership

| Field | Type | Required | Notes |
|---|---|---:|---|
| organization_id | string | yes | Tenant |
| user_id | string | yes | User |
| role | enum | yes | reporter, responder, incident_manager, admin |
| status | enum | yes | invited, active, suspended |
| invited_by_user_id | string | no | Audit |
| joined_at | datetime | no | When active |
| display_title | string | no | Example “Backend Engineer” |

Constraints:

- Unique composite `(organization_id, user_id)`.
- At least one active Admin per organization.
- User cannot elevate their own role unless already Admin and rule permits.
- Suspended membership has no tenant access.

---

## 14.6 Service

| Field | Type | Required | Notes |
|---|---|---:|---|
| organization_id | string | yes | Tenant |
| name | string | yes | Example Checkout API |
| slug | string | yes | Unique within organization |
| description | string | no | 0–1000 chars |
| criticality | enum | yes | low, medium, high, critical |
| operational_status | enum | yes | operational, degraded, outage, maintenance |
| owner_user_id | string | no | Active member |
| tags | string[] | no | Bounded |
| is_active | boolean | yes | Default true |

---

## 14.7 Incident

| Field | Type | Required | Notes |
|---|---|---:|---|
| organization_id | string | yes | Tenant |
| code | string | yes | Human-readable, unique in org |
| title | string | yes | 5–120 chars |
| description | string | yes | 20–5000 chars |
| source | enum | yes | manual, demo, api |
| service_id | string | no | Service |
| reporter_user_id | string | yes | Creator |
| commander_user_id | string | no | Incident Manager |
| severity | enum | yes | SEV1–SEV4 |
| severity_source | enum | yes | human, ai_suggested, rule_baseline |
| status | enum | yes | State machine |
| category | enum | no | AI/human category |
| impact_summary | string | no | 0–2000 chars |
| affected_users_estimate | number | no | Non-negative |
| observed_start_at | datetime | no | User supplied |
| reported_at | datetime | yes | Server |
| acknowledged_at | datetime | no | Server |
| resolved_at | datetime | no | Server |
| closed_at | datetime | no | Server |
| resolution_summary | string | no | Required to resolve |
| recovery_verified | boolean | yes | Default false |
| remaining_risk | string | no | Resolution field |
| ai_summary | string | no | Last accepted/saved AI summary |
| ai_confidence | number | no | 0..1 |
| ai_risk_flags | string[] | no | Bounded enum |
| ai_analysis_version | string | no | Prompt/schema version |
| ai_last_analyzed_at | datetime | no | Server |
| public_visibility | enum | yes | private, public |
| public_summary | string | no | Sanitized |
| is_demo | boolean | yes | Default false |
| reopened_count | number | yes | Default 0 |

Indexes/uniqueness:

- Unique `(organization_id, code)`.
- Index `(organization_id, status)`.
- Index `(organization_id, severity)`.
- Index `(organization_id, reported_at)`.
- Index `service_id`.
- Index `commander_user_id`.

---

## 14.8 IncidentTask

| Field | Type | Required | Notes |
|---|---|---:|---|
| organization_id | string | yes | Tenant |
| incident_id | string | yes | Parent |
| title | string | yes | 3–160 chars |
| description | string | no | 0–2000 |
| priority | enum | yes | critical, high, medium, low |
| status | enum | yes | todo, in_progress, blocked, done, cancelled |
| assignee_user_id | string | no | Active member |
| created_by_user_id | string | no | Null for system/AI |
| source | enum | yes | human, ai, system |
| order_index | number | yes | Sorting |
| due_at | datetime | no | Optional |
| claimed_at | datetime | no | Server |
| completed_at | datetime | no | Server |
| blocking_reason | string | no | Required when blocked |
| completion_note | string | no | Optional |
| ai_run_id | string | no | Trace generated task |

Indexes:

- `incident_id`.
- `(incident_id, status)`.
- `assignee_user_id`.

---

## 14.9 IncidentUpdate

| Field | Type | Required | Notes |
|---|---|---:|---|
| organization_id | string | yes | Tenant |
| incident_id | string | yes | Parent |
| type | enum | yes | See event types |
| visibility | enum | yes | internal, public |
| message | string | yes | 1–5000 chars |
| actor_type | enum | yes | user, ai, system |
| actor_user_id | string | no | For user actor |
| metadata | object | no | Bounded event detail |
| occurred_at | datetime | yes | Server |
| immutable | boolean | yes | System events true |

Security:

- Public anonymous users read only `visibility=public` for publicly visible incidents.
- System-generated immutable events cannot be edited from frontend.
- Human notes may be editable for a brief policy window only if desired; MVP can be append-only.

---

## 14.10 Postmortem

| Field | Type | Required | Notes |
|---|---|---:|---|
| organization_id | string | yes | Tenant |
| incident_id | string | yes | Unique parent |
| status | enum | yes | draft, in_review, approved, published |
| executive_summary | string | yes | Editable |
| impact | string | yes | Editable |
| detection | string | no | Editable |
| timeline_summary | object[] | yes | Structured |
| root_cause | string | yes | May state unknown |
| contributing_factors | string[] | no | Structured |
| resolution | string | yes | Editable |
| went_well | string[] | no | Structured |
| went_poorly | string[] | no | Structured |
| preventive_actions | object[] | no | Structured |
| unknowns | string[] | no | Structured |
| generated_by_ai | boolean | yes | Provenance |
| ai_run_id | string | no | Trace |
| version | number | yes | Start 1 |
| approved_by_user_id | string | no | Required if approved |
| approved_at | datetime | no | Server |
| published_at | datetime | no | Server |

Constraints:

- Unique `incident_id` for current MVP record, or use versions if implemented.
- Approval requires Incident Manager/Admin.
- AI regeneration should preserve a prior snapshot or increment version.

---

## 14.11 AiRun

| Field | Type | Required | Notes |
|---|---|---:|---|
| organization_id | string | yes | Tenant |
| incident_id | string | no | Parent |
| feature | enum | yes | triage, status_draft, postmortem |
| provider | string | yes | `deepseek` |
| model | string | yes | Model actually used |
| prompt_version | string | yes | Example `triage-v1` |
| status | enum | yes | started, succeeded, failed, invalid_response |
| request_fingerprint | string | yes | For dedupe/cache |
| input_token_count | number | no | From usage |
| output_token_count | number | no | From usage |
| duration_ms | number | no | Observability |
| error_code | string | no | Sanitized |
| result_summary | object | no | Small safe snapshot |
| requested_by_user_id | string | yes | Actor |
| started_at | datetime | yes | Server |
| completed_at | datetime | no | Server |

Never store:

- API key.
- Hidden chain of thought.
- Full secret-bearing headers.
- Unbounded raw payloads.

---

## 14.12 Notification — P1

| Field | Type | Required | Notes |
|---|---|---:|---|
| organization_id | string | yes | Tenant |
| user_id | string | yes | Recipient |
| incident_id | string | no | Related |
| type | enum | yes | assignment, severity, status, mention, resolution |
| title | string | yes | 1–160 |
| body | string | yes | 1–1000 |
| action_url | string | no | Internal path only |
| read_at | datetime | no | Null unread |
| created_at_business | datetime | yes | Server |

---

## 14.13 AuditLog

| Field | Type | Required | Notes |
|---|---|---:|---|
| organization_id | string | yes | Tenant |
| actor_user_id | string | no | Null system |
| action | string | yes | Canonical action |
| entity_type | string | yes | Incident etc. |
| entity_id | string | yes | Target |
| metadata | object | no | No secrets |
| occurred_at | datetime | yes | Server |

AuditLog is append-only and Admin-readable.

---

# 15. Security and Multi-Tenancy

## 15.1 Tenant Isolation Invariant

A user may access an entity only when an active Membership exists for:

```text
entity.organization_id == membership.organization_id
AND membership.user_id == current_user.id
AND membership.status == "active"
```

## 15.2 Security Rules

- All tenant entities must include `organization_id`.
- The client may never choose an arbitrary organization ID without server membership validation.
- Role-sensitive actions occur through backend functions or strict field-level rules.
- Public reads are explicitly limited.
- Default posture is deny.
- Admin UI does not replace backend authorization.
- Cross-tenant queries are forbidden.
- Sensitive logs are not public.

## 15.3 Field-Level Restrictions

Examples:

- Reporter cannot write `severity`, `status`, `commander_user_id`, `resolved_at`, `ai_*`.
- Responder cannot write approved postmortem fields.
- Incident Manager cannot modify Membership role unless also Admin.
- AI result fields are written by backend functions.
- System timestamps are written by backend.
- `organization_id` cannot be changed after creation.

## 15.4 Secrets

Server-only secret:

```text
DEEPSEEK_API_KEY
```

Optional server config:

```text
DEEPSEEK_MODEL=deepseek-v4-flash
DEEPSEEK_BASE_URL=https://api.deepseek.com
AI_TRIAGE_TIMEOUT_MS=20000
AI_POSTMORTEM_TIMEOUT_MS=30000
APP_ENV=development|preview|production
PUBLIC_APP_URL=https://...
```

Frontend-public variable:

```text
VITE_BASE44_APP_ID=...
```

Never place `DEEPSEEK_API_KEY` in:

- Vite env exposed to client.
- Source code.
- GitHub repository.
- LocalStorage.
- Browser network payload.
- Screenshots.
- Client error messages.

---

# 16. Backend Function Contracts

The exact Base44 function export format must follow current generated project conventions. The contracts below are canonical.

## 16.1 `createIncident`

### Input

```ts
{
  organizationId: string;
  title: string;
  description: string;
  serviceId?: string;
  observedStartAt?: string;
  impactHint?: string;
  requestId: string;
}
```

### Behavior

1. Authenticate.
2. Validate active Membership.
3. Validate fields.
4. Deduplicate by `requestId`.
5. Generate incident code.
6. Create Incident.
7. Create `incident_created` timeline event.
8. Return incident.
9. AI is not required for success.

### Errors

- `401 UNAUTHENTICATED`
- `403 NOT_A_MEMBER`
- `422 VALIDATION_FAILED`
- `409 DUPLICATE_REQUEST`

## 16.2 `analyzeIncident`

### Behavior

1. Authorize Incident Manager/Admin by default.
2. Load Incident and Service server-side.
3. Check cache fingerprint.
4. Create AiRun.
5. Call DeepSeek.
6. Validate result.
7. Store AI suggestion.
8. Create AI timeline event.
9. Optionally create recommended tasks only when caller sets `createTasks=true`.
10. Return typed analysis.

### Idempotency

Same incident data + same prompt version should return cached result unless `forceRegenerate=true` and caller confirms.

## 16.3 `claimTask`

### Input

```ts
{
  taskId: string;
  expectedStatus: "todo";
}
```

### Behavior

- Ensure active Responder/Manager/Admin membership.
- Perform conditional update.
- If already claimed, return `409 TASK_ALREADY_CLAIMED`.
- Set assignee, status, claimed_at.
- Append timeline event.

## 16.4 `changeIncidentState`

### Input

```ts
{
  incidentId: string;
  targetStatus: IncidentStatus;
  reason?: string;
  recoveryVerified?: boolean;
  resolutionSummary?: string;
  remainingRisk?: string;
  overrideOpenCriticalTasks?: boolean;
  overrideReason?: string;
}
```

### Behavior

- Enforce state machine.
- Enforce role.
- Enforce required fields.
- Set timestamps.
- Append event.
- Return updated incident.

## 16.5 `changeSeverity`

- Incident Manager/Admin only.
- Require reason.
- Append before/after event.
- Validate enum.

## 16.6 `generateStatusDraft` — P1

- Generates draft only.
- Does not publish.
- Sanitizes internal data.
- Output maximum 800 chars unless requested format differs.

## 16.7 `generatePostmortem`

- Resolved/closed incident only.
- Incident Manager/Admin.
- Load selected timeline, tasks, resolution.
- Generate strict structured output.
- Create or version Postmortem draft.
- Never approve automatically.

## 16.8 `seedDemoData`

- Admin only.
- Demo workspace only unless explicit confirmation.
- Idempotent.
- Creates organization service, users/memberships where supported, incidents, tasks, timeline, and resolved sample.

## 16.9 `resetDemoData`

- Admin only.
- Requires typed confirmation.
- Deletes or resets only records with `is_demo=true` and matching organization.
- Never touches non-demo tenant data.

---

# 17. Smart Contract Logic

## 17.1 Decision

**SignalFold does not use a blockchain smart contract in MVP.**

There is no product requirement for:

- Cryptocurrency.
- Token ownership.
- Decentralized consensus.
- On-chain settlement.
- Immutable public ledger.
- Wallet connection.

Adding blockchain would increase cost, complexity, latency, security risk, and deadline risk without improving the incident-response problem.

## 17.2 Equivalent “Contract” Logic

When this PRD mentions contract-like behavior, it means deterministic server-enforced business rules:

1. Role and tenant access.
2. Incident state transitions.
3. Severity change audit.
4. Concurrency-safe task claiming.
5. Resolution preconditions.
6. Append-only system timeline.
7. Postmortem approval.
8. Idempotent functions.
9. Demo data isolation.

These rules belong in Base44 backend functions and security policies, not in frontend components.

## 17.3 Optional Future Integrity Enhancement

Future versions may create a hash chain of audit events for tamper evidence, but this remains off-chain and out of MVP scope.

---

# 18. Realtime Requirements

## 18.1 Subscription Scope

Subscribe only to data relevant to the active organization/incident:

- Active Incident.
- IncidentTask for incident.
- IncidentUpdate for incident.
- Notifications for current user, P1.

## 18.2 Expected UX

- New update appears within approximately 1–2 seconds under normal conditions.
- No full page refresh.
- Preserve scroll position.
- Visually mark new events without distracting flashing.
- If disconnected, display “Realtime disconnected — retrying.”
- Re-fetch authoritative snapshot after reconnect.
- Clean up subscriptions on route change/unmount.

## 18.3 Conflict Rules

- Server is authoritative.
- Optimistic update may be used for low-risk notes.
- Claim task and status transitions must wait for server confirmation.
- On conflict, revert optimistic UI and display clear message.

---

# 19. Frontend Technical Specification

## 19.1 Stack

- Vite.
- React.
- TypeScript with strict mode.
- React Router.
- Tailwind CSS.
- TanStack Query for server state.
- React Hook Form.
- Zod.
- Lightweight local UI state with React context or Zustand only when justified.
- Lucide React or a consistent icon set.
- date-fns or equivalent.
- Recharts only for dashboard charts that add value.
- Motion library only for controlled interface motion.
- Vitest.
- React Testing Library.
- Playwright for critical E2E.

Use current stable package versions compatible with each other. Do not blindly upgrade mid-build after lockfile is established.

## 19.2 Architecture Principles

- Feature-oriented folders.
- UI components do not call Base44 directly.
- Use repositories/services/hooks as integration boundary.
- Mock and Base44 implementations share contracts.
- No giant page component.
- No `any` unless documented and temporary.
- No duplicated domain enums.
- No business state machine hidden inside JSX.
- No secrets in frontend.
- All async flows have loading/error states.

## 19.3 Recommended Structure

```text
src/
  app/
    App.tsx
    router.tsx
    providers.tsx
  assets/
    brand/
  components/
    ui/
    layout/
    feedback/
  features/
    auth/
    onboarding/
    dashboard/
    incidents/
    tasks/
    timeline/
    postmortems/
    services/
    team/
  domain/
    incident.ts
    task.ts
    membership.ts
    ai.ts
  data/
    contracts/
    mock/
    base44/
  hooks/
  lib/
    base44Client.ts
    queryClient.ts
    env.ts
    errors.ts
  styles/
    tokens.css
    globals.css
  test/
base44/
  entities/
  functions/
  config/
public/
```

The actual Base44 scaffold may place backend files differently. Follow generated platform structure while preserving conceptual boundaries.

## 19.4 Data Access Interface

Frontend phase must begin with an abstraction such as:

```ts
interface IncidentRepository {
  list(filters: IncidentFilters): Promise<Incident[]>;
  getById(id: string): Promise<Incident>;
  create(input: CreateIncidentInput): Promise<Incident>;
  subscribe(id: string, callback: IncidentEventCallback): () => void;
}
```

Google AI Studio uses mock implementation. Grok later replaces/wires the Base44 implementation without rewriting visual components.

## 19.5 State Strategy

- TanStack Query: remote entity state.
- URL: filters, active tab, search.
- Form library: form state.
- Local component state: dialogs and minor UI.
- Avoid duplicating remote entity data in Zustand.
- Realtime event invalidates or patches Query cache.

---

# 20. Brand and Visual Design System

## 20.1 Selected Logo

Primary logo:

- Rounded-square outline.
- Continuous S-shaped signal path.
- Two signal-lime endpoints.
- Horizontal uppercase wordmark `SIGNALFOLD`.

The S icon is the primary app icon and favicon candidate.

## 20.2 Brand Meaning

- S = SignalFold.
- Continuous path = signal flow.
- Two endpoints = detection and resolution.
- Rounded container = controlled command environment.
- Signal lime = active intelligence/action.

## 20.3 Core Colors

```css
--ink: #0A0A0A;
--paper: #F3F1EA;
--surface: #FFFFFF;
--graphite: #242522;
--muted: #A8AAA3;
--signal: #D6FF3F;
--critical: #FF4D3D;
--warning: #F2B84B;
--success: #28A66A;
--info: #4B78FF;
```

Final contrast must be tested. Signal lime is an accent, not body-text color on light backgrounds.

## 20.4 Typography

Recommended:

- Display/brand: Sora, Mona Sans, or custom geometric wordmark.
- UI/body: Geist, Inter, or Instrument Sans.
- Technical metadata: Geist Mono or IBM Plex Mono.

Rules:

- Strong hierarchy.
- Tabular numerals for durations and codes.
- Tight but readable headings.
- Avoid generic centered SaaS stacks across every page.
- Incident Room prioritizes scanability over decoration.

## 20.5 UI Personality

> **Calm during chaos.**

Visual qualities:

- Precise.
- Editorial.
- Industrial.
- High contrast.
- Structured.
- Dense only where operationally useful.
- Minimal lime accent.
- Severity colors reserved for actual state.

Avoid:

- Glassmorphism.
- Decorative gradients.
- Neon blobs.
- Excessive rounded cards.
- Pill buttons everywhere.
- Random particles.
- Fake terminal.
- Generic AI sparkle overload.
- Constant fade-up animation.
- Decorative motion with no meaning.
- Red as permanent brand color.

## 20.6 Motion

- 120–240ms for standard interaction.
- 300–500ms for panel transitions.
- No bounce/overshoot in critical UI.
- New realtime item may slide/clip subtly.
- Logo loader can animate the signal path.
- Reduced motion removes nonessential movement.
- Do not delay operational action for animation.

---

# 21. Responsive and Accessibility Requirements

## 21.1 Target Widths

Test explicitly:

- 1440.
- 1280.
- 1024.
- 768.
- 430.
- 390.
- 360.

## 21.2 Accessibility

Target WCAG 2.2 AA where feasible.

Required:

- Semantic HTML.
- Keyboard navigation.
- Visible focus.
- Skip link.
- Dialog focus trap and return.
- Labels for inputs.
- Error association.
- Color is not the only severity indicator.
- Accessible names for icon buttons.
- Screen-reader live region for important async results.
- Reduced-motion support.
- Sufficient contrast.
- Touch targets approximately 44px where practical.
- Logical heading structure.
- Table alternatives/card layout on small screens.

---

# 22. Error Handling

## 22.1 Error Taxonomy

```ts
type AppErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_FAILED"
  | "INVALID_STATE_TRANSITION"
  | "TASK_ALREADY_CLAIMED"
  | "DUPLICATE_REQUEST"
  | "AI_UNAVAILABLE"
  | "AI_TIMEOUT"
  | "AI_INVALID_RESPONSE"
  | "RATE_LIMITED"
  | "NETWORK_ERROR"
  | "UNKNOWN";
```

## 22.2 UX Rules

- Do not show raw stack traces.
- Keep user-entered form data after recoverable errors.
- AI error does not delete incident.
- Permission error explains lack of authority.
- Conflict error offers refresh/retry.
- Global error boundary for unexpected render failures.
- Route-level not-found page.
- Offline/reconnect banner where useful.

---

# 23. Performance Requirements

Targets for production build under normal demo conditions:

- Initial route should become usable quickly on modern connection.
- Landing LCP target ≤ 2.5 seconds.
- Interaction latency should feel immediate.
- Avoid shipping large animation/video assets.
- Lazy-load noncritical routes.
- Code-split Incident Room adjuncts if beneficial.
- Limit realtime subscriptions.
- Virtualize only when lists become large; do not prematurely complicate MVP.
- AI triage target:
  - show pending state immediately.
  - timeout around 20 seconds.
- Postmortem target:
  - timeout around 30 seconds.
- Production build must have no accidental source-secret exposure.

---

# 24. Analytics and Observability

## 24.1 Product Events

Track minimal, privacy-conscious events:

- `signup_completed`
- `organization_created`
- `incident_created`
- `ai_triage_requested`
- `ai_triage_succeeded`
- `ai_triage_failed`
- `task_claimed`
- `incident_status_changed`
- `incident_resolved`
- `postmortem_generated`
- `postmortem_approved`
- `demo_reset`

## 24.2 Backend Observability

Log:

- Function name.
- Request ID.
- User ID or safe identifier.
- Organization ID.
- Duration.
- Result status.
- Sanitized error code.
- AI model/token usage.

Do not log:

- Passwords.
- API keys.
- Authorization headers.
- Full sensitive descriptions by default.
- Hidden model reasoning.

---

# 25. Demo Data Specification

## 25.1 Organization

```text
Northstar Commerce
```

## 25.2 Services

- Checkout Web.
- Payments API.
- Order Processor.
- Customer Portal.

## 25.3 Main Demo Incident

```text
Code: SF-2026-0042
Title: Checkout payments failing after latest deployment
Description:
Customers cannot complete card payments after the latest deployment.
Support has received 37 reports in the last 12 minutes.
Service: Payments API
Initial status: reported
Expected AI suggestion: SEV1
```

## 25.4 Recommended Demo Tasks

1. Compare latest deployment changes.
2. Confirm payment gateway health.
3. Run checkout transaction test.
4. Prepare rollback.
5. Draft customer-facing status update.

## 25.5 Secondary Seed Records

- One active SEV2 incident.
- One resolved incident with approved postmortem.
- Several low-priority historical incidents.
- Multiple responders with distinct roles.

Demo data must make every dashboard component meaningful without appearing fake or overloaded.

---

# 26. Testing Strategy

## 26.1 Unit Tests

Required for:

- Incident state transition validator.
- Severity baseline.
- Permission helpers.
- AI response Zod schemas.
- Date/duration formatting.
- Filter serialization.
- Request fingerprint/idempotency helper.

## 26.2 Component Tests

Required for:

- Create Incident validation.
- Severity badge accessibility.
- Task claim conflict UI.
- Resolve dialog required fields.
- AI pending/error/success states.
- Postmortem editor.
- Protected route behavior.

## 26.3 Integration Tests

Required for:

- Create incident + timeline event.
- Analyze incident success.
- Analyze incident malformed response.
- Claim task concurrency conflict.
- Status transition.
- Resolve prerequisites.
- Generate postmortem.
- Tenant isolation.

## 26.4 E2E Critical Path

Playwright flow:

```text
Register/login
  → Dashboard
  → Create incident
  → Analyze
  → Accept tasks
  → Claim task
  → Update status
  → Resolve
  → Generate postmortem
```

Second realtime E2E may use two browser contexts where feasible.

## 26.5 Manual QA Matrix

- Chrome desktop.
- Chromium mobile.
- Keyboard-only.
- Reduced motion.
- Slow network.
- DeepSeek failure.
- DeepSeek timeout.
- Empty workspace.
- Permission boundaries.
- Two users updating same task.
- Refresh during active incident.
- Direct URL to protected page.
- Production deployment.

---

# 27. Definition of Done

A phase or feature is done only when:

1. Functional requirement works.
2. Acceptance criteria pass.
3. Types pass.
4. Lint passes.
5. Relevant tests pass.
6. Production build passes.
7. No console error.
8. Loading state exists.
9. Empty state exists where relevant.
10. Error state exists.
11. Responsive states checked.
12. Keyboard/accessibility checked.
13. Permission enforced in backend.
14. No secret exposed.
15. Documentation updated.
16. Grok completion report provided.
17. Reviewer approves moving to next phase.

“UI terlihat selesai” tanpa backend/security/test tidak berarti done.

---

# 28. Development Workflow

## 28.1 Stage A — Frontend in Google AI Studio

Goal:

- Produce an exceptional visual frontend using mock data.
- Implement all pages and interactions.
- Keep data integration replaceable.
- Match canonical domain types.
- Do not hardcode Base44 calls inside UI components.

Order:

1. Brand foundation and app shell.
2. Landing.
3. Auth/onboarding screens.
4. Dashboard.
5. Incident list.
6. Create Incident.
7. Incident Room.
8. Postmortem.
9. Services/team/settings.
10. Responsive/accessibility/polish.
11. Mock integration consistency.
12. Build and publish to GitHub.

Frontend mock data must conform to this PRD schema from day one.

## 28.2 Stage B — GitHub Handoff

Before backend work:

- Repository published.
- Main branch clean.
- Lockfile committed.
- `npm install` works.
- `npm run dev` works.
- `npm run build` works.
- `.env.example` exists.
- README explains setup.
- No secret committed.
- Mock mode documented.

## 28.3 Stage C — Grok CLI Backend Integration

Suggested phases:

### Phase 0 — Repository Audit and Baseline

- Inspect architecture.
- Run install/lint/test/build.
- Report issues.
- Do not redesign frontend.

### Phase 1 — Base44 Project and SDK Foundation

- Link/create backend.
- Configure SDK.
- Add env validation.
- Preserve mock adapter.

### Phase 2 — Entity Schemas and Security

- Implement canonical entities.
- Generate types.
- Implement tenant/role rules.
- Seed minimal organization.

### Phase 3 — Authentication and Onboarding

- Replace mock auth.
- Session restore.
- Organization and Membership flow.

### Phase 4 — Incident CRUD

- Real reads/writes.
- Create Incident function.
- Incident code.
- Filters.
- Timeline creation.

### Phase 5 — Tasks and Realtime

- Task functions.
- Claim concurrency.
- Subscriptions.
- Cache synchronization.

### Phase 6 — DeepSeek Triage

- Secret.
- AI function.
- Validation.
- caching.
- AI UX integration.
- fallback.

### Phase 7 — State Machine and Resolution

- Status transitions.
- severity.
- resolution.
- audit timeline.

### Phase 8 — Postmortem

- DeepSeek postmortem.
- editor.
- approval.
- safe regeneration.

### Phase 9 — Demo, QA, and Deployment

- Seed/reset.
- E2E.
- production build.
- Base44 deploy.
- submission support.

No phase may begin until the previous phase is reviewed and approved.

---

# 29. Grok CLI Execution Contract

Every Grok prompt must instruct Grok to:

1. Read `PRD_SignalFold.md` completely.
2. Work only on the named phase.
3. Inspect existing code before changing it.
4. Preserve approved frontend design.
5. Avoid unrelated refactors.
6. Never expose secrets.
7. Use current official Base44 patterns.
8. Keep strict TypeScript.
9. Add or update tests.
10. Run verification commands.
11. Stop when acceptance criteria are met.
12. Produce a structured completion report.
13. Clearly state blockers instead of guessing.
14. Never silently change schema or product behavior.
15. Never proceed to the next phase automatically.

## 29.1 Mandatory Grok Report Template

```text
# PHASE COMPLETION REPORT

## 1. Phase
Name and objective.

## 2. Status
COMPLETED / PARTIALLY COMPLETED / BLOCKED

## 3. Summary
What was implemented.

## 4. Files Created
- path
- purpose

## 5. Files Modified
- path
- change

## 6. Architecture Decisions
Decisions and reasons.

## 7. Database / Schema Changes
Exact entities and fields changed.

## 8. Security Changes
Auth, role, tenant, and secret handling.

## 9. Commands Executed
Exact commands.

## 10. Verification Results
- typecheck
- lint
- unit tests
- integration tests
- production build
- manual checks

## 11. Acceptance Criteria
PASS/FAIL for every criterion.

## 12. Known Issues
All remaining issues.

## 13. Assumptions
Every assumption made.

## 14. Environment Variables
Required variables, without secret values.

## 15. Migration / Setup Steps
Steps the owner must execute.

## 16. Git Status
Changed/untracked files and suggested commit message.

## 17. Recommended Next Action
Fix current phase or request approval for next phase.
```

---

# 30. Deployment Requirements

## 30.1 Environments

- Local development.
- Preview/demo.
- Production submission.

## 30.2 Production Checklist

- Correct Base44 app ID.
- DeepSeek secret configured server-side.
- CORS/origin assumptions verified.
- Production build passes.
- Routes work on refresh.
- Auth redirect works.
- Realtime works.
- DeepSeek works and fallback works.
- Demo data present.
- No debug panel.
- No test API key.
- No console error.
- Open Graph metadata.
- Favicon/icon.
- Mobile checked.
- Public URL stable.
- Submission login/demo credentials documented privately where appropriate.

## 30.3 Rollback

- Keep last working Git commit/tag.
- Do not deploy large unreviewed changes on final day.
- Preserve mock fallback and seeded demo data.
- If AI fails during presentation, use cached demo result.

---

# 31. Budget Guardrails

## 31.1 Base44

Use developer backend beta and competition credits. Avoid unnecessary high-frequency operations.

## 31.2 DeepSeek

- Use `deepseek-v4-flash`.
- Keep thinking disabled by default.
- Limit prompts.
- Strict JSON.
- Cache results.
- One repair attempt maximum.
- Manual regeneration.
- Store token usage.
- No AI call for ordinary CRUD.
- No AI call for dashboard calculations.
- No AI call for realtime updates.
- No autonomous agent loops.

## 31.3 Paid Services

Do not add a paid service without explicit owner approval.

---

# 32. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Frontend too ambitious | Backend unfinished | Freeze design after approved pages |
| AI malformed JSON | Broken triage | JSON mode + Zod + one repair |
| AI timeout | Demo delay | Manual workflow + cached demo |
| DeepSeek balance unavailable | AI feature blocked | Fallback result and retry |
| Tenant rule bug | Data leak | Deny-by-default tests |
| Realtime conflict | Incorrect task ownership | Server conditional claim |
| Base44 API changes | Integration issues | Use current docs/generated types |
| Generic SaaS appearance | Weak judging impact | Custom visual system and logo |
| Too many features | Incomplete product | P0 freeze |
| Final-day regression | Submission failure | Deploy freeze and rollback tag |
| Secret committed | Security failure | `.gitignore`, scanning, server secrets |
| AI over-authority | Unsafe decision | Human confirmation on all critical actions |

---

# 33. Success Metrics

## 33.1 Product Success

- Incident creation completion rate.
- Time from report to acknowledgement.
- Time from report to first task claim.
- Percentage of incidents with resolution summary.
- Percentage with postmortem draft.
- AI recommendation acceptance/edit rate.
- AI failure rate.

## 33.2 Competition Demo Success

The judging demo succeeds when a new viewer can understand:

1. What problem SignalFold solves.
2. Why realtime matters.
3. What DeepSeek contributes.
4. What Base44 provides.
5. Why the app is more than a chatbot.
6. How the entire workflow reaches resolution.

---

# 34. Final Product Principles

1. **Human authority over AI.**
2. **Core workflow works without AI.**
3. **Server is authoritative.**
4. **Every tenant is isolated.**
5. **Every important action is traceable.**
6. **Realtime serves coordination, not decoration.**
7. **No fake functionality.**
8. **One excellent workflow beats twenty unfinished features.**
9. **Calm interface, decisive actions.**
10. **Turn signals into action.**

---

# 35. Official Technical References

These links are included so coding agents verify current syntax rather than relying on memory:

- Base44 Developer Backend Introduction:  
  `https://docs.base44.com/developers/backend/overview/introduction`
- Base44 Backend Features:  
  `https://docs.base44.com/developers/backend/overview/features`
- Base44 Backend Pricing:  
  `https://docs.base44.com/developers/backend/overview/pricing`
- Base44 SDK Overview:  
  `https://docs.base44.com/developers/references/sdk/getting-started/overview`
- Base44 Entities Overview:  
  `https://docs.base44.com/developers/backend/resources/entities/overview`
- Base44 Backend Functions:  
  `https://docs.base44.com/developers/backend/resources/backend-functions/overview`
- Base44 Third-Party APIs:  
  `https://docs.base44.com/developers/references/sdk/getting-started/third-party-apis`
- Vite Guide:  
  `https://vite.dev/guide/`
- DeepSeek API Quick Start:  
  `https://api-docs.deepseek.com/`
- DeepSeek Models and Pricing:  
  `https://api-docs.deepseek.com/quick_start/pricing/`
- DeepSeek Chat Completion API:  
  `https://api-docs.deepseek.com/api/create-chat-completion/`
- DeepSeek JSON Output:  
  `https://api-docs.deepseek.com/guides/json_mode/`

---

# 36. Instruction to Any Coding Agent

> Read this document completely before editing code. Do not reinterpret SignalFold as a generic chatbot, task manager, monitoring dashboard, or blockchain product. SignalFold is an AI-assisted incident command center. Preserve its canonical workflow, schema, role model, state machine, security constraints, design identity, cost controls, and human-in-the-loop principles. When uncertainty exists, stop and report the ambiguity instead of inventing behavior.
