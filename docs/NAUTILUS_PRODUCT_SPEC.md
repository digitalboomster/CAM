# Nautilus — Product Spec (Cordros Vision)

Single source of truth for what Nautilus is. Derived from the Cordros Final Presentation and Nautilus V1; Hebbia-inspired flows apply **inside** specific modules, not as the whole product.

---

## 1. What Nautilus Is

**Nautilus** is the Cordros Asset Management platform: one integrated system for investment operations, client and institutional reporting, deal and document intelligence, execution, and regulatory compliance. It is **not** only a document grid—it is the full console implied by the Cordros presentation.

---

## 2. Module Map (from presentation)

| Module | Purpose | Hebbia-style flows? |
|--------|---------|---------------------|
| **Dashboard** | NAV (ABOR/IBOR), P&L attribution, compliance status, positions, sector heatmap, multi-currency analytics, **AI Insight Panel** (alerts, hedging, rebalance, compliance check) | No — KPIs + alerts + actions |
| **Portfolios** | Portfolio list, mandate, allocation, positions | No |
| **Analytics** | Deeper analytics, attribution, risk | No |
| **Reports** | Report templates, generation, export history | No |
| **Document Intelligence** | Projects/deals, doc tree (Financials, Legal, Regulatory), viewer, **AI analysis** (risk score, findings, precedent), Generate DD Report | **Yes** — grid + citations + Co-Pilot |
| **Deal Sourcing (AI)** | Search targets, ranked targets, market multiples, regulatory flags, source traceability | Yes — search + structured output + citations |
| **Market Intelligence** | Research console, news + AI summaries, competitor monitoring, alerts, regulatory tracker, sentiment, team workspace | Partially — research queue, summaries |
| **InstitutionHub** | Client segment, mandate adherence, AI insights, relationship intelligence, one-click IC pack, report generator, sign-off, secure send | No — client/insto view |
| **DocuFlow AI** | Templates, data mapping, AI writing assistant, compliance/brand/readability, approval queue | Partially — AI-assisted doc gen |
| **Rebalancing Engine** | Allocation vs target, rebalance trigger, proposed trades, AI strategy, simulation, compliance | No — rules + simulation |
| **OMS** | Order entry, AI execution strategy, blotter, market depth, liquidity heatmap, pre-trade compliance, optimizer | No — execution |
| **Valuation Workspace** | Deal, model inputs, comps, DCF sensitivity, valuation range, **AI Co-Pilot** (suggestions, risk alerts) | Partially — Co-Pilot in context |
| **Regulator Reporting** | SEC/compliance templates, export history, live preview, generate & export, SEC status | No — templates + export |
| **Workspace (current)** | Document-centric grid: sources as rows, extraction fields as columns, Co-Pilot, citations, export memo | **Yes** — this is the Hebbia wedge we built |

---

## 3. Shared Platform (from day one)

- **Fund / portfolio context** — Top-level selector (e.g. “Cordros Milestone Fund 2023”). All modules can assume current fund/portfolio.
- **User / role** — Who is logged in; used for audit and permissions later.
- **NAV, compliance, positions** — Dashboard is the home for these; other modules can reference (e.g. “Pre-trade: Passed” in OMS).

---

## 4. Where Hebbia Fits

- **Document Intelligence** — Full project + doc tree + **grid** (sources → fields → cells) + AI summary + citations + “Generate Due Diligence Report.” Our current workspace is this module in miniature.
- **Deal Sourcing** — Search → **structured ranked list** (like rows) with metrics and **source traceability** (like citations).
- **Research / Market Intelligence** — Research queue, AI summaries, “12 documents analyzed” style traceability.
- **Valuation Workspace** — **AI Co-Pilot** in context (suggestions, risk alerts, “Ask Co-Pilot”).

So: Hebbia’s **flows and functionality** (grid, citations, Co-Pilot, transparency) are inspirations **inside** these modules, not the entire product.

---

## 5. Current Build vs Vision

| Aspect | Current build | Full vision |
|--------|----------------|-------------|
| **Scope** | One route (Workspace) + Templates, Find workspaces, Reports, Settings shells | Dashboard, Portfolios, Analytics, Reports, Document Intelligence, Deal Sourcing, Market Intelligence, InstitutionHub, DocuFlow, Rebalancing, OMS, Valuation, Regulator Reporting, Workspace |
| **Workspace** | Full implementation (grid, Co-Pilot, citations, export log, DB) | Same — this **is** Document Intelligence / research wedge |
| **Dashboard** | None | NAV, IBOR/ABOR, P&L attribution, compliance, AI Insight Panel |
| **Fund context** | None | Fund selector in header |
| **Other modules** | Placeholder routes only (Templates, Find, Reports, Settings) | Full nav + shells, then implement in order |

---

## 6. Recommended Progression

1. **Lock this spec** — Treat as the target; no more “we only built a grid.”
2. **Restructure app** — Single Nautilus layout with **top-level nav** for all modules; current workspace becomes **Workspace** or **Document Intelligence**; add **Dashboard** as the second real screen (shell with NAV, compliance, AI panel placeholders).
3. **Fill Dashboard** — Mock NAV, compliance status, one AI alert card, “Run Scenario” / “Compliance Check” actions so the platform feels anchored.
4. **Then** — Add one module at a time (e.g. Reports, then Document Intelligence full project tree, then Deal Sourcing, etc.) using this spec and the presentation screens as reference.

---

## 7. References

- Cordros Final Presentation (Omotunwase_Osinaike_Cordros_Final Presentation.pdf) — source of dashboard, GrowthIQ, Document Intelligence, Deal Sourcing, Market Intelligence, InstitutionHub, DocuFlow, Rebalancing, OMS, Valuation, Regulator Reporting screens.
- Nautilus V1 PDF — module list and strategic rationale.
- `docs/HEBBIA_UI_RESEARCH.md` — Hebbia layout and flows for use inside Document Intelligence and related modules.
