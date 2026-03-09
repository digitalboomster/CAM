"use client";

import { useState, useEffect, useCallback } from "react";
import ModuleShell from "@/components/ModuleShell";
import CitationPanel from "@/components/CitationPanel";
import * as api from "@/lib/api";
import type { DealTarget } from "@/lib/api";

type TargetCategory = "All" | "Industrials" | "Financials" | "Consumer" | "Energy" | "Tech";
type TargetWithMeta = DealTarget & { category: Exclude<TargetCategory, "All">; score: number };

const MOCK_TARGETS: DealTarget[] = [
  {
    id: "t-001",
    name: "Apex Industrials Plc",
    summary:
      "Mid-cap industrials consolidator with pan-Nigeria distribution. Margin expansion opportunity from energy efficiency.",
    marketMultiple: "10.8× EV/EBITDA",
    regulatoryFlag: "Under review",
    sourceRef: "Project Alpha CIM v3",
    sourceDetail: "§8 Risk Factors: 'Customer concentration and regulatory exposure in Nigeria/Ghana/Kenya.'",
    createdAt: "2026-03-01T09:00:00.000Z",
  },
  {
    id: "t-002",
    name: "Sahara Consumer Group",
    summary:
      "Staples platform with resilient cash flows. Pricing power tested by FX-driven input cost inflation.",
    marketMultiple: "14.2× P/E",
    regulatoryFlag: "Clean",
    sourceRef: "Board Strategy Deck Q4 2025",
    sourceDetail: "Slide 7: 'Revenue trajectory and margin drivers; pricing discipline highlighted.'",
    createdAt: "2026-02-27T13:20:00.000Z",
  },
  {
    id: "t-003",
    name: "NilePay (Fintech)",
    summary: "Payments + SME credit infrastructure. High growth but licence dependency and KYC/AML scrutiny.",
    marketMultiple: "3.1× EV/Revenue",
    regulatoryFlag: "Flagged",
    sourceRef: "Legal Due Diligence Summary",
    sourceDetail:
      "p.4 Corporate & Regulatory: 'Licences and approvals reviewed; compliance certificates required for expansion.'",
    createdAt: "2026-02-18T16:05:00.000Z",
  },
];

function categoryForTarget(t: DealTarget): Exclude<TargetCategory, "All"> {
  const s = `${t.name} ${t.summary ?? ""}`.toLowerCase();
  if (s.includes("bank") || s.includes("financial") || s.includes("insurance")) return "Financials";
  if (s.includes("cement") || s.includes("industrial") || s.includes("manufact")) return "Industrials";
  if (s.includes("consumer") || s.includes("staple") || s.includes("retail")) return "Consumer";
  if (s.includes("energy") || s.includes("power") || s.includes("oil") || s.includes("gas")) return "Energy";
  return "Tech";
}

function scoreForTarget(t: DealTarget): number {
  const base = t.regulatoryFlag === "Clean" ? 78 : t.regulatoryFlag === "Under review" ? 68 : 55;
  const bonus =
    (t.marketMultiple ? 6 : 0) + Math.min(10, Math.floor(((t.summary ?? "").length || 0) / 40));
  return Math.min(92, base + bonus);
}

function scoreBadge(score: number): string {
  if (score >= 80) return "bg-emerald-100 text-emerald-800";
  if (score >= 65) return "bg-amber-100 text-amber-800";
  return "bg-slate-100 text-slate-700";
}

export default function DealSourcingPage() {
  const [targets, setTargets] = useState<DealTarget[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<TargetCategory>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [citation, setCitation] = useState<{ source: string; docRef: string; stepId?: number } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const list = await api.fetchDealTargets(query || undefined);
      setTargets(list);
    } catch {
      setError(true);
      setTargets([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    load();
  }, [load]);

  const showSource = (t: DealTarget) => {
    const source = t.sourceDetail ?? t.sourceRef ?? "No source detail.";
    const docRef = t.sourceRef ?? t.name;
    setCitation({ source, docRef });
  };

  const base: DealTarget[] = targets.length > 0 ? targets : MOCK_TARGETS;
  const withMeta: TargetWithMeta[] = base.map((t) => ({
    ...t,
    category: categoryForTarget(t),
    score: scoreForTarget(t),
  }));

  const filtered: TargetWithMeta[] = withMeta.filter((t) => {
    if (category !== "All" && t.category !== category) return false;
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return `${t.name} ${t.summary ?? ""} ${t.regulatoryFlag ?? ""} ${t.marketMultiple ?? ""}`
      .toLowerCase()
      .includes(q);
  });

  return (
    <ModuleShell
      title="Deal Sourcing"
      subtitle="AI-powered search, ranked targets, market multiples, source traceability"
      action={{ label: "Document Intelligence", href: "/workspace" }}
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="search"
              placeholder="Search targets by name, summary, or regulatory flag…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-nautilus-accent/20 focus:border-nautilus-accent outline-none bg-white"
            />
            <button
              type="button"
              onClick={load}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-nautilus-accent text-white hover:bg-nautilus-accent-hover shrink-0 shadow-sm"
            >
              Search
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">Filters</span>
            {(["All", "Industrials", "Financials", "Consumer", "Energy", "Tech"] as TargetCategory[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  category === c
                    ? "bg-nautilus-accent-muted text-nautilus-accent border-nautilus-accent/30"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {c}
              </button>
            ))}
            <span className="text-xs text-slate-400 ml-auto">
              Showing <span className="font-semibold text-slate-600">{filtered.length}</span> target{filtered.length !== 1 ? "s" : ""}
              {targets.length === 0 ? " (demo)" : ""}
            </span>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading…</p>
        ) : error ? (
          <p className="text-red-600">
            Failed to load targets. Run <code className="bg-slate-100 px-1 rounded">npm run db:setup</code> in apps/web and refresh.
          </p>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="font-semibold text-slate-900">No targets match</p>
            <p className="text-sm text-slate-500 mt-2">
              Try a different query or clear filters. For sample targets, run{" "}
              <code className="bg-slate-100 px-1 rounded">npm run db:seed</code> in{" "}
              <code className="bg-slate-100 px-1 rounded">apps/web</code>.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
                className="px-3 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Clear
              </button>
              <a
                href="/workspace"
                className="px-3 py-2 rounded-lg text-sm font-medium bg-nautilus-accent text-white hover:bg-nautilus-accent-hover shadow-sm"
              >
                Open Document Intelligence
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Fit score</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Summary</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Market multiple</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Regulatory</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-700">Source</th>
                </tr>
              </thead>
              <tbody>
                {filtered
                  .slice()
                  .sort((a, b) => b.score - a.score)
                  .map((t) => (
                    <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${scoreBadge(t.score)}`}
                          title="Demo scoring: regulatory + multiple + disclosure density"
                        >
                          {t.score}
                        </span>
                        <span className="ml-2 text-xs text-slate-400">{t.category}</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">{t.name}</td>
                      <td className="px-4 py-3 text-slate-600 max-w-xs truncate" title={t.summary ?? undefined}>
                        {t.summary ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{t.marketMultiple ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            t.regulatoryFlag === "Clean"
                              ? "bg-emerald-100 text-emerald-800"
                              : t.regulatoryFlag === "Flagged" || t.regulatoryFlag === "Under review"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {t.regulatoryFlag ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => showSource(t)}
                          className="text-nautilus-accent hover:underline font-medium"
                        >
                          View source
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-sm text-slate-500">
          Ranked list with source traceability. Click &quot;View source&quot; for citation detail. When the database is empty, Nautilus shows demo targets so the workflow is always usable.
        </p>
      </div>

      <CitationPanel citation={citation} explanation={null} onClose={() => setCitation(null)} />
    </ModuleShell>
  );
}
