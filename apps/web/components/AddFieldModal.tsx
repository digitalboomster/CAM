"use client";

import { useState } from "react";

interface AddFieldModalProps {
  onClose: () => void;
  onAdd: (name: string) => void;
}

export default function AddFieldModal({ onClose, onAdd }: AddFieldModalProps) {
  const [name, setName] = useState("");

  const handleAdd = () => {
    const trimmed = name.trim();
    if (trimmed) {
      onAdd(trimmed);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Add field</h3>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Field name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Key risks"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-nautilus-teal/20 focus:border-nautilus-teal outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
        </div>
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-slate-100">
          <button onClick={onClose} className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100">Cancel</button>
          <button onClick={handleAdd} disabled={!name.trim()} className="px-3 py-2 rounded-lg text-sm bg-nautilus-teal text-white hover:bg-nautilus-teal-dark disabled:opacity-50 disabled:pointer-events-none">Add field</button>
        </div>
      </div>
    </div>
  );
}
