# Hebbia Matrix UI Research

Single reference for Nautilus MVP: Hebbia’s UI, layout, copy, and behavior. **Primary source for layout and chrome is the product screenshot** (in-app Matrix view); homepage and blog content supply semantics, copy variants, and product details.

**Sources:** Product screenshot (`assets/Screenshot_2026-03-06_at_19.48.34-4cb617c7-1d51-447e-adc3-bda44d0634af.png`), hebbia.com homepage, Introducing Matrix (blog), Multi-Agent Redesign (blog), Equity Research blog, The Disclosure August 2025, Cuckoo deep dive, SimplifyAITools.

---

## 1. High-level model

- **Matrix** = spreadsheet-like grid for enterprise AI over documents. Rows = documents (or entities, e.g. companies); columns = discrete information fields (sub-questions or extracted attributes). Cells = AI-generated answers, each **cited** to source (click to see passage).
- **Scale:** Thousands of rows and dozens of columns in one grid is normal (Multi-Agent blog).
- **Philosophy:** “First collaborative interface to AI” — decisions are visual and editable in the grid; “show your work,” not black-box chat (Introducing Matrix).

---

## 2. Layout and structure (screenshot + homepage)

**Canonical layout (from screenshot):** Left sidebar → main content with **two stacked sections** — upper = AI chat card, lower = Matrix grid. No right sidebar.

### Sidebar (screenshot)

- **Logo:** Blue “H” + four dots, “Hebbia” wordmark (dark grey).
- **Global:** “Explore templates” (document icon), “Search matrices” (magnifying glass).
- **Recent matrices** — time-grouped: “Today” (e.g. “First Screen Project Alpha” selected, “Q324 Portfolio Review”), “Yesterday” (e.g. “Hannibal Revenue,” “Commercial Contracts,” “Patent Prior Act,” “Deal Terms”).
- **Projects** — collapsible tree: folders (“Project Alpha,” “Co,” “Acme Corp,” “Nordic Telecoms”), docs under folders (“Acme Revenue,” “Acme Investment Risks”), and standalone docs (“Lease Agreements”). Active item = light blue background + darker blue text. Outline icons throughout.

### Top bar (screenshot)

- Matrix title (e.g. “First Screen Project Alpha”), “Saved at 10:49am” (grey), edit (pencil) + avatar on the right.

### Upper section: AI chat card (screenshot)

- **Container:** Rounded white card, subtle shadow, above the grid.
- **User:** Avatar + “You”; full query (e.g. “We are meeting the management team of Project Alpha tomorrow. Draft some key DD questions based on your assessment of these documents.”).
- **Agent:** Blue square “i” icon + “Matrix Agent”; **“12 steps completed”** with downward chevron (expandable — transparency); structured reply (e.g. “Key Questions for Meeting with Project Alpha” as numbered list).
- **Input:** Rounded field, placeholder **“Ask anything…”**, upload icon left, send right.

So the **task lives in the chat card**; the grid below is the structured output. The homepage marketing mock sometimes shows a single prompt *above* the grid (e.g. “We're negotiating a new buy-side acquisition… What were key negotiation levers?”); in-app, that role is the chat card.

### Lower section: Matrix grid (screenshot + homepage)

- **Actions above grid (right-aligned):** **“Display”** (lines + plus icon, view/filter), **“Add documents”** (document icon), **“Add columns”** (grid/column icon). Homepage also references **“+ Add row”** at the *bottom* of the grid for adding another document/entity row.
- **Columns (left to right):** Checkbox (select all) → **Document** (sort/filter icon) → **Date** (sort/filter) → **Document Type** (sort/filter) → extraction columns (e.g. “Investment Risks,” “Market Considerations”). Homepage mock uses different extraction names (Consideration Type, Earn-Out, Indemnification, Reverse Termination) but same idea.
- **Row structure:** Checkbox → row number → **drag handle** (three lines) → **Document** (icon + name, e.g. “FY2024 P&L,” “Project Alpha CIM”) → **Date** (e.g. “Jan 18, 2024”) → **Document Type** as **pill** (e.g. “Financials,” “Marketing Materials” — light purple/pink bg) → extraction cells.
- **Cell content:**  
  - **Loading (homepage):** **“Reading…”** in cell while extracting.  
  - **Resolved:** Short snippet (e.g. “There have been increasing costs related to…”).  
  - **No direct answer (screenshot):** **“Not in document, click to view explanation”** — clickable, opens explanation instead of leaving blank.  
  - **Citation (blogs, Cuckoo, SimplifyAITools):** Click any cell → exact source passage; citation preview without leaving the view (Disclosure Aug 2025: “Enhanced citation previews … view underlying source data without disrupting workflow”).

**Nautilus:** Each cell supports (1) “Reading…” state, (2) snippet, (3) “Not in document, click to view explanation” when applicable, (4) click → citation panel/modal with source text + doc ref.

### Visual design (screenshot)

- Backgrounds: white and light greys; primary text dark grey. Accents: blue (logo, active nav, agent icon); light purple/pink for document-type pills. Clean sans-serif; outline icons; generous whitespace; rounded corners on cards and inputs.

### Transparency in the UI (screenshot)

- **“12 steps completed”** + chevron — exposes agent step count and drill-down.
- **“Not in document, click to view explanation”** — explicit, clickable “no answer but here’s why” instead of a blank cell.

---

## 3. Column semantics (blog)

- **Column generation:** User request is decomposed into discrete information fields; each field becomes a column and the system extracts it for every row (Multi-Agent blog).
- **Follow-up columns (Aug 2025):** Chain multi-step analysis; later columns can build on prior results; “control the model’s logic across steps for consistent, auditable outputs.” Columns are “questions” or extraction targets, not just static headers.

---

## 4. Documents and ingestion

- **Add documents:** PDFs, Word, transcripts, decks, emails, scanned images; “vast quantities” supported. **UX (Aug 2025):** Clear progress tracking, visibility, failure alerts. Web crawler: bulk ingest with URLs preserved. Auto-extract tables for export (e.g. financials).

---

## 5. Exports and outputs

- **PDF (Aug 2025):** Polished exports with formatting, cover letters, sections, **preserved citations**, firm logo — memos, one-pagers, research packs. **Excel:** Auto-extracted tables.

---

## 6. Trust and transparency (messaging)

- **Pillars (homepage):** Any Task | Any Data | **Total Transparency** | Enterprise Security. “See the work — trace every action that AI takes”; “citation at every step,” “full auditability.” UI should make steps and citations obvious (e.g. “N steps completed,” click-to-citation on every cell).

---

## 7. Use-case framing (homepage)

- **Vertical tabs:** Legal | Credit | Advisory | Corporate | Consulting | Real Estate | **Asset Management**. **Asset Management** use cases: IC Memo Deal Library, Research Synthesis, Comps Tracking, Drafting IMs, Sourcing, Due Diligence, Reporting, “1000+ other use cases.” For Nautilus (Cordros): same grid paradigm — e.g. portfolios/mandates/funds as rows, compliance/risk/performance as columns.

---

## 8. Agent / workflow layer (Aug 2025)

- Purpose-built agents (repeatable workflows, org library); document-to-agent (workflow from reference doc, auto schema for new docs). MVP can defer; grid pattern (Add documents / Add columns / Add row, rows = docs or entities, columns = extracted fields) should stay consistent.

---

## 9. Nautilus MVP checklist (Hebbia-like UI)

| Element | Hebbia (screenshot + research) | Nautilus target |
|--------|---------------------------------|-----------------|
| **App layout** | Left sidebar + main (chat card above, grid below) | Same |
| **Sidebar** | Logo; Explore templates; Search matrices; Recent (Today/Yesterday); Projects (folders + docs); active = light blue | Same structure; Nautilus branding |
| **Top bar** | Matrix title; “Saved at …”; edit + avatar | Matrix name, save status, actions |
| **Chat card** | You + query; Matrix Agent + “N steps completed” (expandable); reply; “Ask anything…” + upload + send | Same pattern |
| **Grid actions** | Display, Add documents, Add columns (right above grid); Add row at bottom | Same |
| **Grid columns** | Checkbox, Document (sort), Date (sort), Document Type (sort), extraction columns | Same order; sort on metadata |
| **Row** | Checkbox, row #, drag handle, document + icon, date, type pill, extraction cells | Same |
| **Document type** | Pill (e.g. “Financials”) — light purple/pink | Pills for type/category |
| **Cell** | “Reading…” (loading); snippet (done); “Not in document, click to view explanation” (no answer); click → citation | Same states + citation panel |
| **Trust** | “N steps completed” expandable; citations on every cell | Visible steps + citations |
| **Visual** | White/light grey; blue accents; outline icons; rounded corners; spacing | Same tone; Cordros palette |
| **Scale** | Thousands of rows, dozens of columns | Virtualize as needed |

---

## 10. References

- **Product screenshot:** `assets/Screenshot_2026-03-06_at_19.48.34-4cb617c7-1d51-447e-adc3-bda44d0634af.png`
- Hebbia homepage: https://www.hebbia.com/
- Introducing Matrix: https://www.hebbia.com/blog/introducing-matrix-the-interface-to-agi
- Multi-Agent Redesign: https://www.hebbia.com/blog/divide-and-conquer-hebbias-multi-agent-redesign
- Equity Research: https://www.hebbia.com/blog/5-ways-equity-research-teams-use-hebbia-to-drive-speed-and-insight
- The Disclosure August 2025: https://www.hebbia.com/blog/the-disclosure-august-2025
- Cuckoo deep dive: https://cuckoo.network/blog/2025/06/07/hebbia
- SimplifyAITools: https://simplifyaitools.com/hebbia/
