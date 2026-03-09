# Push the envelope — next-level ideas

Ideas to differentiate Nautilus further, aligned with Nautilus V1, Cordros deck, and Hebbia.

---

## High impact, lower effort

### 1. **Dashboard: “Live use cases” strip** (Hebbia-style)
- Add 4–6 cards below the hero: **IC Memo**, **Due Diligence**, **M&A Deal Points**, **Research Synthesis**, **Comps**, **Earnings Analysis**.
- Each: one-line description + “Open in Document Intelligence” (pre-fill or new workspace).
- Signals: “1000+ use cases” / “Real use cases. Real value.”

### 2. **Trust bar** (Hebbia: “Any Task · Any Data · Total Transparency · Enterprise Security”)
- Thin strip on Dashboard or in footer: **Total transparency** (trace every action), **Enterprise security**, **Audit trail**, **NGX / FMDQ / SEC** (Nigerian context).
- Optional: same strip in Document Intelligence TopBar.

### 3. **Natural-language query bar above the matrix**
- Hebbia-style: persistent input above the grid, e.g. “What were key negotiation levers in similar past deals?”
- On submit: open Co-Pilot with that query pre-filled, or (later) run search across documents.
- Copy: “Ask in natural language” / “Any task. Any data.”

### 4. **Metadata + Nigeria**
- App description: “Wealth Operating System for the Nigerian investment ecosystem.”
- Optional: one stat in ₦ (e.g. “NAV (₦)” or “AUM” placeholder), or “NGX / FMDQ” in a footer or report footnote.
- Favicon: “N” or Nautilus mark so the tab feels branded.

### 5. **“More modules” one-liners**
- In sidebar (on hover or expand), show Nautilus V1 one-liner per module, e.g. “Whole Portfolio — Single-pane-of-glass view of every Naira under management.”
- Or a single **Platform** / **Modules** page listing all with description + status (Live / Coming soon).

### 6. **Export audit: “Download full audit”**
- Reports page: button “Download full audit log” (CSV or PDF) for compliance.
- Reinforces “institutional transparency.”

---

## Medium impact, medium effort

### 7. **Landing page** (before redirect to dashboard)
- Optional route: `/` as a one-screen landing: “The Aladdin of Africa”, “Wealth Operating System”, 3–4 value props, CTA “Enter Nautilus” → `/dashboard`.
- Sets tone for first-time visitors.

### 8. **Co-Pilot: “See the work”**
- Hebbia: “Trace every action that AI takes.”
- In Co-Pilot, make “Steps” (or “How this was derived”) more prominent; optional “View trace” per answer.
- Even static copy: “Every answer is traceable to source documents.”

### 9. **Starter templates / questions in empty workspace**
- When grid is empty, show clickable chips: “M&A Deal Points”, “IC Memo”, “Due Diligence” → create workspace with suggested columns or open a template.
- Reduces blank-page friction.

### 10. **Keyboard shortcuts**
- `Cmd+K` (or `Ctrl+K`): command palette — “Go to Dashboard”, “New workspace”, “Open Document Intelligence”.
- Power-user signal.

### 11. **Dark mode**
- Toggle in Settings or header; institutional / terminal aesthetic.
- Use existing CSS variables for theming.

---

## Stretch / platform signal

### 12. **API Storefront page** (Nautilus V1: “Marquee blueprint”)
- Static “Developers” or “API” page: mock endpoints e.g. `GET /v1/workspaces`, `POST /v1/export` with short descriptions.
- Positions Nautilus as platform, not just app.

### 13. **Shariah / ESG placeholder**
- Settings or “More”: “Shariah & ESG guardrails — Coming soon” with one line from Nautilus (e.g. “Scan all underlying assets for AAOIFI compliance”).

### 14. **Multi-currency hint**
- Nautilus V1: “NGN, USD, Gold-backed; devaluation-adjusted returns.”
- One stat or report option: “View in NGN / USD” or “Real-return analytics (coming soon).”

---

## Suggested order

1. **Trust bar** + **Metadata/Nigeria** (favicon, description, one ₦ or NGX mention).
2. **Dashboard use-case cards** (4–6 cards, link to workspace).
3. **Query bar** above matrix (opens Co-Pilot with query).
4. **More modules one-liners** (tooltips or Platform page).

Implementing (1) and (2) gives the biggest “this is serious” lift for relatively little code.
