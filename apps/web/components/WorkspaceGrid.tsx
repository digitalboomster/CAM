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

// Extract a short page reference from source string for the badge, e.g. "p.38" or "§8"
function extractPageRef(source: string): string | null {
  const pageMatch = source.match(/(?:p|pg|page)\.?\s*(\d+)/i);
  if (pageMatch) return `p.${pageMatch[1]}`;
  const sectionMatch = source.match(/(?:section|§|slide)\s*(\d+)/i);
  if (sectionMatch) return `§${sectionMatch[1]}`;
  return null;
}

function DocTypeIcon({ type }: { type: string }) {
  const t = type.toLowerCase();
  if (t.includes("annual") || t.includes("financial") || t.includes("account")) {
    return (
      <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
    );
  }
  if (t.includes("cim") || t.includes("marketing") || t.includes("memo")) {
    return (
      <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  }
  if (t.includes("legal") || t.includes("compliance") || t.includes("regulatory")) {
    return (
      <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    );
  }
  if (t.includes("research") || t.includes("analysis") || t.includes("report")) {
    return (
      <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}

const DOC_TYPE_COLORS: Record<string, string> = {
  "Annual Report": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "CIM": "bg-violet-50 text-violet-700 border-violet-200",
  "Board Deck": "bg-blue-50 text-blue-700 border-blue-200",
  "Management Accounts": "bg-sky-50 text-sky-700 border-sky-200",
  "Legal": "bg-amber-50 text-amber-700 border-amber-200",
  "Research": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Analysis": "bg-teal-50 text-teal-700 border-teal-200",
  "Financials": "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function docTypeBadgeClass(type: string): string {
  return DOC_TYPE_COLORS[type] ?? "bg-slate-50 text-slate-600 border-slate-200";
}

function CellContent({ cell, onCellClick }: { cell: WorkspaceCell; onCellClick: () => void }) {
  if (cell.status === "reading") {
    return (
      <div className="flex items-center gap-1.5 text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse shrink-0" />
        <span className="text-xs italic">Reading…</span>
      </div>
    );
  }
  if (cell.status === "no-answer") {
    return (
      <span
        className="text-slate-400 text-xs italic cursor-pointer hover:text-slate-600"
        onClick={onCellClick}
        title="Click for explanation"
      >
        — not found
      </span>
    );
  }
  const pageRef = cell.source ? extractPageRef(cell.source) : null;
  return (
    <div
      className="group cursor-pointer space-y-1"
      onClick={onCellClick}
      title="Click to view source citation"
    >
      <p className="text-sm text-slate-700 line-clamp-2 leading-snug group-hover:text-slate-900">
        {cell.text}
      </p>
      {(pageRef || cell.docRef) && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {pageRef && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-teal-50 text-teal-700 border border-teal-200 group-hover:bg-teal-100">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {pageRef}
            </span>
          )}
          {cell.stepId != null && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-50 text-slate-500 border border-slate-200">
              step {cell.stepId}
            </span>
          )}
        </div>
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
  const rowPadding = viewOptions.density === "compact" ? "py-2" : "py-3";

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
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-slate-100 bg-slate-50/50 flex-wrap">
          <div className="flex items-center gap-3">
            {rows.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full transition-all" style={{ width: `${coverage}%` }} />
                  </div>
                  <span className="font-medium text-slate-600">{coverage}% coverage</span>
                </div>
                <span>·</span>
                <span>{rows.length} document{rows.length !== 1 ? "s" : ""}</span>
                <span>·</span>
                <span>{visibleColumns.length} column{visibleColumns.length !== 1 ? "s" : ""}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <ViewOptionsDropdown columnIds={extractionColumns} options={viewOptions} onOptionsChange={onViewOptionsChange}>
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              View options
            </ViewOptionsDropdown>
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-white border border-slate-200"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Add documents
            </button>
            <button
              onClick={onOpenAddField}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-white border border-slate-200"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add column
            </button>
            {onExportMemo && (
              <button
                onClick={onExportMemo}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-nautilus-teal hover:bg-teal-50 border border-teal-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export memo
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="w-10 px-3 py-2.5 text-left">
                  <input type="checkbox" className="rounded border-slate-300 text-nautilus-teal focus:ring-nautilus-teal" />
                </th>
                <th className="w-8 px-2 py-2.5 text-left text-slate-400 font-medium text-xs">#</th>
                <th className="w-7 px-2 py-2.5" aria-label="Reorder" />
                <th className="px-3 py-2.5 text-left font-semibold text-slate-700 text-xs uppercase tracking-wide min-w-[220px]">Source</th>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-700 text-xs uppercase tracking-wide">Date</th>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-700 text-xs uppercase tracking-wide">Type</th>
                {visibleColumns.map((col) => (
                  <th key={col} className="px-3 py-2.5 text-left font-semibold text-slate-700 text-xs uppercase tracking-wide min-w-[210px]">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6 + visibleColumns.length} className="px-4 py-14">
                    <div className="max-w-lg mx-auto space-y-4 text-center">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-teal-50 flex items-center justify-center">
                        <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-slate-800 font-semibold">No documents yet</p>
                        <p className="text-sm text-slate-500 mt-1">
                          Upload source documents then add extraction columns. Nautilus Co-Pilot will extract, cite, and cross-reference across all sources.
                        </p>
                      </div>
                      {onStarterTemplateClick && (
                        <div>
                          <p className="text-xs text-slate-400 mb-2">Start with a template:</p>
                          <div className="flex flex-wrap justify-center gap-2">
                            {[
                              { label: "M&A Deal Points", query: "What were key negotiation levers in similar past deals? Extract and compare key M&A provisions." },
                              { label: "IC Memo", query: "Draft an investment committee memo with sources and citations from the uploaded documents." },
                              { label: "Due Diligence", query: "Surface answers to key due diligence questions across these materials. Flag risks and mitigants." },
                            ].map((t) => (
                              <button
                                key={t.label}
                                type="button"
                                onClick={() => onStarterTemplateClick(t.query)}
                                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-700 hover:border-nautilus-teal hover:bg-teal-50 transition-colors"
                              >
                                {t.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => (
                  <tr key={row.id} className={`border-b border-slate-100 hover:bg-slate-50/40 transition-colors ${rowPadding}`}>
                    <td className="px-3">
                      <input type="checkbox" className="rounded border-slate-300 text-nautilus-teal focus:ring-nautilus-teal" />
                    </td>
                    <td className="px-2 text-slate-400 text-xs">{idx + 1}</td>
                    <td className="px-2 text-slate-300 cursor-grab hover:text-slate-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 6h2v2H8V6zm0 5h2v2H8v-2zm0 5h2v2H8v-2zm5-10h2v2h-2V6zm0 5h2v2h-2v-2zm0 5h2v2h-2v-2z" />
                      </svg>
                    </td>
                    <td className="px-3">
                      <div className="flex items-start gap-2">
                        <DocTypeIcon type={row.documentType} />
                        <span className="text-slate-800 font-medium text-sm leading-snug">{row.documentName}</span>
                      </div>
                    </td>
                    <td className="px-3 text-slate-500 text-xs whitespace-nowrap">{row.date}</td>
                    <td className="px-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${docTypeBadgeClass(row.documentType)}`}>
                        {row.documentType}
                      </span>
                    </td>
                    {extractionColumns.map((col, cellIdx) => {
                      if (viewOptions.hiddenColumnIds.has(col)) return null;
                      const cellData = row.cells[cellIdx];
                      if (!cellData) {
                        return (
                          <td key={col} className="px-3 text-slate-300 text-xs align-top">—</td>
                        );
                      }
                      return (
                        <td
                          key={col}
                          className={`px-3 max-w-[260px] align-top ${rowPadding} ${cellData.status === "snippet" ? "hover:bg-teal-50/30 cursor-pointer" : ""}`}
                          onClick={() => handleCellClick(cellData)}
                        >
                          <CellContent cell={cellData} onCellClick={() => handleCellClick(cellData)} />
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-4 py-2 bg-slate-50/30 flex items-center justify-between">
          <button
            onClick={onOpenAddSource}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 transition-colors"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded border border-dashed border-slate-300 hover:border-teal-400 text-slate-400 hover:text-teal-500">+</span>
            Add row
          </button>
          {rows.length > 0 && (
            <p className="text-xs text-slate-400">
              Click any cell to view source citation
            </p>
          )}
        </div>
      </div>

      <CitationPanel citation={citation} explanation={explanation} onClose={closePanel} />
    </>
  );
}
