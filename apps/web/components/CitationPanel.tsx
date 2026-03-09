"use client";

interface CitationPanelProps {
  citation: { source: string; docRef: string; stepId?: number } | null;
  explanation: string | null;
  onClose: () => void;
}

export default function CitationPanel({ citation, explanation, onClose }: CitationPanelProps) {
  const open = citation !== null || explanation !== null;
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">
            {citation ? "Source" : "Explanation"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 text-sm">
          {citation && (
            <>
              <p className="text-xs font-medium text-slate-500 mb-1">
                Source document (input lineage): {citation.docRef}
              </p>
              {citation.stepId != null && (
                <p className="text-xs text-nautilus-teal mb-2">
                  Produced by Matrix Agent, step {citation.stepId}
                </p>
              )}
              <p className="text-slate-700 leading-relaxed border-l-2 border-nautilus-teal pl-3 py-1 bg-slate-50 rounded-r">
                {citation.source}
              </p>
            </>
          )}
          {explanation && (
            <p className="text-slate-700 leading-relaxed">{explanation}</p>
          )}
        </div>
      </div>
    </div>
  );
}
