"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Command {
  id: string;
  label: string;
  description?: string;
  href?: string;
  action?: () => void;
  icon: React.ReactNode;
}

const NAV_ICON = (path: string) => (
  <svg className="w-4 h-4 shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
);

const BASE_COMMANDS: Command[] = [
  {
    id: "dashboard",
    label: "Go to Dashboard",
    description: "Overview, quick actions, compliance",
    href: "/dashboard",
    icon: NAV_ICON("M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"),
  },
  {
    id: "workspace",
    label: "Open Document Intelligence",
    description: "Matrix workspace, Co-Pilot, export",
    href: "/workspace",
    icon: NAV_ICON("M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"),
  },
  {
    id: "reports",
    label: "Go to Reports",
    description: "Templates, generate report, export audit",
    href: "/reports",
    icon: NAV_ICON("M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"),
  },
  {
    id: "settings",
    label: "Go to Settings",
    description: "Export format, citations, theme",
    href: "/settings",
    icon: NAV_ICON("M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"),
  },
  {
    id: "templates",
    label: "Go to Templates",
    description: "Prebuilt IC Memo, DD, M&A workflows",
    href: "/templates",
    icon: NAV_ICON("M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"),
  },
  {
    id: "find-workspaces",
    label: "Find Workspaces",
    description: "Search and open existing workspaces",
    href: "/find-workspaces",
    icon: NAV_ICON("M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"),
  },
  {
    id: "deal-sourcing",
    label: "Deal Sourcing",
    description: "Search deal targets with AI scoring",
    href: "/deal-sourcing",
    icon: NAV_ICON("M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"),
  },
  {
    id: "regulator-reporting",
    label: "Regulator Reporting",
    description: "SEC templates, generate & export",
    href: "/regulator-reporting",
    icon: NAV_ICON("M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"),
  },
  {
    id: "shariah-esg",
    label: "Shariah & ESG Guardrails",
    description: "AAOIFI/ESG compliance, Halal screening, ethical audit",
    href: "/shariah-esg",
    icon: NAV_ICON("M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"),
  },
  {
    id: "platform",
    label: "Platform Overview",
    description: "All Nautilus V1 modules and status",
    href: "/platform",
    icon: NAV_ICON("M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"),
  },
  {
    id: "developers",
    label: "API Storefront",
    description: "Developer docs and API endpoints",
    href: "/developers",
    icon: NAV_ICON("M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"),
  },
  {
    id: "home",
    label: "Home",
    description: "Return to the Nautilus landing screen",
    href: "/",
    icon: NAV_ICON("M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"),
  },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = query.trim()
    ? BASE_COMMANDS.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.description?.toLowerCase().includes(query.toLowerCase())
      )
    : BASE_COMMANDS;

  const runCommand = useCallback((cmd: Command) => {
    setOpen(false);
    setQuery("");
    if (cmd.action) {
      cmd.action();
    } else if (cmd.href) {
      window.location.href = cmd.href;
    }
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
        setSelected(0);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selected]) runCommand(filtered[selected]);
    }
  };

  useEffect(() => {
    const el = listRef.current?.children[selected] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-hidden />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
          />
          <kbd className="hidden sm:block text-xs text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 font-mono">ESC</kbd>
        </div>

        {/* Results */}
        <ul ref={listRef} className="max-h-80 overflow-y-auto py-1.5">
          {filtered.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-slate-400">No commands found</li>
          ) : (
            filtered.map((cmd, i) => (
              <li key={cmd.id}>
                <button
                  type="button"
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    i === selected ? "bg-teal-50 text-teal-900" : "text-slate-700 hover:bg-slate-50"
                  }`}
                  onMouseEnter={() => setSelected(i)}
                  onClick={() => runCommand(cmd)}
                >
                  <span className={i === selected ? "text-teal-600" : ""}>{cmd.icon}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium truncate">{cmd.label}</span>
                    {cmd.description && (
                      <span className="block text-xs text-slate-400 truncate">{cmd.description}</span>
                    )}
                  </span>
                  {i === selected && (
                    <kbd className="text-xs text-teal-500 border border-teal-200 rounded px-1.5 py-0.5 font-mono shrink-0">↵</kbd>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>

        {/* Footer hint */}
        <div className="border-t border-slate-100 px-4 py-2 flex items-center gap-4 text-xs text-slate-400">
          <span><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono">↵</kbd> open</span>
          <span><kbd className="font-mono">⌘K</kbd> toggle</span>
        </div>
      </div>
    </div>
  );
}
