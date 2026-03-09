"use client";

import { useState } from "react";
import ModuleShell from "@/components/ModuleShell";
import { useFund } from "@/contexts/FundContext";
import Link from "next/link";

const ATTRIBUTION = [
  { sector: "Financials", weight: "28.4%", contribution: "+1.82%", activeWeight: "+6.4%", status: "overweight" },
  { sector: "Telecoms", weight: "16.2%", contribution: "+0.94%", activeWeight: "+2.1%", status: "overweight" },
  { sector: "Industrials", weight: "14.8%", contribution: "+1.05%", activeWeight: "+0.8%", status: "neutral" },
  { sector: "Consumer Goods", weight: "11.3%", contribution: "-0.22%", activeWeight: "-3.2%", status: "underweight" },
  { sector: "Oil & Gas", weight: "8.9%", contribution: "+0.61%", activeWeight: "-1.1%", status: "underweight" },
  { sector: "Agriculture", weight: "5.4%", contribution: "+0.18%", activeWeight: "+1.4%", status: "overweight" },
  { sector: "Healthcare", weight: "3.2%", contribution: "+0.09%", activeWeight: "+0.3%", status: "neutral" },
  { sector: "Cash & Other", weight: "11.8%", contribution: "+0.04%", activeWeight: "-6.7%", status: "underweight" },
];

const RISK_METRICS = [
  { label: "VaR (95%, 1-day)", value: "₦284m", sub: "Based on 252-day historical simulation" },
  { label: "Tracking Error (annualised)", value: "4.2%", sub: "vs NGX All-Share benchmark" },
  { label: "Sharpe Ratio", value: "1.34", sub: "Rolling 12-month" },
  { label: "Beta", value: "0.87", sub: "vs NGX All-Share" },
  { label: "Max Drawdown (12m)", value: "-8.3%", sub: "Peak-to-trough, FY2024" },
  { label: "Information Ratio", value: "0.61", sub: "Active return / tracking error" },
];

const PERF = [
  { period: "MTD", fund: "+1.2%", benchmark: "+0.8%", alpha: "+0.4%" },
  { period: "QTD", fund: "+4.8%", benchmark: "+3.6%", alpha: "+1.2%" },
  { period: "YTD", fund: "+11.4%", benchmark: "+8.9%", alpha: "+2.5%" },
  { period: "1Y", fund: "+18.7%", benchmark: "+14.2%", alpha: "+4.5%" },
  { period: "3Y (ann.)", fund: "+14.1%", benchmark: "+10.3%", alpha: "+3.8%" },
  { period: "Since inception", fund: "+22.4%", benchmark: "+15.8%", alpha: "+6.6%" },
];

const PERIODS = ["MTD", "QTD", "YTD", "1Y"] as const;

export default function AnalyticsPage() {
  const fund = useFund();
  const [period, setPeriod] = useState<string>("YTD");
  const [activeTab, setActiveTab] = useState<"attribution" | "risk" | "performance">("attribution");

  const perf = PERF.find((p) => p.period === period) ?? PERF[2];

  return (
    <ModuleShell
      title="Analytics"
      subtitle="Performance attribution, risk metrics, and fund analysis"
      action={{ label: "Reports", href: "/reports" }}
    >
      <div className="space-y-6 max-w-4xl">
        {/* Fund context */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            {fund ? (
              <span>Analysing <span className="font-medium text-slate-800">{fund.fundName}</span></span>
            ) : (
              "Select a fund in the header for fund-level analytics."
            )}
          </p>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden text-sm">
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  period === p ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Fund return ({period})</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">{perf.fund}</p>
            <p className="text-xs text-slate-500 mt-0.5">Benchmark {perf.benchmark}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Alpha ({period})</p>
            <p className="mt-1 text-2xl font-bold text-teal-600">{perf.alpha}</p>
            <p className="text-xs text-slate-500 mt-0.5">vs NGX All-Share</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Sharpe Ratio (12m)</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">1.34</p>
            <p className="text-xs text-slate-500 mt-0.5">Risk-adjusted return</p>
          </div>
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 border-b border-slate-200">
          {(["attribution", "risk", "performance"] as const).map((tab) => (
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
              {tab === "attribution" ? "Attribution" : tab === "risk" ? "Risk" : "Performance"}
            </button>
          ))}
        </div>

        {/* Attribution tab */}
        {activeTab === "attribution" && (
          <section>
            <p className="text-sm text-slate-600 mb-3">
              Return contribution by sector, active weight vs NGX All-Share benchmark. Data: FY2024 positions.
            </p>
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Sector</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-700">Weight</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-700">Contribution</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-700">Active weight</th>
                    <th className="text-center px-4 py-3 font-medium text-slate-700">Stance</th>
                  </tr>
                </thead>
                <tbody>
                  {ATTRIBUTION.map((row) => (
                    <tr key={row.sector} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-800">{row.sector}</td>
                      <td className="px-4 py-3 text-right text-slate-700">{row.weight}</td>
                      <td className={`px-4 py-3 text-right font-medium ${row.contribution.startsWith("+") ? "text-emerald-600" : "text-red-600"}`}>
                        {row.contribution}
                      </td>
                      <td className={`px-4 py-3 text-right ${row.activeWeight.startsWith("+") ? "text-emerald-600" : "text-red-600"}`}>
                        {row.activeWeight}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          row.status === "overweight" ? "bg-emerald-100 text-emerald-800" :
                          row.status === "underweight" ? "bg-amber-100 text-amber-800" :
                          "bg-slate-100 text-slate-700"
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 mt-2">Source: IBOR positions as of last NAV date. Benchmark: NGX All-Share Index.</p>
          </section>
        )}

        {/* Risk tab */}
        {activeTab === "risk" && (
          <section>
            <p className="text-sm text-slate-600 mb-3">
              Risk metrics for the current fund. VaR based on 252-day historical simulation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {RISK_METRICS.map((m) => (
                <div key={m.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{m.label}</p>
                  <p className="mt-1 text-xl font-bold text-slate-900">{m.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{m.sub}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <span className="font-semibold">Concentration alert:</span> Financials sector at 28.4% — approaching 30% mandate concentration limit. Review mandate before next rebalance.
            </div>
          </section>
        )}

        {/* Performance tab */}
        {activeTab === "performance" && (
          <section>
            <p className="text-sm text-slate-600 mb-3">
              Fund return vs NGX All-Share benchmark across periods. All returns are total return, gross of fees.
            </p>
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Period</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-700">Fund</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-700">Benchmark</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-700">Alpha</th>
                  </tr>
                </thead>
                <tbody>
                  {PERF.map((row) => (
                    <tr key={row.period} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-800">{row.period}</td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-600">{row.fund}</td>
                      <td className="px-4 py-3 text-right text-slate-600">{row.benchmark}</td>
                      <td className="px-4 py-3 text-right font-semibold text-teal-600">{row.alpha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              All returns gross of fees, total return basis. Benchmark: NGX All-Share Index. Full attribution export available via <Link href="/reports" className="text-teal-600 hover:underline">Reports</Link>.
            </p>
          </section>
        )}
      </div>
    </ModuleShell>
  );
}
