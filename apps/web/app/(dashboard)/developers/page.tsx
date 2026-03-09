"use client";

import ModuleShell from "@/components/ModuleShell";

/** Mock API Storefront (Nautilus V1: Marquee blueprint). */
const ENDPOINTS = [
  { method: "GET", path: "/v1/workspaces", description: "List document intelligence workspaces." },
  { method: "GET", path: "/v1/workspaces/:id", description: "Get workspace details and grid data." },
  { method: "POST", path: "/v1/workspaces", description: "Create a new workspace." },
  { method: "POST", path: "/v1/workspaces/:id/sources", description: "Add documents or sources to a workspace." },
  { method: "POST", path: "/v1/workspaces/:id/columns", description: "Add extraction column (field)." },
  { method: "GET", path: "/v1/export-log", description: "Fetch full export audit log." },
  { method: "POST", path: "/v1/export", description: "Record export and generate PDF memo." },
  { method: "GET", path: "/v1/funds", description: "List funds (for NAV and mandate context)." },
];

export default function DevelopersPage() {
  return (
    <ModuleShell
      title="API Storefront"
      subtitle="API-first platform — externalize analytics and data (Marquee blueprint)"
      status="partial"
    >
      <div className="max-w-2xl space-y-6">
        <p className="text-sm text-slate-600">
          Nautilus is an API-first platform. Fintechs, insurance companies, and PFAs can plug into Cordros regulated investment products. This page documents the main endpoints for integration.
        </p>
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 font-medium text-slate-700 text-sm">
            Base URL: <code className="bg-slate-200 px-1.5 py-0.5 rounded">https://api.nautilus.cordros.com</code> (example)
          </div>
          <ul className="divide-y divide-slate-100">
            {ENDPOINTS.map((ep) => (
              <li key={ep.method + ep.path} className="px-4 py-3 flex flex-wrap items-baseline gap-2">
                <span
                  className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                    ep.method === "GET" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {ep.method}
                </span>
                <code className="text-sm text-slate-800">{ep.path}</code>
                <span className="text-slate-500 text-sm w-full sm:w-auto">{ep.description}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-slate-500">
          Authentication and rate limits: contact Cordros for API keys and developer access. Full OpenAPI spec coming soon.
        </p>
      </div>
    </ModuleShell>
  );
}
