"use client";

import { useState, useEffect } from "react";
import ModuleShell from "@/components/ModuleShell";
import Link from "next/link";
import * as api from "@/lib/api";
import { REPORT_TEMPLATES } from "@/lib/reportTemplates";
import type { ExportLogEntry, Workspace } from "@/lib/types";

// ── Mock recent reports ──────────────────────────────────────────────────────

const MOCK_RECENT_REPORTS = [
  {
    id: "r001",
    title: "Project Alpha — IC Memo v2",
    template: "IC Memo",
    workspace: "Dangote Cement DD",
    author: "YA",
    date: "Mar 8, 2026",
    status: "final",
    pages: 5,
  },
  {
    id: "r002",
    title: "Dangote Cement — DD Summary",
    template: "DD Summary",
    workspace: "Dangote Cement DD",
    author: "SA",
    date: "Mar 7, 2026",
    status: "final",
    pages: 8,
  },
  {
    id: "r003",
    title: "Q1 2026 Committee Pack — Milestone Fund",
    template: "Committee Pack",
    workspace: "Q1 2026 Review",
    author: "YA",
    date: "Mar 6, 2026",
    status: "final",
    pages: 14,
  },
  {
    id: "r004",
    title: "West African Cement — Research Brief",
    template: "Research Brief",
    workspace: "Cordros Sector Research",
    author: "SA",
    date: "Mar 5, 2026",
    status: "draft",
    pages: 3,
  },
  {
    id: "r005",
    title: "Stanbic IBTC — Mandate Adherence Q1 2026",
    template: "Mandate Adherence Report",
    workspace: "Institutional Clients",
    author: "YA",
    date: "Mar 4, 2026",
    status: "final",
    pages: 4,
  },
];

// ── Template color maps ───────────────────────────────────────────────────────

const TEMPLATE_COLORS: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", badge: "bg-violet-100 text-violet-700" },
  blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", badge: "bg-blue-100 text-blue-700" },
  teal: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", badge: "bg-teal-100 text-teal-700" },
  amber: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", badge: "bg-amber-100 text-amber-700" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", badge: "bg-indigo-100 text-indigo-700" },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  if (status === "final") {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Final</span>;
  }
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Draft</span>;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [exports, setExports] = useState<ExportLogEntry[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [generateWorkspaceId, setGenerateWorkspaceId] = useState<string>("");
  const [generateTemplateId, setGenerateTemplateId] = useState<string>(REPORT_TEMPLATES[0].id);
  const [activeTab, setActiveTab] = useState<"templates" | "generate" | "audit">("templates");

  useEffect(() => {
    const load = async () => {
      try {
        const [log, list] = await Promise.all([
          api.fetchExportLog().catch(() => [] as ExportLogEntry[]),
          api.fetchWorkspaces().catch(() => [] as Workspace[]),
        ]);
        setExports(Array.isArray(log) ? log : []);
        setWorkspaces(Array.isArray(list) ? list : []);
        setGenerateWorkspaceId((prev) => (prev ? prev : list?.[0]?.id ?? ""));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const workspaceName = (id: string | undefined) => {
    if (!id) return "—";
    const w = workspaces.find((x) => x.id === id);
    return w?.name ?? id.slice(0, 8) + "…";
  };

  const formatDate = (e: ExportLogEntry) => {
    if (e.createdAt) {
      try {
        return new Date(e.createdAt).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
      } catch { /* fallthrough */ }
    }
    return e.at;
  };

  const selectedTemplate = REPORT_TEMPLATES.find((t) => t.id === generateTemplateId) ?? REPORT_TEMPLATES[0];
  const generateHref =
    generateWorkspaceId && selectedTemplate
      ? `/workspace?workspace=${encodeURIComponent(generateWorkspaceId)}&export=1&label=${encodeURIComponent(selectedTemplate.label)}`
      : "/workspace";

  const allExports = [
    ...MOCK_RECENT_REPORTS.map((r) => ({
      id: r.id,
      label: r.title,
      template: r.template,
      workspace: r.workspace,
      author: r.author,
      date: r.date,
      status: r.status,
      pages: r.pages,
      isMock: true,
    })),
    ...exports.map((e) => ({
      id: e.id,
      label: e.label,
      template: "—",
      workspace: workspaceName(e.workspaceId),
      author: e.exportedBy ?? "—",
      date: formatDate(e),
      status: "final",
      pages: null,
      isMock: false,
    })),
  ];

  return (
    <ModuleShell
      title="Reports"
      subtitle="Templates, generation, and export audit — full institutional transparency"
      action={{ label: "Open Document Intelligence", href: "/workspace" }}
      status="live"
    >
      <div className="space-y-6">

        {/* ── Stats row ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Templates", value: String(REPORT_TEMPLATES.length), sub: "Ready to generate" },
            { label: "Reports generated", value: String(allExports.length), sub: "All time" },
            { label: "This week", value: "5", sub: "Mar 4–8, 2026" },
            { label: "Last export", value: "Today", sub: "Project Alpha IC Memo v2" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{s.label}</p>
              <p className="mt-0.5 text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-1 border-b border-slate-200">
          {(["templates", "generate", "audit"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? "border-nautilus-accent text-nautilus-accent"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              {tab === "audit" ? "Export Audit" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* ── TEMPLATES TAB ──────────────────────────────────────── */}
        {activeTab === "templates" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">Report Templates</h2>
                <p className="text-sm text-slate-500 mt-0.5">AI-powered templates that extract, cite, and structure your documents.</p>
              </div>
              <button
                onClick={() => setActiveTab("generate")}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-nautilus-accent text-white hover:bg-nautilus-accent-hover shadow-sm"
              >
                Generate a report →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {REPORT_TEMPLATES.map((t) => {
                const colors = TEMPLATE_COLORS[t.color] ?? TEMPLATE_COLORS.teal;
                return (
                  <div
                    key={t.id}
                    className={`rounded-xl border ${colors.border} ${colors.bg} p-4 flex flex-col gap-3 hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{t.icon}</span>
                        <h3 className={`font-semibold ${colors.text}`}>{t.label}</h3>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">{t.estimatedPages}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed flex-1">{t.description}</p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1">
                        {t.tags.map((tag) => (
                          <span key={tag} className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${colors.badge}`}>{tag}</span>
                        ))}
                      </div>
                      <button
                        onClick={() => { setGenerateTemplateId(t.id); setActiveTab("generate"); }}
                        className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border ${colors.border} ${colors.text} hover:opacity-80 bg-white transition-opacity`}
                      >
                        Use template
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── GENERATE TAB ───────────────────────────────────────── */}
        {activeTab === "generate" && (
          <div className="max-w-xl space-y-5">
            <div>
              <h2 className="font-semibold text-slate-900">Generate Report</h2>
              <p className="text-sm text-slate-500 mt-0.5">Select a template and workspace. Opens Document Intelligence with Co-Pilot pre-loaded.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Report template</label>
                <div className="grid grid-cols-1 gap-2">
                  {REPORT_TEMPLATES.map((t) => {
                    const colors = TEMPLATE_COLORS[t.color] ?? TEMPLATE_COLORS.teal;
                    const selected = generateTemplateId === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setGenerateTemplateId(t.id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors ${
                          selected
                            ? `${colors.border} ${colors.bg} ${colors.text}`
                            : "border-slate-200 bg-slate-50/60 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span className="text-xl">{t.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold leading-snug">{t.label}</p>
                          <p className="text-xs text-slate-500 leading-snug truncate">{t.estimatedPages}</p>
                        </div>
                        {selected && (
                          <svg className="w-4 h-4 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Workspace</label>
                <select
                  value={workspaces.length === 0 ? "" : generateWorkspaceId}
                  onChange={(e) => setGenerateWorkspaceId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-400/30 focus:border-teal-400 outline-none bg-white"
                >
                  {workspaces.length === 0 ? (
                    <option value="">No workspaces — create one in Document Intelligence</option>
                  ) : (
                    workspaces.map((w) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))
                  )}
                </select>
                {workspaces.length === 0 && (
                  <p className="text-xs text-slate-500 mt-1.5">
                    <Link href="/workspace" className="text-teal-600 hover:underline">Create a workspace first →</Link>
                  </p>
                )}
              </div>
              <div className="pt-1">
                <Link
                  href={generateHref}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-nautilus-accent text-white hover:bg-nautilus-accent-hover shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Open in Document Intelligence
                </Link>
                <p className="text-xs text-slate-400 mt-2">Opens Co-Pilot with the selected template as the starting query. Export as PDF to log the report.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── AUDIT TAB ──────────────────────────────────────────── */}
        {activeTab === "audit" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-900">Export Audit Log</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Every export is logged with a unique audit ID. Full traceability for institutional clients and regulatory review.
                </p>
              </div>
              {!loading && allExports.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const header = "Date,Title,Template,Workspace,Author,Status,Audit ID\n";
                    const rows = allExports
                      .map((e) =>
                        [e.date, e.label, e.template, e.workspace, e.author, e.status, e.id]
                          .map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`)
                          .join(",")
                      )
                      .join("\n");
                    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = `nautilus-export-audit-${new Date().toISOString().slice(0, 10)}.csv`;
                    a.click();
                    URL.revokeObjectURL(a.href);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download CSV
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex items-center gap-2 text-slate-500 text-sm py-4">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                Loading audit log…
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Report</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Template</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Workspace</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Author</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Audit ID</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allExports.map((e) => (
                      <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{e.date}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-900 leading-snug">{e.label}</p>
                          {e.pages && <p className="text-xs text-slate-400">{e.pages} pages</p>}
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs">{e.template}</td>
                        <td className="px-4 py-3 text-slate-600 text-xs max-w-[140px] truncate">{e.workspace}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs font-bold">{e.author}</span>
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-400" title="Stable audit ID">{e.id.slice(0, 8)}…</td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-xs font-medium text-teal-600 hover:underline">
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              All exports are immutable and tamper-evident. Audit IDs are stable and can be referenced in compliance submissions.
            </p>
          </div>
        )}
      </div>
    </ModuleShell>
  );
}
