
# Fleet Incidents (Vite + React + TypeScript) — v2

Light-mode only app using shadcn-style components, React Router, TanStack Query, and a mocked API (localStorage).

## Run
```bash
npm install
npm run dev
```

## What's new in v2
- **Statistics Dashboard** (`/incidents/stats`): cards + Chart.js trend and quick filters (status, severity, date range).
- **File uploads** for images and documents (persisted as Data URLs in localStorage). Previews on detail & inline view.
- **Editing moved** to full page: `/incidents/:id/edit`. List keeps inline **View** only.
- **Multi-step** create/edit forms; edit includes extra step.
- Reusable shadcn-style UI under `src/components/ui`.

## Notes
- No backend required; replace `src/lib/mockApi.ts` to connect to real APIs later.
- All styling is light mode.
```
