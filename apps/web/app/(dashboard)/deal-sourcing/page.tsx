"use client";

import { useState, useEffect, useCallback } from "react";
import ModuleShell from "@/components/ModuleShell";
import CitationPanel from "@/components/CitationPanel";
import * as api from "@/lib/api";
import type { DealTarget } from "@/lib/api";

export default function DealSourcingPage() {
  const [targets, setTargets] = useState<DealTarget[]>([]);
  const [query, setQuery] = useState("");
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

  return (
    <ModuleShell
      title="Deal Sourcing"
      subtitle="AI-powered search, ranked targets, market multiples, source traceability"
      action={{ label: "Document Intelligence", href: "/workspace" }}
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            placeholder="Search targets by name, summary, or regulatory flag…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-white"
          />
          <button
            type="button"
            onClick={load}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 shrink-0"
          >
            Search
          </button>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading…</p>
        ) : error ? (
          <p className="text-red-600">
            Failed to load targets. Run <code className="bg-slate-100 px-1 rounded">npm run db:setup</code> in apps/web and refresh.
          </p>
        ) : targets.length === 0 ? (
          <p className="text-slate-600">No targets match. Try a different search or run <code className="bg-slate-100 px-1 rounded">npm run db:seed</code> to add sample targets.</p>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Summary</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Market multiple</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Regulatory</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-700">Source</th>
                </tr>
              </thead>
              <tbody>
                {targets.map((t) => (
                  <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50/50">
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
                        className="text-teal-600 hover:underline font-medium"
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
          Ranked list with source traceability. Click &quot;View source&quot; for citation detail. Data is from the Deal Sourcing seed; connect a live screener or API for production.
        </p>
      </div>

      <CitationPanel
        citation={citation}
        explanation={null}
        onClose={() => setCitation(null)}
      />
    </ModuleShell>
  );
}
