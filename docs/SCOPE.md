# App scope and recovery

**See `docs/AUDIT.md` for the full audit:** every page, API, what has a real flow vs no purpose, and the fix list.

**References:** Nautilus V1 strategic white paper (Wealth Operating System, “Aladdin of Africa”), Cordros “Digital Disruption in Nigerian Capital Markets” deck, [Hebbia](https://www.hebbia.com/) (AI for finance, matrix/document intelligence).

## Core app (what you see first)

The app is **intentionally simple** in the UI and aligned with Nautilus + Hebbia:

- **Sidebar:** Nautilus **Wealth Operating System** branding. Four main items — **Dashboard**, **Document Intelligence**, **Reports**, **Settings**. **“More modules”** is collapsible and lists Nautilus V1 modules (Whole Portfolio, Rebalancing, Deal Sourcing, Market Intelligence, Institution Hub, DocuFlow, OMS, Valuation, Regulator Reporting).
- **Dashboard:** Hero line (e.g. “Stop experimenting with AI. Start working with it.”), Quick actions, stat cards (NAV, Workspaces, Exports), **Pre-Trade Compliance** (kill-switch framing from Nautilus).
- **Document Intelligence:** Hebbia-style matrix — “Add documents”, “Add column”, “Add row”; use-case copy (IC Memo, Due Diligence, M&A Deal Points). **Nautilus Co-Pilot** as “Augmented Analyst”.
- **Reports:** Templates, generation, export audit — institutional transparency and audit trails.
- **Settings:** Export and citation preferences; reference to Shariah & ESG guardrails (Nautilus modules).

So in normal use you have: **Dashboard → Document Intelligence (workspace) or Reports**. That’s it.

---

## When the server crashes or pages break

Next.js can leave a bad `.next` cache (e.g. “Unexpected token” or “Unexpected end of JSON input”). Do this:

1. **Stop the dev server** (Ctrl+C).
2. **From repo root:**  
   `npm run dev:clean`  
   This runs `rm -rf .next && next dev` in `apps/web` and starts fresh.
3. If a port is stuck, kill it first, then start again:
   - `lsof -i :3000` (or 3001) then `kill -9 <pid>`  
   - Or run `npm run dev:clean` and let it use the next free port.

Run the app from **project root** (`CAM/`) with `npm run dev` or `npm run dev:clean`. The app lives in `apps/web`; the root `package.json` forwards commands there.

---

## What’s “core” vs “optional”

| Area | Role |
|------|------|
| **Dashboard** | Entry point, Nautilus/Cordros positioning, quick links, stats, Pre-Trade Compliance (kill-switch). |
| **Document Intelligence (workspace)** | Main workflow: matrix (Add documents / Add column / Add row), Co-Pilot (Augmented Analyst), export. Hebbia-style. |
| **Reports** | Templates, generate report, export audit — institutional transparency. |
| **Settings** | Export format, require citations; reference to Shariah/ESG (Nautilus). |
| **More modules** | Nautilus V1: Whole Portfolio, Rebalancing, Deal Sourcing, Market Intelligence, Institution Hub, DocuFlow, OMS, Valuation, Regulator Reporting. Some full pages, some “Coming soon”. |

The reference is **Hebbia** (sidebar = logo + main actions + workspaces) and **Nautilus V1** (Wealth Operating System, 10+ modules). Current setup: 4 main items, rest under “More”.
