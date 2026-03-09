# Nautilus Web (MVP)

Hebbia-style Matrix UI for Cordros Asset Management. See `docs/HEBBIA_UI_RESEARCH.md` for the design reference.

## Run

```bash
cd apps/web
npm install
npm run db:setup   # first time: create DB + seed default workspace
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If you skip `db:setup`, the app still runs: APIs return **demo data** (workspaces, grid, deal targets, export log) so the UI is fully functional. Persistence requires a database.

**Vercel:** No database setup on the server. Deploy as-is; the app runs in demo mode (read/write works in-session, data is not persisted across requests).

## Database

- **SQLite** via Prisma (`prisma/dev.db`).
- **Setup:** `npm run db:setup` (runs `prisma generate`, `prisma db push`, and seed).
- **Seed:** Creates one workspace “Project Alpha — IC memo prep” with default DD columns and sample sources/cells.
- **Scripts:** `db:generate`, `db:push`, `db:seed` also available.

## API

- `GET/POST /api/workspaces` — list, create.
- `GET /api/workspaces/[id]` — workspace + grid (sources, fields, cells).
- `POST /api/workspaces/[id]/sources` — add source(s).
- `POST /api/workspaces/[id]/fields` — add field.
- `POST /api/workspaces/[id]/export` — record export.
- `GET /api/exports` — list export log.

## What’s included

- **Sidebar:** Workspace list, Templates / Find workspaces / Reports / Settings (with real routes).
- **Workspace page:** Grid with sources as rows, extraction fields as columns; Upload sources, Add fields, Add source, View options, Export memo; Co-Pilot panel; citation/explanation modals.
- **Persistence:** Workspaces, sources, fields, cells, and export log are stored in the DB and survive refresh.
