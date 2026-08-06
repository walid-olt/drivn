# Drivn Client

React frontend for the Drivn car rental platform.

## Tech Stack

- **Framework:** React 19 + Vite 8
- **Routing:** React Router 8
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Icons:** Phosphor Icons
- **Build:** Vite with React Compiler (Babel)

## Project Structure

```
src/
├── components/
│   └── ui/             # shadcn/ui components (button, etc.)
├── lib/
│   └── utils.ts        # Utility functions (cn helper for classnames)
├── App.tsx             # Root component
├── main.tsx            # Entry point
└── index.css           # Tailwind base styles
```

## Path Aliases

| Alias | Resolves To |
|-------|-------------|
| `@` | `./src` |
| `@ui` | `./src/components/ui` |

```tsx
import { Button } from '@ui/button';
import { someUtil } from '@/lib/utils';
```

## Getting Started

### Prerequisites

- Node.js v22+

### Run

```bash
# From repo root (recommended)
pnpm dev:client

# Or from this directory
pnpm dev
```

The app starts on `http://localhost:5173` by default.

### Environment Variables

Loaded from the env file matching Vite's mode in this directory (see `.env.example`): `.env.development` for `dev`, `.env.test` for `test`, `.env.production` for production. Vite only exposes `VITE_`-prefixed variables to the client.

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3000` | Base URL of the backend API |
| `VITE_FRONTEND_URL` | `http://localhost:5173` | Public URL of this client |

Access them via `env` from `src/config/env.ts`.

## UI Components (shadcn/ui)

This project uses shadcn/ui with the `base-mira` style and Phosphor icons.

### Add a new component

```bash
npx shadcn@latest add <component-name>
```

Components are installed to `src/components/ui/`.

### Use a component

```tsx
import { Button } from '@ui/button';
import { RocketLaunchIcon } from '@phosphor-icons/react';

function MyPage() {
  return (
    <Button>
      <RocketLaunchIcon /> Launch
    </Button>
  );
}
```

### Styling

- Use Tailwind CSS classes directly
- Merge conditional classes with the `cn` utility:

```tsx
import { cn } from '@/lib/utils';

<div className={cn('base-styles', isActive && 'active-styles', className)} />
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | Type-check + production build |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Lint with oxlint |
| `pnpm format` | Format with oxfmt |
