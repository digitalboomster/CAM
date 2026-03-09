"use client";

import { useState, useEffect } from "react";
import ModuleShell from "@/components/ModuleShell";
import Link from "next/link";
import * as api from "@/lib/api";
import type { Workspace } from "@/lib/types";

export default function FindWorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.fetchWorkspaces()
      .then(setWorkspaces)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = query.trim()
    ? workspaces.filter((w) => w.name.toLowerCase().includes(query.toLowerCase()))
    : workspaces;

  const formatDate = (createdAt: string) => {
    try {
      const d = new Date(createdAt);
      return d.toLocaleDateString(undefined, { dateStyle: "short" });
    } catch {
      return "";
    }
  };

  return (
    <ModuleShell
      title="Find Workspaces"
      subtitle="Search and open document intelligence workspaces"
      action={{ label: "New Workspace", href: "/workspace" }}
    >
      <div className="max-w-2xl space-y-4">
        <input
          type="text"
          placeholder="Search by workspace name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none bg-white"
        />
        {loading ? (
          <p className="text-slate-500">Loading…</p>
        ) : error ? (
          <p className="text-red-600">Failed to load workspaces. Run <code className="bg-slate-100 px-1 rounded">npm run db:setup</code> in apps/web and refresh.</p>
        ) : filtered.length === 0 ? (
          <p className="text-slate-600">No workspaces match. Create one from <Link href="/workspace" className="text-teal-600 hover:underline">Document Intelligence</Link>.</p>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
            {filtered.map((w) => (
              <div key={w.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800">{w.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Created {formatDate(w.createdAt)}</p>
                </div>
                <Link
                  href={`/workspace?workspace=${w.id}`}
                  className="text-sm text-teal-600 hover:underline font-medium"
                >
                  Open
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </ModuleShell>
  );
}
