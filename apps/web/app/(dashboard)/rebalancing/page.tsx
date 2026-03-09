"use client";

import { useState } from "react";
import ModuleShell from "@/components/ModuleShell";
import { useFund } from "@/contexts/FundContext";

const ALLOCATIONS = [
  { name: "Dangote Cement", sector: "Industrials", current: 12.4, target: 10.0, drift: 2.4, action: "Sell", actionSize: "₦406m" },
  { name: "MTN Nigeria", sector: "Telecoms", current: 10.2, target: 12.0, drift: -1.8, action: "Buy", actionSize: "₦305m" },
  { name: "GTCO", sector: "Financials", current: 8.8, target: 9.0, drift: -0.2, action: "Hold", actionSize: "—" },
  { name: "Zenith Bank", sector: "Financials", current: 7.5, target: 8.0, drift: -0.5, action: "Buy", actionSize: "₦85m" },
  { name: "Airtel Africa", sector: "Telecoms", current: 6.1, target: 6.0, drift: 0.1, action: "Hold", actionSize: "—" },
  { name: "BUA Cement", sector: "Industrials", current: 5.9, target: 4.0, drift: 1.9, action: "Sell", actionSize: "₦322m" },
  { name: "Nestlé Nigeria", sector: "Consumer Goods", current: 4.7, target: 5.0, drift: -0.3, action: "Buy", actionSize: "₦51m" },
  { name: "FGN Bonds", sector: "Fixed Income", current: 22.6, target: 25.0, drift: -2.4, action: "Buy", actionSize: "₦406m" },
  { name: "Cash & T-Bills", sector: "Cash", current: 21.8, target: 21.0, drift: 0.8, action: "Hold", actionSize: "—" },
];

const DRIFT_THRESHOLD = 1.5;

const SIM_RESULT = {
  tradeCount: 6,
  estimatedCost: "₦12.4m",
  postRebalanceTracking: "1.9%",
  largestTrade: "Dangote Cement — Sell ₦406m",
  compliance: "All trades within mandate and SEC limits",
};

export default function RebalancingPage() {
  const fund = useFund();
  const [simOpen, setSimOpen] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [simDone, setSimDone] = useState(false);
  const [filterDrift, setFilterDrift] = useState(false);

  const runSim = () => {
    setSimLoading(true);
    setSimDone(false);
    setTimeout(() => {
      setSimLoading(false);
      setSimDone(true);
    }, 1500);
  };

  const rows = filterDrift
    ? ALLOCATIONS.filter((a) => Math.abs(a.drift) >= DRIFT_THRESHOLD)
    : ALLOCATIONS;

  const breachCount = ALLOCATIONS.filter((a) => Math.abs(a.drift) >= DRIFT_THRESHOLD).length;

  return (
    <ModuleShell
      title="Rebalancing"
      subtitle="Allocation vs target, drift detection, and pre-trade simulation"
      action={{ label: "Portfolios", href: "/portfolios" }}
    >
      <div className="space-y-5 max-w-4xl">
        {/* Fund context */}
        <p className="text-sm text-slate-600">
          {fund ? (
            <span>Rebalancing <span className="font-medium text-slate-800">{fund.fundName}</span></span>
          ) : "Select a fund in the header for fund-level rebalancing."}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Positions</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{ALLOCATIONS.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Drift breaches</p>
            <p className={`mt-1 text-2xl font-bold ${breachCount > 0 ? "text-amber-600" : "text-emerald-600"}`}>{breachCount}</p>
            <p className="text-xs text-slate-500 mt-0.5">&gt;{DRIFT_THRESHOLD}% from target</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tracking error</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">4.2%</p>
            <p className="text-xs text-slate-500 mt-0.5">vs NGX All-Share</p>
          </div>
        </div>

        {/* Alert if drift breaches */}
        {breachCount > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>
              <span className="font-semibold">{breachCount} positions</span> have drifted beyond the {DRIFT_THRESHOLD}% threshold. Run a simulation before trading.
            </span>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterDrift}
              onChange={(e) => setFilterDrift(e.target.checked)}
              className="rounded border-slate-300 text-teal-600"
            />
            Show only drift breaches
          </label>
          <button
            type="button"
            onClick={() => { setSimOpen(true); setSimDone(false); }}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 transition-colors"
          >
            Run rebalance simulation
          </button>
        </div>

        {/* Allocation table */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 font-medium text-slate-700">Position</th>
                <th className="text-left px-4 py-3 font-medium text-slate-700">Sector</th>
                <th className="text-right px-4 py-3 font-medium text-slate-700">Current</th>
                <th className="text-right px-4 py-3 font-medium text-slate-700">Target</th>
                <th className="text-right px-4 py-3 font-medium text-slate-700">Drift</th>
                <th className="text-center px-4 py-3 font-medium text-slate-700">Action</th>
                <th className="text-right px-4 py-3 font-medium text-slate-700">Trade size</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name} className={`border-b border-slate-100 hover:bg-slate-50/50 ${Math.abs(row.drift) >= DRIFT_THRESHOLD ? "bg-amber-50/30" : ""}`}>
                  <td className="px-4 py-3 font-medium text-slate-800">{row.name}</td>
                  <td className="px-4 py-3 text-slate-600">{row.sector}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{row.current}%</td>
                  <td className="px-4 py-3 text-right text-slate-600">{row.target}%</td>
                  <td className={`px-4 py-3 text-right font-medium ${row.drift > 0 ? "text-red-600" : row.drift < -0.5 ? "text-blue-600" : "text-slate-500"}`}>
                    {row.drift > 0 ? `+${row.drift}%` : `${row.drift}%`}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      row.action === "Sell" ? "bg-red-100 text-red-800" :
                      row.action === "Buy" ? "bg-emerald-100 text-emerald-800" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {row.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700 font-medium">{row.actionSize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Simulation modal */}
        {simOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSimOpen(false)}>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-semibold text-slate-900 text-base mb-1">Rebalance simulation</h3>
              <p className="text-sm text-slate-500 mb-4">Simulate all required trades to bring the portfolio back to target within mandate constraints.</p>

              {!simLoading && !simDone && (
                <button
                  type="button"
                  onClick={runSim}
                  className="w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-teal-600 text-white hover:bg-teal-700"
                >
                  Run simulation
                </button>
              )}
              {simLoading && <p className="text-sm text-slate-500 text-center py-4">Running simulation…</p>}
              {simDone && (
                <div className="space-y-3">
                  <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3">
                    <p className="text-sm font-semibold text-emerald-800 mb-2">Simulation complete</p>
                    <dl className="space-y-1 text-sm text-emerald-700">
                      <div className="flex justify-between"><dt>Trades required</dt><dd className="font-semibold">{SIM_RESULT.tradeCount}</dd></div>
                      <div className="flex justify-between"><dt>Estimated transaction cost</dt><dd className="font-semibold">{SIM_RESULT.estimatedCost}</dd></div>
                      <div className="flex justify-between"><dt>Post-rebalance tracking error</dt><dd className="font-semibold">{SIM_RESULT.postRebalanceTracking}</dd></div>
                      <div className="flex justify-between"><dt>Largest trade</dt><dd className="font-semibold text-right max-w-[180px]">{SIM_RESULT.largestTrade}</dd></div>
                    </dl>
                  </div>
                  <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2 text-xs text-slate-600">
                    {SIM_RESULT.compliance}
                  </div>
                  <a
                    href="/oms"
                    className="block w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-900 text-white text-center hover:bg-slate-800"
                  >
                    Send to Order Management
                  </a>
                </div>
              )}
              <button onClick={() => setSimOpen(false)} className="mt-3 w-full px-4 py-2 rounded-lg text-sm border border-slate-200 text-slate-600 hover:bg-slate-50">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </ModuleShell>
  );
}
