# MVP flows and error handling (audit)

This doc records what was incomplete and what was fixed so the MVP is **functional**, not just aesthetic.

## Problem: no clear flow for “first workspace” and DB errors

- **Before:** If the database wasn’t set up, `GET /api/workspaces` and `GET /api/exports` returned `200` with `[]`. The UI showed “Create first workspace” or empty lists. Clicking “Create first workspace” then failed (POST 500) and only then did the workspace page show “Could not connect to database” with `npm run db:setup` instructions.
- **Result:** Confusing: user thought they could create a workspace, then hit an error with no way to retry without a full refresh.

## Fixes applied

### 1. API: return 503 when DB is unavailable

- **`GET /api/workspaces`**  
  On Prisma/DB error, returns `503` with `{ error: "Database not available", code: "DB_UNAVAILABLE" }` instead of `200` + `[]`.
- **`GET /api/exports`**  
  Same: on error, returns `503` with the same body.

So the client can distinguish “DB down” (503) from “empty list” (200 + `[]`). All pages that call these APIs now get a thrown error and can show the setup message **on first load**, not only after a failed create.

### 2. Workspace page (Document Intelligence)

- **On load:** If `fetchWorkspaces()` fails (e.g. 503), the page shows the “Could not connect to database” card with `npm run db:setup` and a **Try again** button that re-runs the request (no full refresh).
- **Empty state:** When DB is fine and the list is empty, the “Create first workspace” + template chips flow is unchanged; backend also auto-creates one workspace on first GET when DB is empty.
- **Create failure:** If the user clicks “Create first workspace” and POST fails (e.g. DB still down), the same DB error card is shown with Try again.

### 3. Templates page

- On “Use template” → `createWorkspace()` failure, the error message is now:  
  **“Database not set up. Run npm run db:setup in apps/web, then try again.”** with the command in a code block. Styled as an amber notice instead of a generic red error.

### 4. Find Workspaces

- When load fails (503 or network), shows an amber card with the same `db:setup` instructions and a **Try again** button that re-fetches workspaces.

### 5. Deal Sourcing

- When `fetchDealTargets()` fails, shows an amber card with `db:setup` instructions and a **Try again** button that re-runs the existing `load()`.

### 6. Regulator reporting (export log)

- When `fetchExportLog()` or `fetchWorkspaces()` fails, shows an amber card with `db:setup` instructions and a **Try again** button that re-fetches both.

## Flow summary

| Scenario | Before | After |
|----------|--------|--------|
| User opens Document Intelligence, DB not set up | Empty state “Create first workspace” → click → POST fails → then DB error | 503 on GET → DB error card with “Run npm run db:setup” + **Try again** on first load |
| User opens Find Workspaces, DB not set up | Generic “Failed to load” + refresh | Same message + **Try again** (no refresh) |
| User uses Templates without DB | “Failed to create workspace” | “Database not set up. Run npm run db:setup…” + command |
| User runs db:setup and wants to retry | Had to refresh the page | **Try again** on all affected pages |

## Other APIs

- **`GET /api/deal-targets`**  
  Already returns `500` on DB error; Deal Sourcing page shows the same setup message + Try again. No change to API.
- **Reports**  
  Uses `fetchExportLog()` and `fetchWorkspaces()`; both now 503 on DB error, so the Reports page will show errors from the shared error handling (e.g. in Generate tab or audit section) and can be extended with a Try again if needed.

## Checklist for “first workspace” and DB errors

- [x] API returns 503 (not 200 + empty) when DB is unavailable for workspaces and exports.
- [x] Workspace page shows DB error on initial load when 503, with Try again.
- [x] Workspace page “Create first workspace” empty state still works when DB is up; backend auto-creates one workspace when list is empty.
- [x] Templates show a clear “Database not set up…” message and `db:setup` command on create failure.
- [x] Find Workspaces, Deal Sourcing, Regulator reporting: setup message + Try again on load failure.
