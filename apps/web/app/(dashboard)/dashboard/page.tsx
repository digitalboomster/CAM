"use client";

import { useState, useEffect } from "react";
import ModuleShell from "@/components/ModuleShell";
import Link from "next/link";
import * as api from "@/lib/api";
import { useFund } from "@/contexts/FundContext";
import { getMockNav } from "@/lib/mockNav";
import { ModuleIcon } from "@/components/ModuleIcons";
import type { ModuleIconName } from "@/lib/types";

// ── Mock data ────────────────────────────────────────────────────────────────

const MARKET_DATA = [
  { name: "NGX All-Share", value: "98,412.16", change: "+1.24%", up: true },
  { name: "NGX 30", value: "3,541.88", change: "+0.88%", up: true },
  { name: "FMDQ T-Bill (91d)", value: "26.15%", change: "+0.05%", up: true },
  { name: "USD/NGN", value: "1,589.40", change: "-0.32%", up: false },
  { name: "Brent Crude", value: "$73.14", change: "-1.10%", up: false },
];

const TOP_MOVERS = [
  { ticker: "DANGCEM", name: "Dangote Cement", price: "338.50", change: "+3.2%", up: true },
  { ticker: "GTCO", name: "GT Co", price: "54.80", change: "+2.7%", up: true },
  { ticker: "MTNN", name: "MTN Nigeria", price: "212.00", change: "-1.4%", up: false },
  { ticker: "AIRTELAFRI", name: "Airtel Africa", price: "2,204.00", change: "+1.9%", up: true },
  { ticker: "BUACEMENT", name: "BUA Cement", price: "122.40", change: "-0.8%", up: false },
  { ticker: "ZENITHBANK", name: "Zenith Bank", price: "41.25", change: "+4.1%", up: true },
];

const RECENT_ACTIVITY = [
  { time: "09:42", user: "YA", action: "Exported IC Memo for Project Alpha", module: "Document Intelligence", type: "export" },
  { time: "09:18", action: "Pre-trade compliance check passed — DANGCEM buy 25,000 units", module: "OMS", type: "compliance" },
  { time: "Yesterday", user: "SA", action: "Created workspace: Dangote Cement DD", module: "Document Intelligence", type: "workspace" },
  { time: "Yesterday", action: "Rebalance simulation run — 3 drift breaches resolved", module: "Rebalancing", type: "rebalance" },
  { time: "Mar 7", user: "YA", action: "Uploaded 4 documents to Project Alpha workspace", module: "Document Intelligence", type: "upload" },
  { time: "Mar 7", action: "Monthly NAV calculation completed — Milestone 2023 Fund", module: "Valuation", type: "valuation" },
  { time: "Mar 6", user: "SA", action: "Mandate adherence report generated for Stanbic IBTC", module: "Institution Hub", type: "report" },
];

const MODULE_STATUS: { name: string; href: string; status: string; iconKey: ModuleIconName; desc: string }[] = [
  { name: "Document Intelligence", href: "/workspace", status: "live", iconKey: "document", desc: "7 documents indexed" },
  { name: "Analytics", href: "/analytics", status: "live", iconKey: "chart", desc: "As of Mar 8, 2026" },
  { name: "OMS", href: "/oms", status: "live", iconKey: "lightning", desc: "Pre-trade compliance armed" },
  { name: "Rebalancing", href: "/rebalancing", status: "live", iconKey: "scale", desc: "2 positions in breach" },
  { name: "Valuation", href: "/valuation", status: "live", iconKey: "diamond", desc: "DCF + comps ready" },
  { name: "Market Intelligence", href: "/market-intelligence", status: "live", iconKey: "globe", desc: "Latest: Feb 2026 research" },
  { name: "Institution Hub", href: "/institution-hub", status: "live", iconKey: "building", desc: "5 mandates monitored" },
  { name: "DocuFlow", href: "/docuflow", status: "live", iconKey: "refresh", desc: "4 documents processed" },
];

const FUND_METRICS: Record<string, { aum: string; positions: number; ytd: string; ytdUp: boolean; inception: string }> = {
  "milestone-2023": { aum: "₦14.2bn", positions: 28, ytd: "+12.4%", ytdUp: true, inception: "+24.5%" },
  "growth": { aum: "₦8.7bn", positions: 21, ytd: "+18.7%", ytdUp: true, inception: "+18.7%" },
  "fixed-income": { aum: "₦22.1bn", positions: 14, ytd: "+9.3%", ytdUp: true, inception: "+9.3%" },
};

const ALERTS = [
  { level: "warning", text: "DANGCEM position 18.4% of portfolio — approaching 20% limit", link: "/rebalancing" },
  { level: "info", text: "Q1 2026 mandate report due in 3 days — Stanbic IBTC", link: "/institution-hub" },
  { level: "info", text: "NGX All-Share up 1.24% — 3 holdings in top movers today", link: "/analytics" },
];

// ── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${accent ? "border-nautilus-accent/20 bg-nautilus-accent-muted/30" : "border-slate-200 bg-white"}`}>
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ? "text-nautilus-accent" : "text-slate-900"}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

function AlertBadge({ level }: { level: string }) {
  if (level === "warning") return (
    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
  );
  return <span className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 shrink-0" />;
}

function ActivityIcon({ type }: { type: string }) {
  const base = "w-7 h-7 rounded-full flex items-center justify-center shrink-0";
  switch (type) {
    case "export": return <div className={`${base} bg-violet-100 text-violet-700`}><ModuleIcon name="export" className="w-3.5 h-3.5" /></div>;
    case "compliance": return <div className={`${base} bg-emerald-100 text-emerald-700`}><ModuleIcon name="check" className="w-3.5 h-3.5" /></div>;
    case "workspace": return <div className={`${base} bg-nautilus-accent-muted text-nautilus-accent`}><ModuleIcon name="folder" className="w-3.5 h-3.5" /></div>;
    case "rebalance": return <div className={`${base} bg-blue-100 text-blue-700`}><ModuleIcon name="scale" className="w-3.5 h-3.5" /></div>;
    case "upload": return <div className={`${base} bg-slate-100 text-slate-600`}><ModuleIcon name="upload" className="w-3.5 h-3.5" /></div>;
    case "valuation": return <div className={`${base} bg-amber-100 text-amber-700`}><ModuleIcon name="diamond" className="w-3.5 h-3.5" /></div>;
    case "report": return <div className={`${base} bg-indigo-100 text-indigo-700`}><ModuleIcon name="clipboard" className="w-3.5 h-3.5" /></div>;
    default: return <div className={`${base} bg-slate-100 text-slate-500`}><span className="w-1 h-1 rounded-full bg-current" /></div>;
  }
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const fund = useFund();
  const [workspaceCount, setWorkspaceCount] = useState<number | null>(null);
  const [exportCount, setExportCount] = useState<number | null>(null);
  const [complianceModalOpen, setComplianceModalOpen] = useState(false);
  const [complianceLoading, setComplianceLoading] = useState(false);
  const [complianceResult, setComplianceResult] = useState<{ passed: boolean; message: string } | null>(null);

  useEffect(() => {
    api.fetchWorkspaces().then((list) => setWorkspaceCount(list.length)).catch(() => setWorkspaceCount(0));
    api.fetchExportLog().then((list) => setExportCount(list.length)).catch(() => setExportCount(0));
  }, []);

  const navData = fund ? getMockNav(fund.fundId) : null;
  const fundMetrics = fund ? FUND_METRICS[fund.fundId] ?? null : null;

  const runComplianceCheck = () => {
    setComplianceModalOpen(true);
    setComplianceLoading(true);
    setComplianceResult(null);
    setTimeout(() => {
      setComplianceLoading(false);
      setComplianceResult({
        passed: true,
        message: "Pre-trade and mandate checks passed. No breaches detected for the current fund. Kill-switch status: armed. All positions within SEC concentration limits.",
      });
    }, 1200);
  };

  return (
    <ModuleShell
      title="Dashboard"
      subtitle="Command centre — live data, activity, and quick access to all modules"
      action={{ label: "Open Document Intelligence", href: "/workspace" }}
      status="live"
    >
      <div className="space-y-6">

        {/* ── Alerts ─────────────────────────────────────────────────── */}
        {ALERTS.length > 0 && (
          <div className="space-y-2">
            {ALERTS.map((a, i) => (
              <div key={i} className={`flex items-start gap-3 rounded-lg px-4 py-2.5 border text-sm ${a.level === "warning" ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-sky-50 border-sky-200 text-sky-800"}`}>
                <AlertBadge level={a.level} />
                <span className="flex-1">{a.text}</span>
                <Link href={a.link} className="text-xs font-medium underline opacity-70 hover:opacity-100 shrink-0">Review</Link>
              </div>
            ))}
          </div>
        )}

        {/* ── KPI row ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          <KpiCard
            label="NAV (₦)"
            value={navData?.nav ?? "—"}
            sub={navData?.asOf ?? "Select fund in header"}
            accent
          />
          <KpiCard
            label="AUM"
            value={fundMetrics?.aum ?? "—"}
            sub={fund?.fundName ?? "Select fund"}
          />
          <KpiCard
            label="YTD Return"
            value={fundMetrics?.ytd ?? "—"}
            sub={`Since Jan 1, 2026`}
          />
          <KpiCard
            label="Positions"
            value={fundMetrics ? String(fundMetrics.positions) : "—"}
            sub="Active holdings"
          />
          <KpiCard
            label="Workspaces"
            value={workspaceCount === null ? "—" : String(workspaceCount)}
            sub={workspaceCount === 0 ? "Create in Document Intelligence" : "Document Intelligence"}
          />
          <KpiCard
            label="Exports"
            value={exportCount === null ? "—" : String(exportCount)}
            sub={exportCount === 0 ? "Exports will appear here" : "Memos & reports"}
          />
        </div>

        {/* ── Market snapshot ────────────────────────────────────────── */}
        <div className="rounded-xl border border-slate-100 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
            <h2 className="font-semibold text-slate-900 text-sm">Market Snapshot</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-500">Live · Mar 8, 2026 09:45 WAT</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-y sm:divide-y-0 divide-slate-100">
            {MARKET_DATA.map((m) => (
              <div key={m.name} className="px-4 py-3">
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide truncate">{m.name}</p>
                <p className="mt-0.5 text-base font-semibold text-slate-800">{m.value}</p>
                <p className={`text-xs font-medium mt-0.5 ${m.up ? "text-emerald-600" : "text-red-500"}`}>{m.change}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ── Top Movers ──────────────────────────────────────────── */}
          <div className="lg:col-span-2 rounded-xl border border-slate-100 bg-white">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
              <h2 className="font-semibold text-slate-900 text-sm">NGX Top Movers</h2>
              <Link href="/analytics" className="text-xs text-nautilus-accent hover:underline">Full analytics →</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {TOP_MOVERS.map((m) => (
                <div key={m.ticker} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50/60 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{m.ticker}</p>
                    <p className="text-xs text-slate-500">{m.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-700">₦{m.price}</p>
                    <p className={`text-xs font-semibold ${m.up ? "text-emerald-600" : "text-red-500"}`}>{m.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Recent Activity ─────────────────────────────────────── */}
          <div className="lg:col-span-3 rounded-xl border border-slate-100 bg-white">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
              <h2 className="font-semibold text-slate-900 text-sm">Recent Activity</h2>
              <span className="text-xs text-slate-400">All users · all modules</span>
            </div>
            <div className="divide-y divide-slate-50">
              {RECENT_ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50/60 transition-colors">
                  <ActivityIcon type={a.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 leading-snug">{a.action}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-400">{a.module}</span>
                      {a.user && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="text-[10px] text-slate-400">{a.user}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 pt-0.5">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Module shortcuts ────────────────────────────────────────── */}
        <div className="rounded-xl border border-slate-100 bg-white">
          <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
            <h2 className="font-semibold text-slate-900 text-sm">Platform Modules</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-0 divide-x divide-y divide-slate-100">
            {MODULE_STATUS.map((m) => (
              <Link
                key={m.name}
                href={m.href}
                className="flex flex-col items-center text-center px-3 py-4 hover:bg-nautilus-accent-muted/30 transition-colors group"
              >
                <ModuleIcon name={m.iconKey} className="w-8 h-8 mb-1.5 text-slate-700" />
                <p className="text-xs font-semibold text-slate-700 group-hover:text-nautilus-accent leading-tight">{m.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{m.desc}</p>
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* ── Use cases + compliance ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-100 bg-white p-4">
            <h2 className="font-semibold text-slate-900 mb-1">Document Intelligence — Use Cases</h2>
            <p className="text-xs text-slate-500 mb-3">Click any to open in Co-Pilot with pre-loaded context.</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "IC Memo", desc: "Investment committee memo with citations", href: "/workspace" },
                { label: "Due Diligence", desc: "Key DD questions across materials", href: "/workspace" },
                { label: "M&A Deal Points", desc: "Extract and compare M&A provisions", href: "/workspace" },
                { label: "Research Synthesis", desc: "Derive insight from sector reports", href: "/workspace" },
                { label: "Comps Tracking", desc: "Comparable filings & calls", href: "/workspace" },
                { label: "Earnings Analysis", desc: "Guidance, tone, key metrics", href: "/workspace" },
              ].map((u) => (
                <Link
                  key={u.label}
                  href={u.href}
                  className="block p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:border-nautilus-accent/30 hover:bg-nautilus-accent-muted/30 transition-colors"
                >
                  <p className="text-xs font-semibold text-slate-800">{u.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{u.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white p-4 space-y-4">
            <div>
              <h2 className="font-semibold text-slate-900">Pre-Trade Compliance</h2>
              <p className="text-sm text-slate-600 mt-1">
                Hard-coded compliance layer — blocks trades exceeding SEC limits or fund mandate concentrations. Kill-switch armed. Full audit trail to every check.
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Checks today", value: "14" },
                  { label: "Passed", value: "14" },
                  { label: "Blocked", value: "0" },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg bg-slate-50 border border-slate-100 py-2">
                    <p className="text-base font-bold text-slate-800">{s.value}</p>
                    <p className="text-[10px] text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={runComplianceCheck}
                className="mt-3 w-full px-3 py-2 rounded-lg text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium"
              >
                Run live check
              </button>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">Quick actions</h3>
              <div className="flex flex-wrap gap-2">
                <Link href="/workspace" className="px-3 py-1.5 rounded-lg text-xs font-medium bg-nautilus-accent text-white hover:bg-nautilus-accent-hover">Open Co-Pilot</Link>
                <Link href="/oms" className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50">New order</Link>
                <Link href="/rebalancing" className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50">Rebalance</Link>
                <Link href="/reports" className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50">Export log</Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Trust bar ───────────────────────────────────────────────── */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-2.5 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Nautilus · SABB-CM Asset Management</span>
          <span className="text-slate-300">|</span>
          <span>Total transparency — trace every action to source</span>
          <span className="text-slate-300">|</span>
          <span>Enterprise security</span>
          <span className="text-slate-300">|</span>
          <span>NGX · FMDQ · SEC compliant</span>
          <span className="text-slate-300">|</span>
          <Link href="/platform" className="text-nautilus-accent hover:underline font-medium">Platform overview →</Link>
        </div>
      </div>

      {/* Compliance modal */}
      {complianceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setComplianceModalOpen(false)}>
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-slate-900 text-base">Pre-Trade Compliance Check</h3>
            <p className="text-sm text-slate-500 mt-0.5">Checking fund: {fund?.fundName ?? "All funds"}</p>
            {complianceLoading ? (
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                <span className="w-2 h-2 rounded-full bg-nautilus-accent animate-pulse" />
                Running checks across all positions…
              </div>
            ) : complianceResult ? (
              <div className="mt-4 space-y-3">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                    <ModuleIcon name="check" className="w-4 h-4 shrink-0" />
                    All checks passed
                  </p>
                  <p className="text-sm text-emerald-700 mt-1">{complianceResult.message}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    { label: "SEC concentration limit", status: "Pass" },
                    { label: "Fund mandate compliance", status: "Pass" },
                    { label: "Kill-switch status", status: "Armed" },
                    { label: "Market hours", status: "Open" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between px-3 py-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-600 text-xs">{item.label}</span>
                      <span className="text-emerald-600 font-semibold text-xs">{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            <button onClick={() => setComplianceModalOpen(false)} className="mt-4 w-full px-3 py-2 rounded-lg text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium">
              Close
            </button>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}
