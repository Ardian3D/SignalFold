# Data Layer — Mock Implementations

This directory will store mock repository implementations for Frontend Phase 1+.

## Architecture Rule
- Mock data and mock repositories MUST implement repository contracts defined in `src/data/contracts/`.
- No domain schemas (e.g., Incident, Task, Postmortem, User) should be defined here until `PRD_SignalFold.md` is uploaded and reviewed.
- Visual components must ONLY consume data via repository abstractions or custom hooks, NEVER by importing mock data directly into UI files.
