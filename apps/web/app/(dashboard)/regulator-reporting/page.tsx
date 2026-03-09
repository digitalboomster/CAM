"use client";

import { useState, useEffect } from "react";
import ModuleShell from "@/components/ModuleShell";
import Link from "next/link";
import * as api from "@/lib/api";
import { REGULATOR_TEMPLATES } from "@/lib/regulatorTemplates";
import type { ExportLogEntry } from "@/lib/types";
import type { Workspace } from "@/lib/types";

const REGULATOR_LABELS = new Set<string>(REGULATOR_TEMPLATES.map((t) => t.label));

export default function RegulatorReportingPage() {
  const [exports, setExports] = useState<ExportLogEntry[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<string>("");
  const [templateId, setTemplateId] = useState<string>(REGULATOR_TEMPLATES[0].id);

  useEffect(() => {
    Promise.all([api.fetchExportLog(), api.fetchWorkspaces()])
      .then(([log, list]) => {
        setExports(log);
        setWorkspaces(list);
        setWorkspaceId((prev) => (prev ? prev : list[0]?.id ?? ""));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const regulatorExports = exports.filter((e) => REGULATOR_LABELS.has(e.label));

  const workspaceName = (id: string | undefined) => {
    if (!id) return "—";
    const w = workspaces.find((x) => x.id === id);
    return w?.name ?? id.slice(0, 8) + "…";
  };

  const formatDate = (e: ExportLogEntry) => {
    if (e.createdAt) {
      try {
        return new Date(e.createdAt).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
      } catch {}
    }
    return e.at;
  };

  const selectedTemplate = REGULATOR_TEMPLATES.find((t) => t.id === templateId) ?? REGULATOR_TEMPLATES[0];
  const generateHref =
    workspaceId && selectedTemplate
      ? `/workspace?workspace=${encodeURIComponent(workspaceId)}&export=1&label=${encodeURIComponent(selectedTemplate.label)}`
      : "/workspace";

  return (
    <ModuleShell
      title="Regulator Reporting"
      subtitle="SEC/compliance templates, export history, and generate & export"
      action={{ label: "Open Workspace", href: "/workspace" }}
      status="live"
    >
      <div className="space-y-8">
        <section>
          <h2 className="font-semibold text-slate-900 mb-3">SEC / Compliance templates</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {REGULATOR_TEMPLATES.map((t) => (
              <div
                key={t.id}
                className="rounded-xl border-2 border-slate-200 bg-white p-4 shadow-sm hover:border-nautilus-accent/30 transition-colors"
              >
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{t.authority}</span>
                <h3 className="font-semibold text-slate-900 mt-1">{t.label}</h3>
                <p className="text-sm text-slate-600 mt-1">{t.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900 mb-3">Generate & export</h2>
          <div className="rounded-xl border border-slate-100 bg-white p-5 space-y-4">
            <p className="text-sm text-slate-600">
              Pick a template and workspace. You’ll be taken to Document Intelligence with the export dialog pre-filled so you can generate and download the PDF.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Template</label>
                <select
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-nautilus-accent/20 focus:border-nautilus-accent outline-none"
                >
                  {REGULATOR_TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Workspace</label>
                <select
                  value={workspaceId}
                  onChange={(e) => setWorkspaceId(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-nautilus-accent/20 focus:border-nautilus-accent outline-none"
                >
                  {workspaces.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Link
              href={generateHref}
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-nautilus-accent text-white hover:bg-nautilus-accent-hover shadow-sm"
            >
              Open workspace to generate & export
            </Link>
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900 mb-3">Export history (regulator)</h2>
          <p className="text-sm text-slate-600 mb-3">
            Exports that used one of the SEC/compliance templates above. Full audit log is on the Reports page.
          </p>
          {loading ? (
            <p className="text-slate-500">Loading…</p>
          ) : error ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-medium">Could not load export log. Run <code className="bg-white/80 px-1 rounded">npm run db:setup</code> in <code className="bg-white/80 px-1 rounded">apps/web</code>, then try again.</p>
              <button
                type="button"
                onClick={() => {
                  setError(false);
                  setLoading(true);
                  Promise.all([api.fetchExportLog(), api.fetchWorkspaces()])
                    .then(([log, list]) => { setExports(log); setWorkspaces(list); setWorkspaceId((p) => (p ? p : list[0]?.id ?? "")); })
                    .catch(() => setError(true))
                    .finally(() => setLoading(false));
                }}
                className="mt-3 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-100 text-amber-800 hover:bg-amber-200"
              >
                Try again
              </button>
            </div>
          ) : regulatorExports.length === 0 ? (
            <p className="text-slate-600">No regulator exports yet. Use Generate & export above and complete an export from the workspace.</p>
          ) : (
            <div className="rounded-xl border border-slate-100 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-white">
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Date</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Label</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Workspace</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Exported by</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Audit ID</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {regulatorExports.map((e) => (
                    <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-slate-600">{formatDate(e)}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{e.label}</td>
                      <td className="px-4 py-3 text-slate-700">{workspaceName(e.workspaceId)}</td>
                      <td className="px-4 py-3 text-slate-600">{e.exportedBy ?? "—"}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500" title="Stable ID for audit">
                        {e.id.slice(0, 8)}…
                      </td>
                      <td className="px-4 py-3 text-right">
                        {e.workspaceId && (
                          <Link
                            href={`/workspace?workspace=${e.workspaceId}`}
                            className="text-nautilus-accent hover:underline font-medium"
                          >
                            Open workspace
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-sm text-slate-500 mt-3">
            <Link href="/reports" className="text-nautilus-accent hover:underline">View full export audit</Link> on Reports.
          </p>
        </section>
      </div>
    </ModuleShell>
  );
}
