# App audit: what works, what’s broken, what has no flow

**Purpose:** One place that lists every page and API, whether it has a real user flow, and what’s broken. No plugging holes — fix from here.

---

## 1. Pages: real flow vs no purpose

| Route | Has real flow? | What it does today |
|-------|----------------|--------------------|
| `/` | Redirect | Redirects to `/dashboard`. |
| `/dashboard` | **Yes** | Quick actions (Open Doc Intelligence, Reports), NAV/Workspaces/Exports stats, Compliance run check. |
| `/workspace` | **Yes** | Document Intelligence: grid, sources, Co-Pilot, export PDF, projects. Core workflow. |
| `/reports` | **Yes** | Templates list, Generate report (template + workspace → workspace with export), Export audit table. **Can fail to open if DB/API fails.** |
| `/settings` | **Yes** | Default export format, require citations; persisted in localStorage. |
| `/templates` | **Yes** | Prebuilt templates; "Use template" creates workspace + columns and navigates to workspace. |
| `/find-workspaces` | **Yes** | Lists workspaces from API, search, link to open each. Depends on `/api/workspaces`. |
| `/deal-sourcing` | **Yes** | Search deal targets, ranked table, citation panel. Uses `/api/deal-targets`. |
| `/regulator-reporting` | **Yes** | SEC templates, Generate & export, regulator export history. Same export log as Reports. |
| `/portfolios` | **Partial** | Mock data only: portfolio list, expand to see positions table. No API, no real data. |
| `/analytics` | **No** | Placeholder cards (Attribution, Risk, Deeper analytics) + “Placeholder view” copy. No flows. |
| `/market-intelligence` | **No** | Placeholder cards + “Competitor monitoring… future release”. No flows. |
| `/institution-hub` | **No** | EmptyModuleCard “Coming soon”. No flow. |
| `/docuflow` | **No** | EmptyModuleCard “Coming soon”. No flow. |
| `/rebalancing` | **No** | EmptyModuleCard “Coming soon”. No flow. |
| `/oms` | **No** | EmptyModuleCard “Coming soon”. No flow. |
| `/valuation` | **No** | EmptyModuleCard “Coming soon”. No flow. |

**Summary:**  
- **Real flow (use daily):** Dashboard, Document Intelligence, Reports, Settings, Templates, Find Workspaces, Deal Sourcing, Regulator Reporting.  
- **Partial (mock only):** Portfolios.  
- **No flow / toy:** Analytics, Market Intelligence, InstitutionHub, DocuFlow, Rebalancing, OMS, Valuation.

---

## 2. APIs: what exists and what can break

| API | Purpose | Can fail / break? |
|-----|---------|--------------------|
| `GET/POST /api/workspaces` | List/create workspaces | 500 if Prisma/DB missing or wrong. |
| `GET /api/workspaces/[id]` | Workspace + grid | 404 if bad id; 500 if DB error. |
| `POST /api/workspaces/[id]/sources` | Add sources | 500 if DB error. |
| `PATCH /api/workspaces/[id]/sources/[sourceId]` | Update source category | 500 if DB error. |
| `POST /api/workspaces/[id]/fields` | Add column | 500 if DB error. |
| `POST /api/workspaces/[id]/export` | Record export (audit log) | 500 if DB error. |
| `GET /api/workspaces/[id]/export/pdf` | PDF download | Depends on workspace data. |
| `GET /api/exports` | Export audit log for Reports / Regulator | **500 if Prisma/DB missing** → Reports page shows “Failed to load” and feels broken. |
| `GET /api/projects` | Projects list | 500 if DB error. |
| `POST /api/projects` | Create project | 500 if DB error. |
| `GET /api/deal-targets?q=` | Deal sourcing search | Returns seeded data; can 500 if DB error. |

**Main fix for “Reports not opening”:**  
- If `/api/exports` returns 500 (e.g. no DB or Prisma error), the Reports page still loads but shows “Failed to load export log” and the Generate section can be broken if workspaces also failed.  
- **Change:** Make `GET /api/exports` return **200** with **[]** when Prisma fails, so the page always opens and shows “No exports yet” instead of an error.  
- Optionally: ensure `GET /api/workspaces` also returns [] on failure so Generate report section always has a valid empty state.

---

## 3. Why “Reports not opening” / “Analytics etc don’t work”

- **Reports:**  
  - Either the route fails (e.g. corrupt `.next` cache → run `npm run dev:clean`), or  
  - `/api/exports` (or `/api/workspaces`) returns 500 → page shows error and feels like it “doesn’t open” or “doesn’t work”.  
  - Fix: make exports API return 200 [] on failure; harden Reports UI when workspaces/exports are empty or failed.

- **Analytics, Market Intelligence, etc.:**  
  - They “open” but have **no flows** — only placeholder copy and cards. So they feel like a “toy car in Formula 1”: present in the nav but no real purpose.  
  - Fix: stop advertising them in the main nav. Show only: **Dashboard, Document Intelligence, Reports, Settings.**  
  - Other routes can stay in code (e.g. direct URL or bookmarks) but show a single “Under construction” message so they don’t pretend to be real modules.

---

## 4. Fix list (in order)

1. **Exports API:** On Prisma/DB error, return `200` and `[]` so Reports always gets a valid response.  
2. **Reports page:** Handle empty workspaces and empty exports without throwing; workspace select has a “No workspace” option when list is empty so Generate section always works.  
3. **Sidebar:** Remove “More modules”. Only show: **Dashboard**, **Document Intelligence**, **Reports**, **Settings**.  
4. **Placeholder pages (Analytics, Market Intelligence, InstitutionHub, DocuFlow, Rebalancing, OMS, Valuation):** Either remove from nav (done in 3) or replace content with one “Under construction” block and a link to Dashboard / Document Intelligence.  
5. **Recovery:** When server or build is broken, run `npm run dev:clean` from repo root (see `docs/SCOPE.md`).

---

## 5. After this audit

- **Nav** = 4 items with clear purpose.  
- **Reports** = always opens; export log is either data or empty, never a hard error from a missing DB.  
- **No fake Formula 1:** Modules with no flow are not in the main nav; if you open them by URL, they don’t pretend to be full features.
