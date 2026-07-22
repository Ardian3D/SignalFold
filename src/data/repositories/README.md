# Data Layer — Repository Providers & Base44 Integration

This directory acts as the factory / provider layer for repository instances.

## Factory Strategy
When `VITE_DATA_MODE` is set to `'mock'`, repository implementations from `src/data/mock/` are returned.
When `VITE_DATA_MODE` is set to `'base44'`, future Base44 implementations will be returned without requiring modifications to UI components.

## Rules
- Do NOT import Base44 SDK or external APIs in Phase 0.
- All repositories must return typed `Result<T, AppError>` promises.
