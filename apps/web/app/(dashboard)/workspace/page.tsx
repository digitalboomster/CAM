"use client";

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useWorkspaceNav } from "@/contexts/WorkspaceNavContext";
import CoPilotPanel from "@/components/CoPilotPanel";
import WorkspaceGrid from "@/components/WorkspaceGrid";
import UploadSourcesModal from "@/components/UploadSourcesModal";
import AddFieldModal from "@/components/AddFieldModal";
import AddSourceModal from "@/components/AddSourceModal";
import ExportMemoModal from "@/components/ExportMemoModal";
import ExportLogModal from "@/components/ExportLogModal";
import DocTreePanel from "@/components/DocTreePanel";
import type { Workspace, WorkspaceGridData, ExportLogEntry } from "@/lib/types";
import { createEmptyGridData, createDefaultDDGridData } from "@/lib/defaults";
import type { ViewOptionsState } from "@/components/ViewOptionsDropdown";
import * as api from "@/lib/api";
import { loadSettings } from "@/lib/settings";

const STORAGE_KEY_UI = "nautilus.ui.v1";
type UIState = {
  activeWorkspaceId: string | null;
  viewOptions: { hiddenColumnIds: string[]; density: ViewOptionsState["density"] };
};

const STARTER_QUERIES = [
  { label: "IC Memo", query: "Draft an investment committee memo with sources and citations from the uploaded documents." },
  { label: "Due Diligence", query: "Surface answers to key due diligence questions across these materials. Flag risks and mitigants." },
  { label: "M&A Deal Points", query: "What were key negotiation levers in similar past deals? Extract and compare key M&A provisions." },
  { label: "Risk Summary", query: "Identify and rank the top risks across all documents. Cite the source for each." },
  { label: "Valuation", query: "Summarise valuation inputs and comparable multiples from the source documents." },
];

function WorkspacePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nav = useWorkspaceNav();
  const [coPilotOpen, setCoPilotOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [gridData, setGridData] = useState<Record<string, WorkspaceGridData>>({});
  const [exportLog, setExportLog] = useState<ExportLogEntry[]>([]);
  const [viewOptions, setViewOptions] = useState<ViewOptionsState>({
    hiddenColumnIds: new Set(),
    density: "comfortable",
  });
  const [loading, setLoading] = useState(true);
  const [apiOk, setApiOk] = useState(true);
  const uiRestoredRef = useRef(false);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [addFieldModalOpen, setAddFieldModalOpen] = useState(false);
  const [addSourceModalOpen, setAddSourceModalOpen] = useState(false);
  const [exportMemoModalOpen, setExportMemoModalOpen] = useState(false);
  const [exportLogModalOpen, setExportLogModalOpen] = useState(false);
  const [exportModalDefaultTitle, setExportModalDefaultTitle] = useState<string | undefined>(undefined);
  const [docTreeOpen, setDocTreeOpen] = useState(false);
  const [queryBarQuery, setQueryBarQuery] = useState("");
  const [coPilotInitialQuery, setCoPilotInitialQuery] = useState<string | undefined>(undefined);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const queryInputRef = useRef<HTMLInputElement>(null);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) ?? workspaces[0];
  const resolvedWorkspaceId = activeWorkspace?.id ?? activeWorkspaceId ?? "";
  const currentGrid = gridData[resolvedWorkspaceId] ?? createEmptyGridData();

  const exportFromUrl = searchParams.get("export") === "1";
  const exportLabelFromUrl = searchParams.get("label");

  const loadWorkspaces = useCallback(async () => {
    try {
      const list = await api.fetchWorkspaces();
      setWorkspaces(list);
      const fromUrl = typeof window !== "undefined" ? searchParams.get("workspace") : null;
      if (list.length > 0) {
        let preferred: string;
        if (fromUrl && list.some((w) => w.id === fromUrl)) {
          preferred = fromUrl;
        } else if (typeof window !== "undefined") {
          const saved = localStorage.getItem(STORAGE_KEY_UI);
          const parsed = saved ? (JSON.parse(saved) as UIState) : null;
          preferred =
            parsed?.activeWorkspaceId && list.some((w) => w.id === parsed.activeWorkspaceId)
              ? parsed.activeWorkspaceId
              : list[0].id;
        } else {
          preferred = list[0].id;
        }
        setActiveWorkspaceId(preferred);
        if (fromUrl && list.some((w) => w.id === fromUrl)) {
          const { grid } = await api.fetchWorkspaceGrid(fromUrl);
          setGridData((g) => ({ ...g, [fromUrl]: grid }));
        }
      }
      setApiOk(true);
    } catch {
      setApiOk(false);
      setWorkspaces([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!uiRestoredRef.current && typeof window !== "undefined") {
      uiRestoredRef.current = true;
      try {
        const raw = localStorage.getItem(STORAGE_KEY_UI);
        if (raw) {
          const parsed = JSON.parse(raw) as UIState;
          if (parsed.viewOptions) {
            setViewOptions({
              hiddenColumnIds: new Set(parsed.viewOptions.hiddenColumnIds ?? []),
              density: parsed.viewOptions.density ?? "comfortable",
            });
          }
        }
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => { loadWorkspaces(); }, [loadWorkspaces]);

  useEffect(() => {
    if (nav) {
      nav.setWorkspaces(workspaces);
      nav.setActiveWorkspaceId(activeWorkspaceId);
    }
  }, [nav, workspaces, activeWorkspaceId]);

  useEffect(() => {
    if (!resolvedWorkspaceId || !apiOk) return;
    api.fetchWorkspaceGrid(resolvedWorkspaceId).then(({ grid }) => {
      setGridData((g) => ({ ...g, [resolvedWorkspaceId]: grid }));
    }).catch(() => {});
  }, [resolvedWorkspaceId, apiOk]);

  useEffect(() => {
    if (exportLogModalOpen && apiOk) {
      api.fetchExportLog().then(setExportLog).catch(() => {});
    }
  }, [exportLogModalOpen, apiOk]);

  useEffect(() => {
    try {
      const payload: UIState = {
        activeWorkspaceId,
        viewOptions: {
          hiddenColumnIds: Array.from(viewOptions.hiddenColumnIds),
          density: viewOptions.density,
        },
      };
      localStorage.setItem(STORAGE_KEY_UI, JSON.stringify(payload));
    } catch { /* ignore */ }
  }, [activeWorkspaceId, viewOptions]);

  useEffect(() => {
    if (workspaces.length === 0 || activeWorkspaceId) return;
    const exists = workspaces.some((w) => w.id === activeWorkspaceId);
    if (!exists) setActiveWorkspaceId(workspaces[0].id);
  }, [workspaces, activeWorkspaceId]);

  useEffect(() => {
    if (loading || !apiOk || workspaces.length === 0 || !exportFromUrl) return;
    setExportModalDefaultTitle(exportLabelFromUrl ?? undefined);
    setExportMemoModalOpen(true);
    const url = new URL(window.location.href);
    url.searchParams.delete("export");
    url.searchParams.delete("label");
    router.replace(url.pathname + url.search);
  }, [loading, apiOk, workspaces.length, exportFromUrl, exportLabelFromUrl, router]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target as Node)) {
        setExportDropdownOpen(false);
      }
    }
    if (exportDropdownOpen) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [exportDropdownOpen]);

  const refetchGrid = useCallback((workspaceId: string) => {
    api.fetchWorkspaceGrid(workspaceId).then(({ grid }) => {
      setGridData((g) => ({ ...g, [workspaceId]: grid }));
    }).catch(() => {});
  }, []);

  const handleNewWorkspace = useCallback(async () => {
    if (!apiOk) return;
    try {
      const name = `Workspace ${workspaces.length + 1}`;
      const ws = await api.createWorkspace(name);
      setWorkspaces((w) => [...w, ws]);
      setGridData((g) => ({ ...g, [ws.id]: createDefaultDDGridData() }));
      setActiveWorkspaceId(ws.id);
      refetchGrid(ws.id);
    } catch {
      setApiOk(false);
    }
  }, [apiOk, workspaces.length, refetchGrid]);

  const handleNewWorkspaceRef = useRef(handleNewWorkspace);
  handleNewWorkspaceRef.current = handleNewWorkspace;
  useEffect(() => {
    if (!nav) return;
    nav.setOnNewWorkspace(() => handleNewWorkspaceRef.current());
    return () => { nav.setOnNewWorkspace(() => {}); };
  }, [nav]);

  const handleUpload = useCallback(
    async (files: { name: string; date: string; type: string }[]) => {
      if (!apiOk || !resolvedWorkspaceId) return;
      try {
        await api.addSources(resolvedWorkspaceId, files);
        refetchGrid(resolvedWorkspaceId);
        setUploadModalOpen(false);
      } catch { setApiOk(false); }
    },
    [apiOk, resolvedWorkspaceId, refetchGrid]
  );

  const handleAddField = useCallback(
    async (name: string) => {
      if (!apiOk || !resolvedWorkspaceId) return;
      if (currentGrid.extractionColumns.includes(name)) {
        setAddFieldModalOpen(false);
        return;
      }
      try {
        await api.addField(resolvedWorkspaceId, name);
        refetchGrid(resolvedWorkspaceId);
        setAddFieldModalOpen(false);
      } catch { setApiOk(false); }
    },
    [apiOk, resolvedWorkspaceId, currentGrid.extractionColumns, refetchGrid]
  );

  const handleAddSource = useCallback(
    async (source: { name: string; date: string; type: string }) => {
      if (!apiOk || !resolvedWorkspaceId) return;
      try {
        await api.addSources(resolvedWorkspaceId, [source]);
        refetchGrid(resolvedWorkspaceId);
        setAddSourceModalOpen(false);
      } catch { setApiOk(false); }
    },
    [apiOk, resolvedWorkspaceId, refetchGrid]
  );

  const handleExportMemo = useCallback(
    async (title: string) => {
      if (!apiOk || !resolvedWorkspaceId) return;
      const settings = loadSettings();
      if (settings.requireCitationsOnExport) {
        const hasUncited = currentGrid.rows.some((row) =>
          row.cells.some((c) => (c.status === "snippet" || c.status === "no-answer") && c.text && !c.source)
        );
        if (hasUncited) {
          alert('Export blocked: some cells have no citation. Add citations or turn off "Require citations on exports" in Settings.');
          return;
        }
      }
      try {
        await api.recordExport(resolvedWorkspaceId, title, "Demo User");
        const log = await api.fetchExportLog();
        setExportLog(log);
        setExportMemoModalOpen(false);
        const pdfUrl = api.getExportPdfUrl(resolvedWorkspaceId, title);
        const res = await fetch(pdfUrl);
        if (res.ok) {
          const blob = await res.blob();
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `${title.replace(/[^a-z0-9-_]/gi, "_")}.pdf`;
          a.click();
          URL.revokeObjectURL(a.href);
        }
      } catch { setApiOk(false); }
    },
    [apiOk, resolvedWorkspaceId, currentGrid.rows]
  );

  const askCoPilot = (q?: string) => {
    setCoPilotInitialQuery(q);
    setCoPilotOpen(true);
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          Loading workspaces…
        </div>
      </div>
    );
  }

  // ── DB error ────────────────────────────────────────────────────────────────
  if (!apiOk && workspaces.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-50 p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 max-w-md text-center shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="font-semibold text-slate-900">Could not connect to database</p>
          <p className="text-sm text-slate-500 mt-2">From repo root or <code className="bg-slate-100 px-1 rounded">apps/web</code> run:</p>
          <code className="block mt-2 bg-slate-100 p-2 rounded text-left text-sm">npm run db:setup</code>
          <p className="text-xs text-slate-400 mt-3">Then click Try again below. If it still fails, restart the dev server.</p>
          <button
            type="button"
            onClick={() => { setApiOk(true); loadWorkspaces(); }}
            className="mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-nautilus-accent text-white hover:bg-nautilus-accent-hover"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // ── Empty — no workspaces ──────────────────────────────────────────────────
  if (workspaces.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-50 p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 max-w-lg w-full text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mx-auto mb-5 shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="font-bold text-slate-900 text-xl">Document Intelligence</h2>
          <p className="text-slate-500 mt-2 mb-6 leading-relaxed">
            Your AI-powered extraction matrix. Upload documents, define columns, and Co-Pilot extracts, cites, and cross-references across every source.
          </p>
          <button
            type="button"
            onClick={handleNewWorkspace}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-nautilus-accent text-white hover:bg-nautilus-accent-hover shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create first workspace
          </button>
          <p className="text-sm text-slate-500 mt-6 mb-3 font-medium">Or start with a template:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {STARTER_QUERIES.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={async () => {
                  await handleNewWorkspace();
                  askCoPilot(t.query);
                }}
                className="px-3 py-1.5 rounded-lg text-sm border border-slate-200 text-slate-600 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 transition-colors"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Coverage stats ─────────────────────────────────────────────────────────
  const docCount = currentGrid.rows.length;
  const colCount = currentGrid.extractionColumns.length;
  const filledCells = currentGrid.rows.flatMap((r) => r.cells).filter((c) => c.status === "snippet").length;
  const totalCells = docCount * colCount;
  const coverage = totalCells > 0 ? Math.round((filledCells / totalCells) * 100) : 0;

  // ── Main workspace view ────────────────────────────────────────────────────
  return (
    <div className="flex flex-col flex-1 min-h-0 min-w-0 bg-white">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="shrink-0 border-b border-slate-100 bg-white">
        {/* Single row: title · workspace tabs · stats · actions */}
        <div className="flex items-center gap-3 px-5 h-12">

          {/* Title */}
          <span className="font-semibold text-slate-800 text-sm shrink-0">Document Intelligence</span>
          <span className="text-slate-200 shrink-0">·</span>

          {/* Workspace tabs */}
          <div className="flex items-center gap-0.5 overflow-x-auto min-w-0 flex-1">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                type="button"
                onClick={() => setActiveWorkspaceId(ws.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  (activeWorkspace?.id ?? workspaces[0]?.id) === ws.id
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                {ws.name}
              </button>
            ))}
            <button
              type="button"
              onClick={handleNewWorkspace}
              className="flex items-center gap-1 px-2 py-1.5 text-xs text-slate-300 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New
            </button>
          </div>

          {/* Coverage stats */}
          {docCount > 0 && (
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-400">{docCount} docs</span>
              <span className="text-slate-200">·</span>
              <span className="text-xs text-slate-400">{colCount} fields</span>
              <span className="text-slate-200">·</span>
              <div className="flex items-center gap-1.5">
                <div className="w-14 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-400 rounded-full" style={{ width: `${coverage}%` }} />
                </div>
                <span className="text-xs font-medium text-teal-600">{coverage}%</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Doc tree toggle */}
            {currentGrid.rows.length > 0 && (
              <button
                type="button"
                onClick={() => setDocTreeOpen((o) => !o)}
                title={docTreeOpen ? "Hide doc tree" : "Show doc tree"}
                className={`p-1.5 rounded-md text-xs transition-colors ${docTreeOpen ? "bg-slate-100 text-slate-600" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h7" />
                </svg>
              </button>
            )}

            {/* Export */}
            <div className="relative" ref={exportDropdownRef}>
              <button
                type="button"
                onClick={() => setExportDropdownOpen((o) => !o)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-50 border border-slate-200 font-medium"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
              {exportDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 rounded-xl border border-slate-200 bg-white shadow-xl py-1.5 z-50">
                  <button
                    type="button"
                    onClick={() => { setExportMemoModalOpen(true); setExportDropdownOpen(false); }}
                    className="w-full text-left px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export memo (PDF)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setExportLogModalOpen(true); setExportDropdownOpen(false); }}
                    className="w-full text-left px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    View export log
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  <a href="/reports" className="w-full text-left px-3.5 py-2 text-sm text-slate-500 hover:bg-slate-50 flex items-center gap-2">
                    All reports →
                  </a>
                </div>
              )}
            </div>

            {/* Co-Pilot */}
            <button
              type="button"
              onClick={() => setCoPilotOpen((o) => !o)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                coPilotOpen
                  ? "bg-teal-600 text-white"
                  : "bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Co-Pilot
              {!coPilotOpen && <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main body ────────────────────────────────────────────────────── */}
      <main className="flex-1 flex overflow-hidden min-h-0">

        {/* Doc tree */}
        {docTreeOpen && currentGrid.rows.length > 0 && (
          <aside className="w-48 shrink-0 border-r border-slate-100 bg-slate-50/60 flex flex-col overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">By category</span>
            </div>
            <DocTreePanel rows={currentGrid.rows} className="flex-1 min-h-0" />
          </aside>
        )}

        {/* Grid + Co-Pilot ask bar */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* Ask bar */}
          <div className="shrink-0 px-5 py-3 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-0 rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-400/20 transition-all">
              <div className="pl-3.5 text-slate-300 shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <input
                ref={queryInputRef}
                type="text"
                placeholder="Ask Co-Pilot — e.g. What are the key risks across all sources?"
                value={queryBarQuery}
                onChange={(e) => setQueryBarQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") askCoPilot(queryBarQuery.trim() || undefined); }}
                className="flex-1 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
              <div className="flex items-center gap-1 pr-1.5">
                {STARTER_QUERIES.map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => askCoPilot(q.query)}
                    className="hidden lg:block px-2 py-1 rounded text-[11px] text-slate-400 hover:bg-slate-50 hover:text-teal-600 whitespace-nowrap transition-colors"
                  >
                    {q.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => askCoPilot(queryBarQuery.trim() || undefined)}
                  className="ml-1 px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Ask
                </button>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-auto p-5">
            <WorkspaceGrid
              rows={currentGrid.rows}
              extractionColumns={currentGrid.extractionColumns}
              viewOptions={viewOptions}
              onViewOptionsChange={setViewOptions}
              onOpenUpload={() => setUploadModalOpen(true)}
              onOpenAddField={() => setAddFieldModalOpen(true)}
              onOpenAddSource={() => setAddSourceModalOpen(true)}
              onExportMemo={() => setExportMemoModalOpen(true)}
              onStarterTemplateClick={askCoPilot}
            />
          </div>
        </div>

        {/* Co-Pilot panel */}
        {coPilotOpen && (
          <div className="w-[380px] shrink-0 flex flex-col border-l border-slate-100 bg-white">
            <CoPilotPanel
              initialQuery={coPilotInitialQuery}
              onClose={() => { setCoPilotOpen(false); setCoPilotInitialQuery(undefined); }}
              onOpenExportLog={() => { setCoPilotOpen(false); setExportLogModalOpen(true); }}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      {uploadModalOpen && <UploadSourcesModal onClose={() => setUploadModalOpen(false)} onUpload={handleUpload} />}
      {addFieldModalOpen && <AddFieldModal onClose={() => setAddFieldModalOpen(false)} onAdd={handleAddField} />}
      {addSourceModalOpen && <AddSourceModal onClose={() => setAddSourceModalOpen(false)} onAdd={handleAddSource} />}
      {exportMemoModalOpen && (
        <ExportMemoModal
          workspaceName={activeWorkspace?.name ?? "Workspace"}
          defaultTitle={exportModalDefaultTitle}
          onClose={() => { setExportMemoModalOpen(false); setExportModalDefaultTitle(undefined); }}
          onExport={handleExportMemo}
        />
      )}
      {exportLogModalOpen && <ExportLogModal entries={exportLog} onClose={() => setExportLogModalOpen(false)} />}
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-1 items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          Loading…
        </div>
      </div>
    }>
      <WorkspacePageContent />
    </Suspense>
  );
}
