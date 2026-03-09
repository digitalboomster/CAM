"use client";

import { useState } from "react";
import ModuleShell from "@/components/ModuleShell";

type DocStatus = "processed" | "processing" | "queued" | "failed";

interface Doc {
  id: string;
  name: string;
  type: string;
  size: string;
  uploaded: string;
  status: DocStatus;
  extractedFields: number;
  destination: string;
}

const MOCK_DOCS: Doc[] = [
  { id: "d1", name: "Dangote_Cement_FY2025_Annual_Report.pdf", type: "Annual Report", size: "4.2 MB", uploaded: "Mar 6, 2026", status: "processed", extractedFields: 48, destination: "IC Memo workspace" },
  { id: "d2", name: "MTN_Nigeria_Q4_2025_Results.pdf", type: "Financial Statement", size: "2.1 MB", uploaded: "Mar 6, 2026", status: "processed", extractedFields: 32, destination: "Earnings Analysis" },
  { id: "d3", name: "Cordros_Milestone_Fund_Dec2025_NAV.xlsx", type: "NAV Report", size: "0.8 MB", uploaded: "Mar 5, 2026", status: "processed", extractedFields: 22, destination: "Portfolio workspace" },
  { id: "d4", name: "SEC_Nigeria_CIS_Guidelines_Feb2026.pdf", type: "Regulatory", size: "1.4 MB", uploaded: "Mar 5, 2026", status: "processing", extractedFields: 0, destination: "Compliance workspace" },
  { id: "d5", name: "Project_Alpha_CIM_Draft_v3.pdf", type: "CIM", size: "6.7 MB", uploaded: "Mar 4, 2026", status: "processing", extractedFields: 0, destination: "M&A workspace" },
  { id: "d6", name: "GTCO_FY2025_Audited_Accounts.pdf", type: "Financial Statement", size: "3.8 MB", uploaded: "Mar 3, 2026", status: "queued", extractedFields: 0, destination: "Unassigned" },
  { id: "d7", name: "Flour_Mills_Honeywell_Merger_IM.pdf", type: "Information Memorandum", size: "9.2 MB", uploaded: "Mar 2, 2026", status: "failed", extractedFields: 0, destination: "M&A workspace" },
];

const TEMPLATES = [
  { id: "t1", name: "IC Memo Extraction", fields: "Valuation, Key risks, Management themes, EBITDA, Revenue" },
  { id: "t2", name: "Financial Statement Parse", fields: "Revenue, EBITDA, Net income, EPS, NAV, DPS" },
  { id: "t3", name: "Regulatory Filing", fields: "Effective date, Scope, Penalties, Compliance deadline" },
  { id: "t4", name: "CIM / Information Memorandum", fields: "Deal overview, Use of proceeds, Key risks, Market data" },
  { id: "t5", name: "NAV Report", fields: "Total NAV, Per-unit NAV, Fund name, Date, Currency" },
];

const STATUS_STYLE: Record<DocStatus, { badge: string; label: string }> = {
  processed: { badge: "bg-emerald-100 text-emerald-800", label: "Processed" },
  processing: { badge: "bg-blue-100 text-blue-800", label: "Processing…" },
  queued: { badge: "bg-slate-100 text-slate-700", label: "Queued" },
  failed: { badge: "bg-red-100 text-red-800", label: "Failed" },
};

export default function DocuflowPage() {
  const [activeTab, setActiveTab] = useState<"pipeline" | "templates">("pipeline");
  const [reprocessing, setReprocessing] = useState<string | null>(null);
  const [docs, setDocs] = useState<Doc[]>(MOCK_DOCS);

  const retryDoc = (id: string) => {
    setReprocessing(id);
    setTimeout(() => {
      setDocs((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "processing" } : d))
      );
      setReprocessing(null);
    }, 1200);
  };

  const processed = docs.filter((d) => d.status === "processed").length;
  const inProgress = docs.filter((d) => d.status === "processing" || d.status === "queued").length;
  const failed = docs.filter((d) => d.status === "failed").length;

  return (
    <ModuleShell
      title="DocuFlow"
      subtitle="Document processing pipeline — ingest, classify, extract, route to workspace"
      action={{ label: "Document Intelligence", href: "/workspace" }}
    >
      <div className="space-y-5 max-w-4xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-100 bg-white p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Processed</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">{processed}</p>
            <p className="text-xs text-slate-500 mt-0.5">Fields extracted and routed</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">In pipeline</p>
            <p className="mt-1 text-2xl font-bold text-blue-600">{inProgress}</p>
            <p className="text-xs text-slate-500 mt-0.5">Processing or queued</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Failed</p>
            <p className="mt-1 text-2xl font-bold text-red-600">{failed}</p>
            <p className="text-xs text-slate-500 mt-0.5">Require retry or review</p>
          </div>
        </div>

        {/* Upload zone (mock) */}
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-6 text-center hover:border-teal-400 transition-colors cursor-pointer">
          <svg className="w-8 h-8 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm font-medium text-slate-700">Drop documents here or <span className="text-teal-600 hover:underline">browse to upload</span></p>
          <p className="text-xs text-slate-500 mt-1">PDF, Excel, Word — auto-classified and routed to Document Intelligence</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200">
          {(["pipeline", "templates"] as const).map((tab) => (
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
              {tab === "pipeline" ? "Processing pipeline" : "Extraction templates"}
            </button>
          ))}
        </div>

        {activeTab === "pipeline" && (
          <div className="rounded-xl border border-slate-100 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-white">
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Document</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Destination</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-700">Fields</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-700">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 truncate max-w-[220px]" title={d.name}>{d.name}</p>
                      <p className="text-xs text-slate-500">{d.size} · {d.uploaded}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{d.type}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{d.destination}</td>
                    <td className="px-4 py-3 text-right text-slate-700">
                      {d.status === "processed" ? d.extractedFields : "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[d.status].badge}`}>
                        {STATUS_STYLE[d.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {d.status === "failed" && (
                        <button
                          type="button"
                          onClick={() => retryDoc(d.id)}
                          disabled={reprocessing === d.id}
                          className="text-xs text-teal-600 hover:underline font-medium disabled:opacity-50"
                        >
                          {reprocessing === d.id ? "Retrying…" : "Retry"}
                        </button>
                      )}
                      {d.status === "processed" && (
                        <a href="/workspace" className="text-xs text-teal-600 hover:underline font-medium">
                          Open workspace
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "templates" && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Extraction templates define which fields are pulled from each document class. Apply a template to auto-populate workspace columns.
            </p>
            {TEMPLATES.map((t) => (
              <div key={t.id} className="rounded-xl border border-slate-100 bg-white p-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-500 mt-1">Fields: {t.fields}</p>
                </div>
                <a
                  href="/workspace"
                  className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Apply in workspace
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </ModuleShell>
  );
}
