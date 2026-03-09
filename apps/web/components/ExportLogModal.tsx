"use client";

import type { ExportLogEntry } from "@/lib/types";

const DEMO_EXPORT_LOG: ExportLogEntry[] = [
  { id: "demo-1", at: "10:24 AM", label: "Project Alpha — IC Memo (PDF)", exportedBy: "Demo User", createdAt: new Date().toISOString() },
  { id: "demo-2", at: "Yesterday", label: "Dangote Cement DD Summary (PDF)", exportedBy: "Demo User", createdAt: new Date(Date.now() - 864e5).toISOString() },
  { id: "demo-3", at: "Mar 7", label: "Q1 Committee Pack (PDF)", exportedBy: "Demo User", createdAt: new Date(Date.now() - 2 * 864e5).toISOString() },
];

interface ExportLogModalProps {
  entries: ExportLogEntry[];
  onClose: () => void;
}

export default function ExportLogModal({ entries, onClose }: ExportLogModalProps) {
  const list = entries.length > 0 ? entries : DEMO_EXPORT_LOG;
  const isDemo = entries.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Export log</h3>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {isDemo && (
            <p className="text-xs text-slate-400 mb-2">Demo data — use &quot;Export memo&quot; to generate real exports.</p>
          )}
          <ul className="space-y-2">
            {list.map((e) => (
              <li key={e.id} className="flex items-center justify-between text-sm py-2 border-b border-slate-100 last:border-0">
                <span className="text-slate-800">{e.label}</span>
                <span className="text-slate-500 text-xs">{e.at}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
