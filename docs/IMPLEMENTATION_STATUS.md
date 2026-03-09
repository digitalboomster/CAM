# Nautilus — Implementation status

Quick reference for what is built vs placeholder. Use the **Live** / **Partial** / **Coming soon** badges in the app for at-a-glance status.

---

## Live (full flows)

| Module | What’s implemented |
|--------|--------------------|
| **Dashboard** | NAV (mock), compliance status, AI Insight Panel, Compliance check action, Run scenario (disabled), workspace/export counts, fund context |
| **Document Intelligence (Workspace)** | Project/workspace list, doc tree by category, grid (sources × fields), Co-Pilot panel, citations, Generate DD Report, export memo (PDF), export log |
| **Reports** | Report templates, Generate report (→ workspace + export), export audit / export history with audit ID |
| **Deal Sourcing** | Search, ranked target list, market multiple / regulatory flag, View source (citation panel), mock/DB-backed targets |
| **Portfolios** | Portfolio list, mandate, allocation, expandable positions (mock) |
| **Find Workspaces** | List workspaces, search by name, open workspace |
| **Templates** | Prebuilt templates (IC Memo, DD Risk Sweep, Valuation), create workspace from template |
| **Settings** | Export format, require citations on export (persisted in localStorage) |

---

## Partial (some features in place)

| Module | Implemented | Planned / shell |
|--------|-------------|------------------|
| **Analytics** | Cards for Attribution, Risk, Deeper analytics; links to Reports/Dashboard | Live attribution, risk pipeline, custom reports |
| **Market Intelligence** | Research console / News+AI / Competitor monitoring cards and copy | Research queue, live news, regulatory tracker, team workspace |

---

## Coming soon (placeholder)

| Module | Notes |
|--------|--------|
| **InstitutionHub** | Client segment, mandate adherence, one-click IC pack, report generator, sign-off, secure send |
| **DocuFlow AI** | Templates, data mapping, AI writing assistant, compliance/brand/readability, approval queue |
| **Rebalancing** | Allocation vs target, rebalance trigger, proposed trades, AI strategy, simulation, compliance |
| **OMS** | Order entry, AI execution strategy, blotter, market depth, pre-trade compliance |
| **Valuation** | Deal view, model inputs, comps, DCF sensitivity, AI Co-Pilot |
| **Regulator Reporting** | SEC/compliance templates, export history, live preview, generate & export |

---

## Design and trust

- **Visual identity:** Teal (nav, links) + Cordros accent (primary actions: Generate, Export). Sidebar: Nautilus + Cordros wordmark. See [DESIGN_DIFFERENTIATION.md](DESIGN_DIFFERENTIATION.md).
- **Trust layer:** Export audit (stable ID in Reports), “Produced by Matrix Agent, step N” in citation panel and Co-Pilot, input lineage in citation panel, PDF footer attribution.
