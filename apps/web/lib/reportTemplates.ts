import type { ModuleIconName } from "@/lib/types";

/** Report template options for Reports module. */
export const REPORT_TEMPLATES = [
  {
    id: "ic-memo",
    label: "IC Memo",
    description: "Full investment committee memo with executive summary, thesis, risks, valuation, and source citations.",
    iconKey: "clipboard" as ModuleIconName,
    tags: ["Investment", "Equity", "Credit"],
    estimatedPages: "4–6 pages",
    color: "violet",
  },
  {
    id: "dd-summary",
    label: "DD Summary",
    description: "Structured due diligence summary — risks, financials, legal flags, management assessment, and recommendation.",
    iconKey: "search" as ModuleIconName,
    tags: ["M&A", "PE", "Diligence"],
    estimatedPages: "6–10 pages",
    color: "blue",
  },
  {
    id: "committee-pack",
    label: "Committee Pack",
    description: "Comprehensive committee review pack with key extracts, charts, and annotated source references.",
    iconKey: "box" as ModuleIconName,
    tags: ["Governance", "Review"],
    estimatedPages: "10–15 pages",
    color: "teal",
  },
  {
    id: "ma-deal-points",
    label: "M&A Deal Points",
    description: "Side-by-side extraction of deal provisions, negotiation levers, and precedent comparisons.",
    iconKey: "lightning" as ModuleIconName,
    tags: ["M&A", "Legal", "Negotiation"],
    estimatedPages: "3–5 pages",
    color: "amber",
  },
  {
    id: "research-brief",
    label: "Research Brief",
    description: "Synthesised research brief across sector reports, earnings calls, and market data. Citation-backed.",
    iconKey: "chart" as ModuleIconName,
    tags: ["Research", "Sector", "Markets"],
    estimatedPages: "2–4 pages",
    color: "emerald",
  },
  {
    id: "mandate-report",
    label: "Mandate Adherence Report",
    description: "Institutional mandate compliance report for client reporting — position limits, drift, breaches.",
    iconKey: "building" as ModuleIconName,
    tags: ["Institutional", "Compliance"],
    estimatedPages: "3–4 pages",
    color: "indigo",
  },
] as const;

export type ReportTemplateId = (typeof REPORT_TEMPLATES)[number]["id"];
