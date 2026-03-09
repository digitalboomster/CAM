# Nautilus design differentiation

To keep the same capabilities while reducing plagiarism and copyright risk, Nautilus is restructured so it does **not** look or read like a Hebbia clone.

## 1. Layout (structural change)

| Hebbia | Nautilus |
|--------|----------|
| Single main column: chat card **stacked above** grid | **Grid-first:** main area is the data table; conversation lives in a **right-side panel** (drawer) opened by "Co-Pilot" / "Ask" |
| Chat is always visible and dominant | Grid is the hero; co-pilot is contextual, toggleable |
| Two-block vertical stack | Split: content area (grid) + optional side panel (co-pilot) |

So the **information hierarchy** is different: we lead with the workspace data, not the conversation.

## 2. Naming (no Hebbia-specific terms)

| Hebbia | Nautilus |
|--------|----------|
| Matrix | **Workspace** |
| Matrix Agent | **Nautilus Co-Pilot** |
| Add documents | **Upload sources** |
| Add columns | **Add fields** |
| Add row | **Add source** (rows = sources) |
| Display | **View options** |
| Explore templates | **Templates** |
| Search matrices | **Find workspaces** |
| "Ask anything..." | **"Ask Co-Pilot..."** or **"Type a question..."** |

We avoid the word "Matrix" in the UI and use workspace/source/field language.

## 3. Visual identity (Cordros / Nautilus)

| Hebbia | Nautilus |
|--------|----------|
| Blue accent (#2563eb), light blue active state | **Teal/slate** primary (#0d9488); slate borders and panels |
| Rounded white chat *card* with shadow | Co-pilot as **flat right panel** with border-left, no floating card |
| Purple document-type pills | **Slate/teal-tinted pills** or same idea with our palette |
| Single accent color | Cordros/Nautilus palette: teal primary, slate neutrals |

Typography: we use a distinct stack (e.g. system font stack or a chosen sans) so the overall feel is not identical.

## 4. Interaction

- **Co-Pilot panel:** Opens from the right when the user clicks "Co-Pilot" or "Ask" in the top bar; can be closed to get full-width grid. No permanent chat block above the grid.
- **Grid:** Same behavior (sources as rows, fields as columns, citation on click, "Reading…", "Not in document, click to view explanation") but with our labels and styling.
- **Sidebar:** Same structure (nav, recent, projects) but labeled Workspaces / Templates / Find workspaces; no "matrices."

## 5. What stays the same (features)

- Document/source-centric grid with extraction columns
- Cited cells; click for source or explanation
- Loading state ("Reading…"); no-answer state with explanation
- Upload sources, add fields, add source (row)
- Conversation with an AI assistant and step transparency
- Recent list and projects/folders in the sidebar

Only layout, naming, and visual design are changed so Nautilus is clearly its own product.

---

## 6. Redesign (visual refresh)

To further differentiate from generic “Hebbia-like” product UIs:

- **Cordros accent:** Primary actions (Generate, Export, Send, finalize) use a dedicated accent color (`nautilus-accent`: red) so they read as institutional/primary rather than the same as nav teal. Teal remains for navigation, links, and secondary emphasis.
- **Chrome:** Sidebar logo area uses a dark block (slate-800) for the “N” mark and a two-line wordmark: **Nautilus** with **Cordros** underneath. Header has a light shadow and clearer fund selector styling.
- **CSS variables:** `globals.css` defines `--nautilus-bg`, `--nautilus-surface`, `--nautilus-accent`, etc., for future theming or dark mode.
- **Status badges:** Modules show **Live**, **Partial**, or **Coming soon** so it’s explicit which pages have full flows vs placeholders (see [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)).
