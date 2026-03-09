"use client";

import { useState, useCallback } from "react";
import CitationPanel from "./CitationPanel";
import ViewOptionsDropdown, { type ViewOptionsState } from "./ViewOptionsDropdown";
import type { WorkspaceRow, WorkspaceCell } from "@/lib/types";

interface WorkspaceGridProps {
  rows: WorkspaceRow[];
  extractionColumns: string[];
  viewOptions: ViewOptionsState;
  onViewOptionsChange: (options: ViewOptionsState) => void;
  onOpenUpload: () => void;
  onOpenAddField: () => void;
  onOpenAddSource: () => void;
  onExportMemo?: () => void;
  onStarterTemplateClick?: (query: string) => void;
}

function extractPageRef(source: string): string | null {
  const pageMatch = source.match(/(?:p|pg|page)\.?\s*(\d+)/i);
  if (pageMatch) return `p.${pageMatch[1]}`;
  const sectionMatch = source.match(/(?:section|§|slide)\s*(\d+)/i);
  if (sectionMatch) return `§${sectionMatch[1]}`;
  return null;
}

const DOC_TYPE_COLORS: Record<string, string> = {
  "Annual Report":       "bg-emerald-50 text-emerald-700",
  "CIM":                 "bg-violet-50  text-violet-700",
  "Board Deck":          "bg-blue-50    text-blue-700",
  "Management Accounts": "bg-sky-50     text-sky-700",
  "Legal":               "bg-amber-50   text-amber-700",
  "Research":            "bg-indigo-50  text-indigo-700",
  "Analysis":            "bg-teal-50    text-teal-700",
};

function docTypeBadgeClass(type: string): string {
  return DOC_TYPE_COLORS[type] ?? "bg-slate-100 text-slate-600";
}

function SourceCell({ row }: { row: WorkspaceRow }) {
  return (
    <div className="min-w-0">
      <p className="font-medium text-slate-800 text-sm leading-snug truncate">{row.documentName}</p>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className="text-[11px] text-slate-400">{row.date}</span>
        <span className="text-slate-200">·</span>
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${docTypeBadgeClass(row.documentType)}`}>
          {row.documentType}
        </span>
      </div>
    </div>
  );
}

function CellContent({ cell, onCellClick }: { cell: WorkspaceCell; onCellClick: () => void }) {
  if (cell.status === "reading") {
    return (
      <div className="flex items-center gap-1.5 text-slate-300 py-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse shrink-0" />
        <span className="text-xs italic text-slate-400">Reading…</span>
      </div>
    );
  }
  if (cell.status === "no-answer") {
    return (
      <span
        className="text-slate-300 text-xs italic cursor-pointer hover:text-slate-500 transition-colors"
        onClick={onCellClick}
      >
        — not found
      </span>
    );
  }

  const pageRef = cell.source ? extractPageRef(cell.source) : null;

  return (
    <div className="group/cell cursor-pointer" onClick={onCellClick}>
      <p className="text-[13px] text-slate-700 line-clamp-2 leading-relaxed group-hover/cell:text-slate-900 transition-colors">
        {cell.text}
      </p>
      {pageRef && (
        <span className="inline-flex items-center gap-0.5 mt-1 text-[10px] text-slate-300 group-hover/cell:text-teal-500 transition-colors font-mono">
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {pageRef}
        </span>
      )}
    </div>
  );
}

export default function WorkspaceGrid({
  rows,
  extractionColumns,
  viewOptions,
  onViewOptionsChange,
  onOpenUpload,
  onOpenAddField,
  onOpenAddSource,
  onExportMemo,
  onStarterTemplateClick,
}: WorkspaceGridProps) {
  const [citation, setCitation] = useState<{ source: string; docRef: string; stepId?: number } | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);

  const visibleColumns = extractionColumns.filter((id) => !viewOptions.hiddenColumnIds.has(id));

  const handleCellClick = useCallback((cell: WorkspaceCell) => {
    if (cell.status === "no-answer") {
      setExplanation("This field was not found in the source. The model searched for relevant content but did not identify a direct statement. Consider adding a more specific column name, uploading additional documents, or checking an alternative source.");
      setCitation(null);
    } else if (cell.source && cell.docRef) {
      setCitation({ source: cell.source, docRef: cell.docRef, stepId: cell.stepId });
      setExplanation(null);
    }
  }, []);

  const closePanel = useCallback(() => {
    setCitation(null);
    setExplanation(null);
  }, []);

  const filledCells = rows.flatMap((r) => r.cells).filter((c) => c.status === "snippet").length;
  const totalCells = rows.length * visibleColumns.length;
  const coverage = totalCells > 0 ? Math.round((filledCells / totalCells) * 100) : 0;

  return (
    <>
      <div className="rounded-xl border border-slate-100 bg-white overflow-hidden shadow-sm">

        {/* ── Toolbar ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3 min-w-0">
            {rows.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full transition-all" style={{ width: `${coverage}%` }} />
                  </div>
                  <span className="font-medium text-slate-500">{coverage}%</span>
                </div>
                <span className="text-slate-200">·</span>
                <span>{rows.length} doc{rows.length !== 1 ? "s" : ""}</span>
                <span className="text-slate-200">·</span>
                <span>{visibleColumns.length} field{visibleColumns.length !== 1 ? "s" : ""}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <ViewOptionsDropdown columnIds={extractionColumns} options={viewOptions} onOptionsChange={onViewOptionsChange}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              View
            </ViewOptionsDropdown>
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload docs
            </button>
            <button
              onClick={onOpenAddField}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add column
            </button>
            {onExportMemo && (
              <button
                onClick={onExportMemo}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-nautilus-accent text-white hover:bg-nautilus-accent-hover shadow-sm transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export memo
              </button>
            )}
          </div>
        </div>

        {/* ── Table ───────────────────────────────────────────────────── */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="sticky-source-header px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider min-w-[240px] sticky left-0 z-20 isolate shadow-[4px_0_6px_-2px_rgba(0,0,0,0.08)]">
                  Source
                </th>
                {visibleColumns.map((col) => (
                  <th key={col} className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider min-w-[220px] bg-slate-50/80">
                    {col}
                  </th>
                ))}
                <th className="w-10 bg-slate-50/80" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 2} className="px-4 py-16">
                    <div className="max-w-md mx-auto text-center">
                      <div className="w-11 h-11 mx-auto rounded-xl bg-teal-50 flex items-center justify-center mb-4">
                        <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-slate-800 font-semibold text-sm">No documents yet</p>
                      <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                        Upload source documents, then add extraction columns. Co-Pilot will extract, cite, and cross-reference across every source.
                      </p>
                      {onStarterTemplateClick && (
                        <div className="mt-5 flex flex-wrap justify-center gap-2">
                          {["IC Memo", "Due Diligence", "M&A Deal Points"].map((label) => (
                            <button
                              key={label}
                              type="button"
                              onClick={() => onStarterTemplateClick(`Surface ${label} insights from uploaded documents with citations.`)}
                              className="px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="group/row hover:bg-slate-50 transition-colors"
                  >
                    {/* Source cell — sticky; fully opaque so scrolled columns never show through */}
                    <td className="sticky-source-cell px-4 py-3 sticky left-0 z-20 isolate transition-colors border-r border-slate-200 shadow-[4px_0_8px_-2px_rgba(0,0,0,0.08)]">
                      <div className="min-h-full min-w-full bg-inherit">
                        <SourceCell row={row} />
                      </div>
                    </td>

                    {/* Extraction cells */}
                    {extractionColumns.map((col, cellIdx) => {
                      if (viewOptions.hiddenColumnIds.has(col)) return null;
                      const cellData = row.cells[cellIdx];
                      if (!cellData) {
                        return <td key={col} className="px-4 py-3 text-slate-200 text-xs">—</td>;
                      }
                      return (
                        <td key={col} className="px-4 py-3 align-top max-w-[260px]">
                          <CellContent cell={cellData} onCellClick={() => handleCellClick(cellData)} />
                        </td>
                      );
                    })}

                    {/* Add-column ghost cell */}
                    <td className="w-10 px-2 py-3 opacity-0 group-hover/row:opacity-100 transition-opacity">
                      <button
                        onClick={onOpenAddField}
                        className="flex items-center justify-center w-6 h-6 rounded border border-dashed border-slate-300 text-slate-400 hover:border-teal-400 hover:text-teal-500 hover:bg-teal-50 transition-colors"
                        title="Add column"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <div className="border-t border-slate-50 px-4 py-2 flex items-center justify-between">
          <button
            onClick={onOpenAddSource}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-600 transition-colors"
          >
            <span className="flex items-center justify-center w-5 h-5 rounded border border-dashed border-slate-200 hover:border-teal-300">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </span>
            Add document
          </button>
          {rows.length > 0 && (
            <p className="text-[10px] text-slate-300">Click any cell to view source citation</p>
          )}
        </div>
      </div>

      <CitationPanel citation={citation} explanation={explanation} onClose={closePanel} />
    </>
  );
}
