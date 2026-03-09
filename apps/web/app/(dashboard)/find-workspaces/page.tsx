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
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by workspace name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-nautilus-accent/20 focus:border-nautilus-accent outline-none bg-white"
            />
            <Link
              href="/workspace"
              className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-nautilus-accent text-white hover:bg-nautilus-accent-hover shadow-sm text-center"
            >
              Create workspace
            </Link>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Tip: Use Templates to create a workspace with predefined columns, then open Co-Pilot to generate citations and exports.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-slate-500 text-sm py-4">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            Loading workspaces…
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Failed to load workspaces. Run <code className="bg-white/60 px-1 rounded">npm run db:setup</code> in <code className="bg-white/60 px-1 rounded">apps/web</code> and refresh.
          </div>
        ) : workspaces.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="font-semibold text-slate-900">No workspaces yet</p>
            <p className="text-sm text-slate-500 mt-2">
              Create a workspace, upload documents, add columns, then run Co-Pilot to generate a committee-ready report.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2">
              <Link
                href="/templates"
                className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Use a template
              </Link>
              <Link
                href="/workspace"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-nautilus-accent text-white hover:bg-nautilus-accent-hover shadow-sm"
              >
                Create workspace
              </Link>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-slate-900">No matches</p>
            <p className="text-sm text-slate-500 mt-2">Try a different name or clear your search.</p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-4 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((w) => (
              <div key={w.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{w.name}</p>
                    <p className="text-xs text-slate-400 mt-1">Created {formatDate(w.createdAt)}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    Workspace
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Link
                    href={`/workspace?workspace=${w.id}`}
                    className="text-sm font-semibold text-nautilus-accent hover:underline"
                  >
                    Open →
                  </Link>
                  <Link
                    href={`/workspace?workspace=${w.id}&export=1&label=${encodeURIComponent("IC Memo")}`}
                    className="text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-lg"
                  >
                    Generate report
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ModuleShell>
  );
}
