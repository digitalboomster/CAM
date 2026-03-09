"use client";

import { useState, useRef, useEffect } from "react";

export interface ViewOptionsState {
  hiddenColumnIds: Set<string>;
  density: "compact" | "comfortable";
}

interface ViewOptionsDropdownProps {
  columnIds: string[];
  options: ViewOptionsState;
  onOptionsChange: (options: ViewOptionsState) => void;
  onClose?: () => void;
  children: React.ReactNode;
}

export default function ViewOptionsDropdown({
  columnIds,
  options,
  onOptionsChange,
  children,
}: ViewOptionsDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  const toggleColumn = (id: string) => {
    const next = new Set(options.hiddenColumnIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onOptionsChange({ ...options, hiddenColumnIds: next });
  };

  const setDensity = (density: "compact" | "comfortable") => {
    onOptionsChange({ ...options, density });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-700 hover:bg-white border border-slate-200"
      >
        {children}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 rounded-lg border border-slate-100 bg-white shadow-lg py-2 z-50">
          <p className="px-3 py-1.5 text-xs font-medium text-slate-500 uppercase">Columns</p>
          {columnIds.map((id) => (
            <label key={id} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={!options.hiddenColumnIds.has(id)}
                onChange={() => toggleColumn(id)}
                className="rounded border-slate-300 text-nautilus-teal focus:ring-nautilus-teal"
              />
              <span className="text-sm text-slate-700">{id}</span>
            </label>
          ))}
          <div className="border-t border-slate-100 mt-2 pt-2">
            <p className="px-3 py-1.5 text-xs font-medium text-slate-500 uppercase">Density</p>
            <div className="flex gap-1 px-3 py-2">
              <button
                onClick={() => setDensity("compact")}
                className={`px-2 py-1 rounded text-sm ${options.density === "compact" ? "bg-nautilus-teal text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                Compact
              </button>
              <button
                onClick={() => setDensity("comfortable")}
                className={`px-2 py-1 rounded text-sm ${options.density === "comfortable" ? "bg-nautilus-teal text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                Comfortable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
