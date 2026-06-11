# UI primitives & semantic tokens

This folder includes reusable building blocks for dashboard pages and tables.

## Semantic design tokens

Defined in `tailwind.config.ts` and mapped from CSS variables in `app/globals.css`.

- **Status colors**: `status.success`, `status.warning`, `status.info`, `status.danger`.
- **Spacing scale**: `space-2xs`, `space-xs`, `space-sm`, `space-md`, `space-lg`, `space-xl`.
- **Elevation**: `shadow-elevation-1`, `shadow-elevation-2`, `shadow-elevation-3`.
- **Radius**: `rounded-xs` → `rounded-2xl` (semantic radius ladder based on `--radius`).
- **Text hierarchy**: `text-caption`, `text-body`, `text-subtitle`, `text-title`, `text-display`.

## Reusable primitives (`dashboard-primitives.tsx`)

### `StatCard`

Use for KPI/statistics blocks.

```tsx
<StatCard icon={Truck} label="Delivery Price" value="$12" subtext="Free delivery" />
```

### `SectionCard`

Use for content sections with a title and optional leading icon.

```tsx
<SectionCard icon={Store} title="About Store">
  <p>Content...</p>
</SectionCard>
```

### `EmptyState` / `ErrorState`

Use for no-data and failure scenarios.

```tsx
<EmptyState title="No records" description="Try changing filters" />
<ErrorState title="Failed to load" description="Please try again" />
```

### `FilterBar` / `SearchField`

Use for table and list controls.

```tsx
<FilterBar>
  <SearchField name="search" value={search} onChange={setSearch} placeholder="Search" />
</FilterBar>
```

## Accessibility checklist used in these primitives

- Warning and info badges use semantic foreground/background tokens with improved contrast (`Badge`
  variants `warning`/`info`).
- Interactive controls include visible `focus-visible` ring styles.
- Icon-only actions must provide `aria-label` (e.g. `ExpandableButton` now defaults to `label` for
  screen readers).
