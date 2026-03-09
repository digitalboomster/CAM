"use client";

import Link from "next/link";
import ModuleShell from "@/components/ModuleShell";

const SHARIAH_STATS = [
  { label: "Assets screened", value: "247", sub: "AAOIFI-compliant only" },
  { label: "Last full scan", value: "Today, 08:42", sub: "Zero exceptions" },
  { label: "ESG mandates", value: "12", sub: "Active fund overlays" },
];

const RECENT_AUDIT = [
  { at: "Today 08:42", fund: "Cordros Halal Equity", result: "Pass", detail: "Full AAOIFI screen" },
  { at: "Today 06:15", fund: "Cordros ESG Balanced", result: "Pass", detail: "ESG overlay applied" },
  { at: "Mar 8 23:00", fund: "Cordros Halal Equity", result: "Pass", detail: "End-of-day recheck" },
];

export default function ShariahESGPage() {
  return (
    <ModuleShell
      title="Shariah & ESG Guardrails"
      subtitle="Ethics middleware — AAOIFI (Shariah) and ESG mandate compliance"
      action={{ label: "Document Intelligence", href: "/workspace" }}
      status="live"
    >
      <div className="max-w-3xl space-y-8">
        <p className="text-sm text-slate-600">
          Ethics middleware that scans all underlying assets for AAOIFI (Shariah) or ESG mandate compliance. Zero-error Halal fund management and real-time ethical auditing.
        </p>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-3">
          {SHARIAH_STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm font-medium text-slate-700 mt-0.5">{s.label}</p>
              <p className="text-xs text-slate-500 mt-1">{s.sub}</p>
            </div>
          ))}
        </section>

        {/* Shariah (AAOIFI) */}
        <section>
          <h2 className="font-semibold text-slate-900 mb-2">Shariah (AAOIFI) screening</h2>
          <p className="text-sm text-slate-600 mb-3">
            All holdings are screened against AAOIFI standards. Non-compliant names are excluded from Halal funds; breaches trigger alerts and optional auto-rebalancing.
          </p>
          <div className="rounded-xl border border-slate-100 bg-white p-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden />
              <span className="font-medium text-slate-800">Screening active</span>
              <span className="text-slate-500">— Real-time on trade and position data</span>
            </div>
          </div>
        </section>

        {/* ESG */}
        <section>
          <h2 className="font-semibold text-slate-900 mb-2">ESG mandate compliance</h2>
          <p className="text-sm text-slate-600 mb-3">
            Fund-level ESG overlays (exclusions, thresholds, best-in-class) are applied at portfolio level. Violations are flagged before settlement.
          </p>
          <div className="rounded-xl border border-slate-100 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-2.5 font-medium text-slate-700">Mandate</th>
                  <th className="text-left px-4 py-2.5 font-medium text-slate-700">Fund(s)</th>
                  <th className="text-left px-4 py-2.5 font-medium text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-3 text-slate-800">Exclude tobacco, weapons, gambling</td>
                  <td className="px-4 py-3 text-slate-600">ESG Balanced, Ethical Growth</td>
                  <td className="px-4 py-3"><span className="rounded px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">Active</span></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-800">Carbon intensity &lt; sector median</td>
                  <td className="px-4 py-3 text-slate-600">Climate Focus</td>
                  <td className="px-4 py-3"><span className="rounded px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">Active</span></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-800">AAOIFI Shariah-compliant only</td>
                  <td className="px-4 py-3 text-slate-600">Halal Equity</td>
                  <td className="px-4 py-3"><span className="rounded px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent audit log */}
        <section>
          <h2 className="font-semibold text-slate-900 mb-2">Recent audit runs</h2>
          <p className="text-sm text-slate-600 mb-3">
            Last screening and compliance checks. Full audit trail is available in Reports.
          </p>
          <div className="rounded-xl border border-slate-100 bg-white overflow-hidden">
            <ul className="divide-y divide-slate-100">
              {RECENT_AUDIT.map((r) => (
                <li key={r.at + r.fund} className="px-4 py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-800">{r.fund}</p>
                    <p className="text-xs text-slate-500">{r.detail}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-slate-500">{r.at}</span>
                    <span className="rounded px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">{r.result}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            <Link href="/reports" className="text-nautilus-accent hover:underline">View full audit trail</Link> on Reports.
          </p>
        </section>
      </div>
    </ModuleShell>
  );
}
