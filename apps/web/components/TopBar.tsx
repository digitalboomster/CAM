"use client";

import { useState, useRef, useEffect } from "react";

interface TopBarProps {
  title?: string;
  coPilotOpen: boolean;
  onCoPilotToggle: () => void;
  onExportMemo?: () => void;
  onExportLog?: () => void;
}

export default function TopBar({
  title = "Project Alpha — IC memo prep",
  coPilotOpen,
  onCoPilotToggle,
  onExportMemo,
  onExportLog,
}: TopBarProps) {
  const [exportOpen, setExportOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setExportOpen(false);
    }
    if (exportOpen) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [exportOpen]);

  return (
    <header className="h-14 shrink-0 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="font-semibold text-slate-900">{title}</h1>
        <span className="text-sm text-slate-500">Saved at 10:49am</span>
      </div>
      <div className="flex items-center gap-2">
        {(onExportMemo ?? onExportLog) && (
          <div className="relative" ref={ref}>
            <button
              onClick={() => setExportOpen((o) => !o)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
            >
              Export
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {exportOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-slate-200 bg-white shadow-lg py-1 z-50">
                {onExportMemo && <button onClick={() => { onExportMemo(); setExportOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Export memo (PDF)</button>}
                {onExportLog && <button onClick={() => { onExportLog(); setExportOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">View export log</button>}
              </div>
            )}
          </div>
        )}
        <button
          onClick={onCoPilotToggle}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            coPilotOpen
              ? "bg-nautilus-teal text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Co-Pilot
        </button>
        <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700" aria-label="Edit">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600" aria-label="Profile">
          JD
        </button>
      </div>
    </header>
  );
}
