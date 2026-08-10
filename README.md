# frontend

The web console for administering and working with workinabox. See
[`docs/OVERVIEW.md`](../docs/OVERVIEW.md) for where it sits in the system — today
it is a management/CRUD surface and does not yet expose the agent-team runtime.

## Stack

React 19 + Vite 7 + TypeScript, Redux Toolkit, react-router-dom, axios. Node 22
(`.nvmrc`). Built into a container (`Dockerfile`) served by nginx (`nginx.conf`).

## Scripts

```sh
npm run dev         # Vite dev server
npm run build       # tsc -b && vite build
npm run preview     # preview a production build
npm run lint        # eslint
npm run typecheck   # tsc -b --noEmit
npm run test        # vitest (watch)
npm run test:ci     # vitest run (one-shot, what CI runs)
npm run format      # prettier --write .
```

## Configuration

Build-time `VITE_*` vars (`src/config.ts`): `VITE_API_BASE_URL` (default `/api`),
`VITE_APP_VERSION`, and `VITE_USE_STUB`.

`VITE_USE_STUB` toggles a fake in-memory backend (`src/features/stub/db.ts`) so
the app runs with no backend. **It is currently `true` in the committed `.env`**,
so a plain `npm run dev` shows seeded stub data, not a live backend; the
production `Dockerfile` overrides it to `false`. Note the stub does not cover the
users/members APIs, so those pages error in stub mode.
