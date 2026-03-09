"use client";

import { useState } from "react";
import ModuleShell from "@/components/ModuleShell";
import Link from "next/link";
import { useFund } from "@/contexts/FundContext";

const MOCK_PORTFOLIOS = [
  { id: "milestone-2023", name: "Cordros Milestone Fund 2023", mandate: "Equity growth, Nigeria & SSA", allocation: "Equity 78%, Cash 22%" },
  { id: "growth", name: "Cordros Growth Fund", mandate: "Multi-asset growth", allocation: "Equity 65%, Fixed income 25%, Cash 10%" },
  { id: "fixed-income", name: "Cordros Fixed Income Fund", mandate: "Capital preservation, yield", allocation: "Fixed income 85%, Cash 15%" },
];

const MOCK_FUND_METRICS: Record<string, { aum: string; nav: string; navAsOf: string; ytd: string; ytdUp: boolean }> = {
  "milestone-2023": { aum: "₦14.2bn", nav: "124.52", navAsOf: "Mar 8, 2026", ytd: "+12.4%", ytdUp: true },
  "growth": { aum: "₦8.7bn", nav: "18.76", navAsOf: "Mar 8, 2026", ytd: "+18.7%", ytdUp: true },
  "fixed-income": { aum: "₦22.1bn", nav: "9.31", navAsOf: "Mar 8, 2026", ytd: "+9.3%", ytdUp: true },
};

const MOCK_POSITIONS: Record<string, { name: string; sector: string; weight: string; value: string }[]> = {
  "milestone-2023": [
    { name: "Dangote Cement", sector: "Industrials", weight: "12.4%", value: "NGN 2.1bn" },
    { name: "MTN Nigeria", sector: "Telecoms", weight: "10.2%", value: "NGN 1.7bn" },
    { name: "GTCO", sector: "Financials", weight: "8.8%", value: "NGN 1.5bn" },
    { name: "Zenith Bank", sector: "Financials", weight: "7.5%", value: "NGN 1.3bn" },
    { name: "Cash & equivalents", sector: "—", weight: "22.0%", value: "NGN 3.7bn" },
  ],
  "growth": [
    { name: "Equity basket", sector: "Multi", weight: "65%", value: "—" },
    { name: "Fixed income", sector: "Bonds", weight: "25%", value: "—" },
    { name: "Cash", sector: "—", weight: "10%", value: "—" },
  ],
  "fixed-income": [
    { name: "FGN Bonds", sector: "Govt", weight: "60%", value: "—" },
    { name: "Corporate bonds", sector: "Corp", weight: "25%", value: "—" },
    { name: "Cash", sector: "—", weight: "15%", value: "—" },
  ],
};

export default function PortfoliosPage() {
  const fund = useFund();
  const [expandedId, setExpandedId] = useState<string | null>(fund?.fundId ?? null);
  const positions = expandedId ? MOCK_POSITIONS[expandedId] ?? [] : [];
  const metrics = expandedId ? MOCK_FUND_METRICS[expandedId] : null;

  return (
    <ModuleShell
      title="Portfolios"
      subtitle="Portfolio list, mandate, allocation, positions"
      action={{ label: "Dashboard", href: "/dashboard" }}
    >
      <div className="space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm bg-gradient-to-br from-slate-50 to-white">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Portfolio command view</p>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-slate-900">Whole Portfolio Engine</h2>
              <p className="text-sm text-slate-600 mt-1">
                {fund ? `Fund in context: ${fund.fundName}` : "Select a fund in the header to filter context."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/analytics" className="px-3 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50">
                Analytics
              </Link>
              <Link href="/rebalancing" className="px-3 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50">
                Rebalancing
              </Link>
              <Link href="/dashboard" className="px-3 py-2 rounded-lg text-sm font-medium bg-nautilus-accent text-white hover:bg-nautilus-accent-hover shadow-sm">
                Dashboard
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total AUM", value: "₦45.0bn", sub: "Across 3 funds" },
            { label: "Funds", value: "3", sub: "Active mandates" },
            { label: "Last NAV", value: metrics?.navAsOf ?? "Mar 8, 2026", sub: "As of close" },
            { label: "YTD (selected)", value: metrics?.ytd ?? "—", sub: expandedId ? "Selected fund" : "Pick a fund", up: metrics?.ytdUp ?? true },
          ].map((k) => (
            <div key={k.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{k.label}</p>
              <p className="mt-0.5 text-2xl font-bold text-slate-900">{k.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{k.sub}</p>
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-900">Allocation summary</h2>
              <p className="text-sm text-slate-600 mt-1">High-level exposure for the selected portfolio. Use Rebalancing to simulate drift correction.</p>
            </div>
            {metrics && (
              <div className="text-right">
                <p className="text-xs text-slate-500">Selected fund AUM</p>
                <p className="font-semibold text-slate-900">{metrics.aum}</p>
              </div>
            )}
          </div>

          <div className="mt-4 grid gap-3">
            {[
              { label: "Equity", pct: 76 },
              { label: "Fixed income", pct: 18 },
              { label: "Cash", pct: 6 },
            ].map((a) => (
              <div key={a.label} className="flex items-center gap-3">
                <span className="w-24 text-xs font-medium text-slate-600">{a.label}</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-teal-400 rounded-full" style={{ width: `${a.pct}%` }} />
                </div>
                <span className="w-12 text-right text-xs font-semibold text-slate-700">{a.pct}%</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">Demo values — connect to ABOR/IBOR feeds in production.</p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900 mb-3">Portfolio list</h2>
          <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden">
            {MOCK_PORTFOLIOS.map((p) => (
              <div key={p.id}>
                <div
                  className="px-4 py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50"
                  onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">{p.name}</p>
                    <p className="text-sm text-slate-600 mt-0.5">{p.mandate}</p>
                    <p className="text-xs text-slate-500 mt-1">Allocation: {p.allocation}</p>
                    {MOCK_FUND_METRICS[p.id] && (
                      <p className="text-xs text-slate-500 mt-1">
                        NAV {MOCK_FUND_METRICS[p.id].nav} · AUM {MOCK_FUND_METRICS[p.id].aum}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-400">
                      {expandedId === p.id ? "Hide positions" : "View positions"}
                    </span>
                    <svg
                      className={`w-4 h-4 text-slate-400 transition-transform ${expandedId === p.id ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {expandedId === p.id && positions.length > 0 && (
                  <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Positions</h3>
                    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50">
                            <th className="text-left px-3 py-2 font-medium text-slate-700">Name</th>
                            <th className="text-left px-3 py-2 font-medium text-slate-700">Sector</th>
                            <th className="text-right px-3 py-2 font-medium text-slate-700">Weight</th>
                            <th className="text-right px-3 py-2 font-medium text-slate-700">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {positions.map((pos, i) => (
                            <tr key={i} className="border-b border-slate-100 last:border-0">
                              <td className="px-3 py-2 text-slate-800">{pos.name}</td>
                              <td className="px-3 py-2 text-slate-600">{pos.sector}</td>
                              <td className="px-3 py-2 text-right text-slate-700">{pos.weight}</td>
                              <td className="px-3 py-2 text-right text-slate-600">{pos.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <p className="text-sm text-slate-500">
          Tip: Use <Link href="/analytics" className="text-nautilus-accent hover:underline font-medium">Analytics</Link> for attribution and
          <Link href="/rebalancing" className="text-nautilus-accent hover:underline font-medium"> Rebalancing</Link> for drift simulation.
        </p>
      </div>
    </ModuleShell>
  );
}
