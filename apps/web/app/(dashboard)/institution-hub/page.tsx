"use client";

import { useState } from "react";
import ModuleShell from "@/components/ModuleShell";
import Link from "next/link";

const CLIENTS = [
  {
    id: "c1",
    name: "Pension Fund Administrators Alliance",
    type: "PFA",
    aum: "₦48.2bn",
    mandate: "Capital preservation, max equity 30%",
    compliance: "compliant",
    lastReport: "Feb 28, 2026",
    contact: "Chidi Okonkwo",
    allocation: { equity: 27, fixed: 58, cash: 15 },
  },
  {
    id: "c2",
    name: "Lagos State Government Pension Fund",
    type: "Pension",
    aum: "₦22.6bn",
    mandate: "Balanced growth, max equity 40%",
    compliance: "watch",
    lastReport: "Feb 25, 2026",
    contact: "Adaeze Nwosu",
    allocation: { equity: 38, fixed: 48, cash: 14 },
  },
  {
    id: "c3",
    name: "Cordros Capital Endowment",
    type: "Endowment",
    aum: "₦9.1bn",
    mandate: "Long-term growth, equity 60–80%",
    compliance: "compliant",
    lastReport: "Mar 1, 2026",
    contact: "Nneka Eze",
    allocation: { equity: 68, fixed: 22, cash: 10 },
  },
  {
    id: "c4",
    name: "Transcorp Group Treasury",
    type: "Corporate",
    aum: "₦5.4bn",
    mandate: "Capital preservation, NGN yield",
    compliance: "breach",
    lastReport: "Feb 20, 2026",
    contact: "Emeka Ude",
    allocation: { equity: 5, fixed: 82, cash: 13 },
  },
  {
    id: "c5",
    name: "Stanbic IBTC Insurance",
    type: "Insurance",
    aum: "₦14.7bn",
    mandate: "ALM-driven, max equity 20%",
    compliance: "compliant",
    lastReport: "Mar 3, 2026",
    contact: "Funmi Adeyemi",
    allocation: { equity: 18, fixed: 71, cash: 11 },
  },
];

const COMP_COLORS: Record<string, { badge: string; label: string }> = {
  compliant: { badge: "bg-emerald-100 text-emerald-800", label: "Compliant" },
  watch: { badge: "bg-amber-100 text-amber-800", label: "Watch" },
  breach: { badge: "bg-red-100 text-red-800", label: "Breach" },
};

export default function InstitutionHubPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [packLoading, setPackLoading] = useState(false);
  const [packDone, setPackDone] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"clients" | "mandate">("clients");

  const selectedClient = CLIENTS.find((c) => c.id === selected);

  const generatePack = (clientId: string) => {
    setPackLoading(true);
    setPackDone(null);
    setTimeout(() => {
      setPackLoading(false);
      setPackDone(clientId);
    }, 1400);
  };

  return (
    <ModuleShell
      title="Institution Hub"
      subtitle="Client portal — mandate adherence, allocation, IC pack generation"
      action={{ label: "Reports", href: "/reports" }}
    >
      <div className="space-y-5 max-w-4xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total clients</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{CLIENTS.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Compliant</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">{CLIENTS.filter((c) => c.compliance === "compliant").length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Breaches / Watch</p>
            <p className="mt-1 text-2xl font-bold text-red-600">{CLIENTS.filter((c) => c.compliance !== "compliant").length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200">
          {(["clients", "mandate"] as const).map((tab) => (
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
              {tab === "clients" ? "Client register" : "Mandate adherence"}
            </button>
          ))}
        </div>

        {activeTab === "clients" && (
          <div className="space-y-3">
            {CLIENTS.map((c) => (
              <div key={c.id} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div
                  className="px-5 py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50"
                  onClick={() => setSelected(selected === c.id ? null : c.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-slate-900">{c.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">{c.type}</span>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${COMP_COLORS[c.compliance].badge}`}>
                        {COMP_COLORS[c.compliance].label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-0.5">{c.mandate}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="font-medium text-slate-700">{c.aum}</span>
                      <span>·</span>
                      <span>Last report: {c.lastReport}</span>
                      <span>·</span>
                      <span>Contact: {c.contact}</span>
                    </div>
                  </div>
                  <svg
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${selected === c.id ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {selected === c.id && (
                  <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4 space-y-4">
                    {/* Allocation bar */}
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Current allocation</p>
                      <div className="flex rounded-full overflow-hidden h-4 text-[10px] font-medium">
                        <div style={{ width: `${c.allocation.equity}%` }} className="bg-teal-500 flex items-center justify-center text-white">
                          {c.allocation.equity}%
                        </div>
                        <div style={{ width: `${c.allocation.fixed}%` }} className="bg-slate-600 flex items-center justify-center text-white">
                          {c.allocation.fixed}%
                        </div>
                        <div style={{ width: `${c.allocation.cash}%` }} className="bg-slate-300 flex items-center justify-center text-slate-700">
                          {c.allocation.cash}%
                        </div>
                      </div>
                      <div className="flex gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />Equity</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-600 inline-block" />Fixed income</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />Cash</span>
                      </div>
                    </div>

                    {c.compliance === "breach" && (
                      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                        <span className="font-semibold">Mandate breach detected.</span> Current fixed income allocation (82%) exceeds the mandate maximum. Contact client and review rebalance.
                      </div>
                    )}
                    {c.compliance === "watch" && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        <span className="font-semibold">Watch:</span> Equity allocation at 38% approaching mandate limit of 40%. Monitor next NAV date.
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => generatePack(c.id)}
                        disabled={packLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 transition-colors"
                      >
                        {packLoading && selected === c.id ? "Generating…" : "Generate IC pack"}
                      </button>
                      <Link
                        href="/reports"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        View reports
                      </Link>
                    </div>
                    {packDone === c.id && (
                      <p className="text-sm text-emerald-700 font-medium">
                        IC pack generated. Download from <Link href="/reports" className="underline">Reports</Link>.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "mandate" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Mandate adherence status across all clients. Breaches require immediate review and client communication.
            </p>
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Client</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Mandate limit</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-700">Current equity</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-700">Headroom</th>
                    <th className="text-center px-4 py-3 font-medium text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {CLIENTS.map((c) => {
                    const limit = c.mandate.includes("30%") ? 30 : c.mandate.includes("40%") ? 40 : c.mandate.includes("20%") ? 20 : c.mandate.includes("60–80%") ? 80 : 100;
                    const headroom = limit - c.allocation.equity;
                    return (
                      <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                        <td className="px-4 py-3 text-slate-600">Max equity {limit}%</td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-800">{c.allocation.equity}%</td>
                        <td className={`px-4 py-3 text-right font-medium ${headroom < 0 ? "text-red-600" : headroom < 5 ? "text-amber-600" : "text-emerald-600"}`}>
                          {headroom < 0 ? `${headroom}%` : `+${headroom}%`}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${COMP_COLORS[c.compliance].badge}`}>
                            {COMP_COLORS[c.compliance].label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ModuleShell>
  );
}
