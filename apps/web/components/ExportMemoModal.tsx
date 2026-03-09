"use client";

import { useState, useEffect } from "react";

interface ExportMemoModalProps {
  workspaceName: string;
  defaultTitle?: string;
  onClose: () => void;
  onExport: (title: string) => void;
}

export default function ExportMemoModal({ workspaceName, defaultTitle, onClose, onExport }: ExportMemoModalProps) {
  const [title, setTitle] = useState(defaultTitle ?? workspaceName);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (defaultTitle != null) setTitle(defaultTitle);
  }, [defaultTitle]);
  const [done, setDone] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      onExport(title || workspaceName);
      setExporting(false);
      setDone(true);
      setTimeout(onClose, 1200);
    }, 800);
  };

  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
        <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-8 text-center" onClick={(e) => e.stopPropagation()}>
          <div className="w-12 h-12 rounded-full bg-nautilus-teal-light flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-nautilus-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <p className="font-medium text-slate-800">Export complete</p>
          <p className="text-sm text-slate-500 mt-1">PDF added to export log with citations preserved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Export memo</h3>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Memo title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Project Alpha IC memo"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-nautilus-teal/20 focus:border-nautilus-teal outline-none"
          />
          <p className="text-xs text-slate-500 mt-2">Exported PDF will include all sources and citations for audit.</p>
        </div>
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-slate-100">
          <button onClick={onClose} className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100">Cancel</button>
          <button onClick={handleExport} disabled={exporting} className="px-3 py-2 rounded-lg text-sm bg-nautilus-teal text-white hover:bg-nautilus-teal-dark disabled:opacity-50">
            {exporting ? "Exporting…" : "Export as PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
