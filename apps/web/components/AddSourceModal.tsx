"use client";

import { useState } from "react";
import { SOURCE_CATEGORIES } from "@/lib/types";

const SOURCE_TYPES = ["Financials", "Marketing Materials", "Legal", "Transcript", "Document"];

interface AddSourceModalProps {
  onClose: () => void;
  onAdd: (source: { name: string; date: string; type: string; category?: string }) => void;
}

export default function AddSourceModal({ onClose, onAdd }: AddSourceModalProps) {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [type, setType] = useState(SOURCE_TYPES[0]);
  const [category, setCategory] = useState<string>(SOURCE_CATEGORIES[0]);

  const handleAdd = () => {
    const trimmed = name.trim();
    if (trimmed) {
      onAdd({ name: trimmed, date, type, category });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Add source</h3>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Source name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q4 Board Deck"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-nautilus-teal/20 focus:border-nautilus-teal outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-nautilus-teal/20 focus:border-nautilus-teal outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-nautilus-teal/20 focus:border-nautilus-teal outline-none"
            >
              {SOURCE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category (doc tree)</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-nautilus-teal/20 focus:border-nautilus-teal outline-none"
            >
              {SOURCE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-4 py-3 border-t border-slate-100">
          <button onClick={onClose} className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100">Cancel</button>
          <button onClick={handleAdd} disabled={!name.trim()} className="px-3 py-2 rounded-lg text-sm bg-nautilus-teal text-white hover:bg-nautilus-teal-dark disabled:opacity-50 disabled:pointer-events-none">Add source</button>
        </div>
      </div>
    </div>
  );
}
