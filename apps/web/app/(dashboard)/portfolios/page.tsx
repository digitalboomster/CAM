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

  return (
    <ModuleShell
      title="Portfolios"
      subtitle="Portfolio list, mandate, allocation, positions"
      action={{ label: "Dashboard", href: "/dashboard" }}
    >
      <div className="space-y-6">
        <p className="text-sm text-slate-600">
          {fund ? `Current fund in context: ${fund.fundName}` : "Select a fund in the header to filter context."}
        </p>

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
          <Link href="/dashboard" className="text-teal-600 hover:underline">Dashboard</Link> shows NAV and compliance for the selected fund.
        </p>
      </div>
    </ModuleShell>
  );
}
