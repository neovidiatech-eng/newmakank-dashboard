# Features

Organize business logic and UI by domain (`features/orders`, `features/users`, `features/dashboard`, etc.) instead of broad shared folders.

Each feature can contain:

- `api/` for network/data loaders
- `config/` for mappings and feature constants
- `hooks/` for side-effects/state orchestration
- `components/` for feature-scoped UI
- `types.ts` for feature-local contracts
