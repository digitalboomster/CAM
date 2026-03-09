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

const RATE_LIMITS = [
  { endpoint: "GET /v1/workspaces", limit: "60/min", burst: "20" },
  { endpoint: "GET /v1/workspaces/:id", limit: "60/min", burst: "20" },
  { endpoint: "POST /v1/workspaces", limit: "20/min", burst: "10" },
  { endpoint: "POST /v1/workspaces/:id/sources", limit: "10/min", burst: "5" },
  { endpoint: "POST /v1/export", limit: "10/min", burst: "3" },
];

export default function DevelopersPage() {
  return (
    <ModuleShell
      title="API Storefront"
      subtitle="API-first platform — externalize analytics and data (Marquee blueprint)"
      status="live"
    >
      <div className="max-w-3xl space-y-6">
        <p className="text-sm text-slate-600">
          Nautilus is an API-first platform. Fintechs, insurance companies, and PFAs can plug into Cordros regulated investment products. This page documents the main endpoints for integration.
        </p>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-white p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Get API key</p>
            <h2 className="mt-1 font-semibold text-slate-900">Authenticate with bearer tokens</h2>
            <p className="text-sm text-slate-600 mt-2">
              Request production credentials from Cordros. Keys are scoped per client and environment (sandbox vs production).
            </p>
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              <span className="text-slate-400 mr-2">Example key</span>
              <code className="font-mono">nak_live_••••••••••••••••</code>
            </div>
            <button
              type="button"
              onClick={() => alert("Contact Cordros to request API keys and developer access.")}
              className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold bg-nautilus-accent text-white hover:bg-nautilus-accent-hover shadow-sm"
            >
              Request API key
            </button>
            <p className="text-xs text-slate-400 mt-2">Demo UI — this button does not send requests.</p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Base URL</p>
            <h2 className="mt-1 font-semibold text-slate-900">Stable, versioned endpoints</h2>
            <p className="text-sm text-slate-600 mt-2">
              Use the versioned API to integrate workspaces, exports, and fund context into client workflows.
            </p>
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              <span className="text-slate-400 mr-2">API</span>
              <code className="bg-slate-200 px-1.5 py-0.5 rounded">https://api.nautilus.cordros.com</code>
              <span className="text-slate-400 ml-2">(example)</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-slate-100 bg-white px-3 py-2">
                <p className="text-slate-500">Env</p>
                <p className="font-semibold text-slate-800">Sandbox</p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-white px-3 py-2">
                <p className="text-slate-500">Auth</p>
                <p className="font-semibold text-slate-800">Bearer</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-100 bg-white overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 bg-white font-semibold text-slate-800 text-sm">
            Endpoints
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
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-white p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Example request</p>
            <h2 className="mt-1 font-semibold text-slate-900">List workspaces</h2>
            <p className="text-sm text-slate-600 mt-2">Use a bearer token in the Authorization header.</p>
            <pre className="mt-3 text-xs bg-slate-950 text-slate-100 rounded-lg p-3 overflow-auto">
{`curl -s https://api.nautilus.cordros.com/v1/workspaces \\
  -H \"Authorization: Bearer <API_KEY>\" \\
  -H \"Content-Type: application/json\"`}
            </pre>
            <p className="text-xs text-slate-400 mt-2">Demo base URL. Replace with your sandbox/prod host.</p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rate limits</p>
            <h2 className="mt-1 font-semibold text-slate-900">Default quotas</h2>
            <p className="text-sm text-slate-600 mt-2">Limits vary by client tier. Contact Cordros for higher throughput.</p>
            <div className="mt-3 rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-3 py-2 text-xs font-semibold text-slate-600 uppercase tracking-wide">Endpoint</th>
                    <th className="text-right px-3 py-2 text-xs font-semibold text-slate-600 uppercase tracking-wide">Limit</th>
                    <th className="text-right px-3 py-2 text-xs font-semibold text-slate-600 uppercase tracking-wide">Burst</th>
                  </tr>
                </thead>
                <tbody>
                  {RATE_LIMITS.map((r) => (
                    <tr key={r.endpoint} className="border-b border-slate-100 last:border-0">
                      <td className="px-3 py-2 text-slate-700 text-xs">{r.endpoint}</td>
                      <td className="px-3 py-2 text-right text-slate-700 text-xs font-semibold">{r.limit}</td>
                      <td className="px-3 py-2 text-right text-slate-500 text-xs">{r.burst}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-100 bg-white p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Webhooks</p>
          <h2 className="mt-1 font-semibold text-slate-900">Event delivery (coming next)</h2>
          <p className="text-sm text-slate-600 mt-2">
            Configure webhooks to receive events for exports, new workspaces, and document ingestion pipeline updates. This enables near real-time sync into external systems.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "export.created",
              "workspace.created",
              "source.uploaded",
              "source.extraction.completed",
            ].map((e) => (
              <span key={e} className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {e}
              </span>
            ))}
          </div>
        </section>
      </div>
    </ModuleShell>
  );
}
