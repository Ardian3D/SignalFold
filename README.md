# SignalFold

## Status
**Frontend Phase 1 — Brand Foundation & Design System (Verified & Complete)**

The brand foundation and canonical design system have been implemented and verified against `PRD_SignalFold.md` Section 20. All canonical UI primitives, brand assets, local fonts, accessibility standards, and unit tests are in place.

---

## Tech Stack
- **Framework / Runtime:** React 19 + Vite 6
- **Language:** TypeScript 5.8 (Strict Mode Enabled)
- **Styling:** Tailwind CSS v4
- **Local Fonts:** `@fontsource-variable/sora`, `@fontsource-variable/inter`, `@fontsource/ibm-plex-mono`
- **Routing:** React Router v7
- **Server/Remote State:** TanStack Query v5
- **Forms & Validation:** React Hook Form + Zod
- **Accessible Overlays:** Radix UI Dialog (`@radix-ui/react-dialog`)
- **Icons:** Lucide React
- **Testing:** Vitest + React Testing Library + jsdom
- **Package Manager:** npm

---

## Key Routes
- `/setup` — Phase 1 Brand Foundation & Verification Status
- `/design-system` — Interactive Design System Showcase & Canonical Component Library

---

## Development & Verification Scripts

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

### Running Tests
```bash
npm run test:run
```

### Production Build
```bash
npm run build
```

---

## Brand & Design System Principles
- **Tagline:** *Turn signals into action.*
- **Core Principle:** "Calm during chaos" — high-contrast industrial controls built for operational incident command rooms.
- **Zero External Network Font Requests:** All fonts loaded locally.
- **Official Brand Assets:** `BrandLogo` uses official PNG lockup; `BrandMark` uses favicon.ico.
