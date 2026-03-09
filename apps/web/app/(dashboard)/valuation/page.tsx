"use client";

import { useState } from "react";
import ModuleShell from "@/components/ModuleShell";
import Link from "next/link";

const COMPS = [
  { name: "Dangote Cement", ticker: "DANGCEM", ev: "₦3.4tn", ebitda: "₦310bn", evEbitda: "11.0x", pe: "14.2x", ey: "7.0%", premium: "—" },
  { name: "BUA Cement", ticker: "BUACEMENT", ev: "₦2.1tn", ebitda: "₦198bn", evEbitda: "10.6x", pe: "13.5x", ey: "7.4%", premium: "-3.6%" },
  { name: "Lafarge Africa", ticker: "WAPCO", ev: "₦0.9tn", ebitda: "₦87bn", evEbitda: "10.3x", pe: "12.1x", ey: "8.3%", premium: "-6.4%" },
  { name: "Sector median", ticker: "—", ev: "—", ebitda: "—", evEbitda: "10.6x", pe: "13.5x", ey: "7.4%", premium: "Benchmark" },
];

const DCF_DEFAULTS = {
  revenue: "₦1,240bn",
  ebitdaMargin: "24",
  terminalGrowth: "5",
  wacc: "18",
  exitMultiple: "10",
  years: "5",
};

const SENSITIVITY_WACC = [16, 17, 18, 19, 20];
const SENSITIVITY_GROWTH = [3, 4, 5, 6, 7];

function calcDCFValue(wacc: number, growth: number): string {
  const base = 1_350_000; // ₦m
  const adj = base * (1 + (18 - wacc) * 0.06) * (1 + (growth - 5) * 0.04);
  return `₦${(adj / 1000).toFixed(0)}bn`;
}

export default function ValuationPage() {
  const [activeTab, setActiveTab] = useState<"dcf" | "comps" | "sensitivity">("dcf");
  const [dcf, setDcf] = useState(DCF_DEFAULTS);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<null | { range: string; midpoint: string; impliedPE: string; impliedEvEbitda: string }>(null);

  const runDCF = () => {
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      setRunning(false);
      setResult({
        range: "₦1,180bn — ₦1,490bn",
        midpoint: "₦1,335bn",
        impliedPE: "13.1x",
        impliedEvEbitda: "10.8x",
      });
    }, 1400);
  };

  return (
    <ModuleShell
      title="Valuation"
      subtitle="DCF model inputs, trading comps, and sensitivity analysis"
      action={{ label: "Document Intelligence", href: "/workspace" }}
    >
      <div className="space-y-5 max-w-4xl">
        <p className="text-sm text-slate-600">
          Deal or portfolio company valuation. Enter DCF assumptions, review trading comps, and run a sensitivity grid. Export outputs via <Link href="/workspace" className="text-teal-600 hover:underline">Document Intelligence</Link>.
        </p>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200">
          {(["dcf", "comps", "sensitivity"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-teal-600 text-teal-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab === "dcf" ? "DCF model" : tab === "comps" ? "Trading comps" : "Sensitivity"}
            </button>
          ))}
        </div>

        {activeTab === "dcf" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Model inputs — Project Alpha (Industrials)</p>

              {[
                { key: "revenue" as const, label: "LTM Revenue", placeholder: "₦1,240bn" },
                { key: "ebitdaMargin" as const, label: "EBITDA margin (%)", placeholder: "24" },
                { key: "wacc" as const, label: "WACC (%)", placeholder: "18" },
                { key: "terminalGrowth" as const, label: "Terminal growth rate (%)", placeholder: "5" },
                { key: "exitMultiple" as const, label: "Exit EV/EBITDA multiple", placeholder: "10" },
                { key: "years" as const, label: "Forecast years", placeholder: "5" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-slate-700 mb-1">{label}</label>
                  <input
                    type="text"
                    value={dcf[key]}
                    onChange={(e) => setDcf((prev) => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={runDCF}
                disabled={running}
                className="w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 transition-colors"
              >
                {running ? "Running DCF…" : "Run DCF valuation"}
              </button>
            </div>

            <div className="space-y-4">
              {result ? (
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Valuation output</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Equity value range</span>
                      <span className="font-semibold text-slate-900">{result.range}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Midpoint</span>
                      <span className="font-bold text-xl text-teal-700">{result.midpoint}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Implied P/E</span>
                      <span className="font-semibold text-slate-900">{result.impliedPE}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-sm text-slate-600">Implied EV/EBITDA</span>
                      <span className="font-semibold text-slate-900">{result.impliedEvEbitda}</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-teal-50 border border-teal-100 px-3 py-2 text-xs text-teal-700">
                    Midpoint is in line with sector median (10.6x EV/EBITDA). Run sensitivity tab for WACC / growth range.
                  </div>
                  <Link
                    href="/workspace"
                    className="block text-center px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                  >
                    Export to IC Memo workspace
                  </Link>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
                  Enter inputs and run the DCF to see valuation output here.
                </div>
              )}

              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Assumptions checklist</p>
                <ul className="space-y-1.5 text-sm text-slate-600">
                  {[
                    "Revenue sourced from FY2025 Annual Report (DocuFlow)",
                    "WACC computed using NGN risk-free rate 16.5%",
                    "Terminal growth based on Nigerian nominal GDP forecast",
                    "Exit multiple benchmarked to sector comps",
                  ].map((a, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">✓</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "comps" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Trading comparables for Nigerian industrials / cement sector. Source: NGX filings, last traded prices.</p>
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Company</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-700">EV</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-700">EBITDA</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-700">EV/EBITDA</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-700">P/E</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-700">Earnings yield</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-700">Premium vs median</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPS.map((c, i) => (
                    <tr key={c.ticker} className={`border-b border-slate-100 hover:bg-slate-50/50 ${i === COMPS.length - 1 ? "bg-slate-50/80 font-semibold" : ""}`}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{c.name}</p>
                        <p className="text-xs text-slate-500">{c.ticker}</p>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-700">{c.ev}</td>
                      <td className="px-4 py-3 text-right text-slate-700">{c.ebitda}</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">{c.evEbitda}</td>
                      <td className="px-4 py-3 text-right text-slate-700">{c.pe}</td>
                      <td className="px-4 py-3 text-right text-slate-700">{c.ey}</td>
                      <td className={`px-4 py-3 text-right font-medium ${c.premium.startsWith("-") ? "text-amber-600" : c.premium === "—" ? "text-slate-900" : "text-slate-600"}`}>
                        {c.premium}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500">Source: NGX, company filings. Last updated Mar 6, 2026. All multiples on FY2025 consensus estimates.</p>
          </div>
        )}

        {activeTab === "sensitivity" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Equity value (₦bn) sensitivity to WACC (rows) and terminal growth rate (columns). Midpoint inputs: WACC 18%, growth 5%.
            </p>
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left font-medium text-slate-700">WACC \ Growth</th>
                    {SENSITIVITY_GROWTH.map((g) => (
                      <th key={g} className={`px-4 py-3 text-center font-medium ${g === 5 ? "text-teal-700 bg-teal-50" : "text-slate-700"}`}>{g}%</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SENSITIVITY_WACC.map((w) => (
                    <tr key={w} className="border-b border-slate-100">
                      <td className={`px-4 py-3 font-medium ${w === 18 ? "text-teal-700 bg-teal-50" : "text-slate-700"}`}>{w}%</td>
                      {SENSITIVITY_GROWTH.map((g) => {
                        const val = calcDCFValue(w, g);
                        const isCenter = w === 18 && g === 5;
                        const numericVal = parseInt(val.replace(/[^\d]/g, ""));
                        const isHigh = numericVal > 1400;
                        const isLow = numericVal < 1200;
                        return (
                          <td
                            key={g}
                            className={`px-4 py-3 text-center font-medium ${
                              isCenter ? "bg-teal-100 text-teal-800 rounded" :
                              isHigh ? "text-emerald-700" :
                              isLow ? "text-red-700" :
                              "text-slate-700"
                            }`}
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500">Based on DCF model inputs. Green = above base case, Red = below base case. Centre cell (teal) = base case.</p>
          </div>
        )}
      </div>
    </ModuleShell>
  );
}
