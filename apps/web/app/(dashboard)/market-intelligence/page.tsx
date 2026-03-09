"use client";

import { useState } from "react";
import ModuleShell from "@/components/ModuleShell";

const RESEARCH = [
  {
    id: "r1",
    type: "Equity research",
    title: "Dangote Cement: Volume recovery and FX tailwind driving margin expansion",
    source: "Cordros Research",
    date: "Mar 6, 2026",
    sentiment: "Positive",
    summary: "Cement volumes recovered strongly in Q4 2025 following the infrastructure spend uptick. Management guided for 18% EBITDA margin expansion in FY2026 as FX headwinds moderate and energy costs stabilise. Key risk: sustained logistics disruption in the North.",
    tags: ["DANGCEM", "Industrials", "Buy"],
  },
  {
    id: "r2",
    type: "Macro",
    title: "CBN holds MPR at 27.5% — rate cycle peaking signals Q2 pivot",
    source: "Cordros Macro",
    date: "Mar 5, 2026",
    sentiment: "Neutral",
    summary: "The CBN maintained the Monetary Policy Rate at 27.5% at its February 2026 MPC meeting. Committee minutes point to inflation peaking at 32.1% in January 2026. Analysts now expect a 150bps cut by Q3 2026 which would be positive for fixed income duration and equity multiples.",
    tags: ["Macro", "CBN", "Fixed income"],
  },
  {
    id: "r3",
    type: "Sector note",
    title: "Nigerian banking sector: NIM compression risk from rate normalisation",
    source: "Cordros Research",
    date: "Mar 4, 2026",
    sentiment: "Cautious",
    summary: "Banks benefited from elevated rates in 2024–25. A rate normalisation cycle in H2 2026 could compress NIMs by 80–120bps. Top picks remain GTCO and Zenith on strong CET1 ratios and diversified fee income. Avoid banks with high FX loan books.",
    tags: ["Banking", "GTCO", "ZENITH", "NIM"],
  },
  {
    id: "r4",
    type: "Regulatory alert",
    title: "SEC Nigeria issues new guidelines on collective investment scheme disclosure",
    source: "SEC Nigeria",
    date: "Mar 3, 2026",
    sentiment: "Watch",
    summary: "SEC Nigeria has issued updated guidelines requiring enhanced investor disclosure for all collective investment schemes effective Q2 2026. Fund managers must publish risk-adjusted performance comparisons against approved benchmarks. Compliance deadline: 30 April 2026.",
    tags: ["Regulatory", "SEC", "Compliance"],
  },
  {
    id: "r5",
    type: "Deal intelligence",
    title: "Flour Mills Nigeria acquires Honeywell Flour Mills assets — sector consolidation",
    source: "M&A Monitor",
    date: "Mar 2, 2026",
    sentiment: "Positive",
    summary: "The completion of the Flour Mills/Honeywell consolidation creates a dominant player with ~42% flour market share. Synergy targets of ₦8bn over 3 years cited by management. Watch for further Consumer Goods sector consolidation driven by FX and logistics costs.",
    tags: ["FLOURMILL", "M&A", "Consumer Goods"],
  },
];

const COMPETITORS = [
  { name: "Stanbic IBTC Asset Management", aum: "₦4.1tn", change: "+12%", focus: "Balanced / Fixed income", sentiment: "Neutral" },
  { name: "ARM Investment Managers", aum: "₦1.8tn", change: "+8%", focus: "Equity / Multi-asset", sentiment: "Positive" },
  { name: "FBNQuest Asset Management", aum: "₦2.3tn", change: "+5%", focus: "Fixed income / Money market", sentiment: "Neutral" },
  { name: "Chapel Hill Denham", aum: "₦0.9tn", change: "+19%", focus: "PE / Alternatives", sentiment: "Positive" },
  { name: "FSDH Asset Management", aum: "₦0.6tn", change: "-2%", focus: "Money market", sentiment: "Cautious" },
];

const SENT_COLOR: Record<string, string> = {
  Positive: "bg-emerald-100 text-emerald-800",
  Cautious: "bg-amber-100 text-amber-800",
  Neutral: "bg-slate-100 text-slate-700",
  Watch: "bg-blue-100 text-blue-800",
};

export default function MarketIntelligencePage() {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"research" | "competitors">("research");

  const filtered = RESEARCH.filter(
    (r) =>
      !query ||
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
      r.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ModuleShell
      title="Market Intelligence"
      subtitle="Research console, AI summaries, news, and competitor monitoring"
      action={{ label: "Document Intelligence", href: "/workspace" }}
    >
      <div className="space-y-5 max-w-4xl">
        {/* Tab nav */}
        <div className="flex gap-1 border-b border-slate-200">
          {(["research", "competitors"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-teal-600 text-teal-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab === "research" ? "Research & news" : "Competitor monitoring"}
            </button>
          ))}
        </div>

        {activeTab === "research" && (
          <>
            <div className="flex gap-3">
              <input
                type="search"
                placeholder="Filter by ticker, theme, sector, or type…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-white"
              />
            </div>

            <div className="space-y-3">
              {filtered.map((r) => (
                <div key={r.id} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div
                    className="px-5 py-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                    onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{r.type}</span>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${SENT_COLOR[r.sentiment] ?? "bg-slate-100 text-slate-700"}`}>
                            {r.sentiment}
                          </span>
                        </div>
                        <p className="font-semibold text-slate-900 leading-snug">{r.title}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                          <span>{r.source}</span>
                          <span>·</span>
                          <span>{r.date}</span>
                        </div>
                      </div>
                      <svg
                        className={`w-4 h-4 text-slate-400 shrink-0 mt-1 transition-transform ${expanded === r.id ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {expanded === r.id && (
                    <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4 space-y-3">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded bg-teal-500 flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-teal-700 mb-0.5">AI Summary</p>
                          <p className="text-sm text-slate-700 leading-relaxed">{r.summary}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {r.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-1">
                        <a
                          href="/workspace"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                        >
                          Open in Document Intelligence
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="text-slate-500 text-sm py-4">No research matches your filter.</p>
              )}
            </div>
          </>
        )}

        {activeTab === "competitors" && (
          <section className="space-y-4">
            <p className="text-sm text-slate-600">
              AUM and sentiment tracking for key Nigerian asset managers. Data sourced from public filings and SEC Nigeria disclosures.
            </p>
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Manager</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-700">AUM</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-700">YoY change</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Focus</th>
                    <th className="text-center px-4 py-3 font-medium text-slate-700">Outlook</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPETITORS.map((c) => (
                    <tr key={c.name} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                      <td className="px-4 py-3 text-right text-slate-700 font-semibold">{c.aum}</td>
                      <td className={`px-4 py-3 text-right font-medium ${c.change.startsWith("+") ? "text-emerald-600" : "text-red-600"}`}>
                        {c.change}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{c.focus}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${SENT_COLOR[c.sentiment] ?? "bg-slate-100 text-slate-700"}`}>
                          {c.sentiment}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500">
              AUM figures from latest public filings. Sentiment assessed from research and fund flow signals. Source: SEC Nigeria, fund manager disclosures.
            </p>
          </section>
        )}
      </div>
    </ModuleShell>
  );
}
