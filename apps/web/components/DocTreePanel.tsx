"use client";

import { useState } from "react";
import type { WorkspaceRow } from "@/lib/types";
import { SOURCE_CATEGORIES } from "@/lib/types";

interface DocTreePanelProps {
  rows: WorkspaceRow[];
  onSelectSource?: (sourceId: string) => void;
  className?: string;
}

export default function DocTreePanel({ rows, onSelectSource, className = "" }: DocTreePanelProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(SOURCE_CATEGORIES));

  const byCategory = new Map<string, WorkspaceRow[]>();
  for (const cat of SOURCE_CATEGORIES) {
    byCategory.set(cat, []);
  }
  for (const row of rows) {
    const cat = SOURCE_CATEGORIES.includes(row.category as (typeof SOURCE_CATEGORIES)[number])
      ? row.category
      : "Other";
    byCategory.get(cat)!.push(row);
  }

  const toggle = (cat: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className={`flex flex-col rounded-lg border border-slate-200 bg-white overflow-hidden ${className}`}>
      <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/80">
        <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Doc tree</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {SOURCE_CATEGORIES.map((cat) => {
          const items = byCategory.get(cat) ?? [];
          const isExpanded = expanded.has(cat);
          return (
            <div key={cat} className="mb-2">
              <button
                type="button"
                onClick={() => toggle(cat)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 text-left"
              >
                <svg
                  className={`w-4 h-4 shrink-0 text-slate-500 transition-transform ${isExpanded ? "" : "-rotate-90"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {cat}
                <span className="text-slate-400 font-normal">({items.length})</span>
              </button>
              {isExpanded && (
                <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-200 pl-2">
                  {items.map((row) => (
                    <li key={row.id}>
                      <button
                        type="button"
                        onClick={() => onSelectSource?.(row.id)}
                        className="w-full text-left px-2 py-1.5 rounded text-sm text-slate-600 hover:bg-slate-50 truncate flex items-center gap-2"
                        title={row.documentName}
                      >
                        <svg
                          className="w-3.5 h-3.5 shrink-0 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        {row.documentName}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
