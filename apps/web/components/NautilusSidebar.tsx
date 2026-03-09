"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useWorkspaceNav } from "@/contexts/WorkspaceNavContext";
import type { Workspace } from "@/lib/types";

const navClass = (pathname: string, href: string) =>
  `w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm border-l-2 transition-colors ${
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"))
      ? "bg-nautilus-accent-muted border-nautilus-accent text-slate-900 font-medium"
      : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

/** Core nav: Dashboard, Document Intelligence (Matrix), Reports, Settings. */
const navItems: { href: string; label: string; icon: string }[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/workspace", label: "Document Intelligence", icon: "grid" },
  { href: "/reports", label: "Reports", icon: "document" },
  { href: "/settings", label: "Settings", icon: "cog" },
];

/** Nautilus V1 modules — "More" section (see Nautilus V1 PDF). */
const moreModules: { href: string; label: string; icon: string; tip: string }[] = [
  { href: "/platform", label: "Platform overview", icon: "briefcase", tip: "All Nautilus V1 modules and their status at a glance." },
  { href: "/portfolios", label: "Whole Portfolio", icon: "chart", tip: "Single-pane-of-glass view of every Naira under management." },
  { href: "/rebalancing", label: "Rebalancing", icon: "scale", tip: "Allocation vs target, drift detection, and simulation." },
  { href: "/deal-sourcing", label: "Deal Sourcing", icon: "search", tip: "AI-scored target search with citations and deal intelligence." },
  { href: "/market-intelligence", label: "Market Intelligence", icon: "newspaper", tip: "Research console, AI summaries, news, and competitor monitoring." },
  { href: "/institution-hub", label: "Institution Hub", icon: "building", tip: "Client segment, mandate adherence, and one-click IC pack." },
  { href: "/docuflow", label: "DocuFlow", icon: "flow", tip: "Intelligent document processing — ingest, classify, extract, route." },
  { href: "/oms", label: "Order Management", icon: "order", tip: "AI-assisted order entry, execution strategy, and blotter." },
  { href: "/valuation", label: "Valuation", icon: "calculator", tip: "Valuation inputs capture, comps, and sensitivity anchors." },
  { href: "/regulator-reporting", label: "Regulator Reporting", icon: "shield", tip: "SEC templates, generate & export, regulator audit history." },
  { href: "/developers", label: "API Storefront", icon: "document", tip: "Developer docs and REST API endpoints for the Nautilus platform." },
];

function MoreModulesSection({
  pathname,
  moreModules,
}: {
  pathname: string;
  moreModules: { href: string; label: string; icon: string; tip: string }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 mt-2"
      >
        <span className="flex items-center gap-2.5">
          <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          More modules
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="space-y-0.5 pl-1 mt-0.5 border-l border-slate-100 ml-3">
          {moreModules.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                title={item.tip}
                className={`group ${navClass(pathname, item.href)}`}
              >
                <NavIcon icon={item.icon} />
                <span className="flex-1 min-w-0">
                  <span className="block truncate">{item.label}</span>
                  <span className="block text-[10px] text-slate-400 group-hover:text-slate-500 truncate leading-tight">
                    {item.tip}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function NavIcon({ icon }: { icon: string }) {
  const c = "w-4 h-4 shrink-0 text-slate-500";
  const svgProps = { fill: "none" as const, stroke: "currentColor", viewBox: "0 0 24 24", width: 16, height: 16 };
  switch (icon) {
    case "dashboard":
      return <svg {...svgProps} className={c}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
    case "briefcase":
      return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    case "chart":
      return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
    case "document":
      return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
    case "grid":
      return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>;
    case "search":
      return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
    case "folder":
      return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2-2z" /></svg>;
    case "newspaper":
      return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6m4-4v4m0 0v4m0-4h4m-4 0H9" /></svg>;
    case "building":
      return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
    case "flow":
      return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>;
    case "scale":
      return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V7z" /></svg>;
    case "order":
      return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
    case "calculator":
      return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
    case "shield":
      return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
    case "cog":
      return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    default:
      return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
  }
}

interface NautilusSidebarProps {
  workspaces?: Workspace[];
  activeWorkspaceId?: string | null;
  onSelectWorkspace?: (id: string) => void;
  onNewWorkspace?: () => void;
}

export default function NautilusSidebar(props: NautilusSidebarProps) {
  const pathname = usePathname();
  const nav = useWorkspaceNav();
  const onWorkspace = pathname === "/workspace";
  const workspaces = onWorkspace && nav ? nav.workspaces : (props.workspaces ?? []);
  const activeWorkspaceId = onWorkspace && nav ? nav.activeWorkspaceId : (props.activeWorkspaceId ?? null);
  const onSelectWorkspace = onWorkspace && nav ? (id: string) => nav.setActiveWorkspaceId(id) : props.onSelectWorkspace;
  const onNewWorkspace = onWorkspace && nav ? nav.onNewWorkspace : props.onNewWorkspace;

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 w-64 min-w-[16rem] border-r border-slate-200 bg-white flex flex-col shadow-sm">
      <div className="p-4 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <a href="/dashboard" className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-md flex items-center justify-center bg-slate-800 text-white font-bold text-sm tracking-tight shrink-0">
              N
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-slate-900 tracking-tight">Nautilus</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500">Wealth Operating System</span>
            </div>
          </a>
          <a
            href="/"
            title="Home"
            className="ml-2 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors shrink-0"
            aria-label="Home (Enter Nautilus)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </a>
        </div>
      </div>

      <div className="p-3 space-y-0.5 overflow-y-auto flex-1">
        {navItems.map((item) => (
          <a key={item.href} href={item.href} className={navClass(pathname, item.href)}>
            <NavIcon icon={item.icon} />
            {item.label}
          </a>
        ))}

        <MoreModulesSection pathname={pathname} moreModules={moreModules} />

        {onWorkspace && (workspaces.length > 0 || onNewWorkspace) && (
          <>
            <div className="pt-4 mt-2 border-t border-slate-100">
              <div className="flex items-center justify-between px-3 py-1.5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Projects / Workspaces</p>
                {onNewWorkspace && (
                  <button
                    onClick={onNewWorkspace}
                    className="text-xs text-teal-600 hover:underline font-medium"
                  >
                    + New
                  </button>
                )}
              </div>
              <ul className="space-y-1 mt-1">
                {(() => {
                  const byProject = new Map<string | null, Workspace[]>();
                  for (const ws of workspaces) {
                    const key = ws.projectId ?? null;
                    if (!byProject.has(key)) byProject.set(key, []);
                    byProject.get(key)!.push(ws);
                  }
                  const projectFirst = Array.from(byProject.entries()).sort(([a], [b]) => {
                    if (a === null) return 1;
                    if (b === null) return -1;
                    return 0;
                  });
                  return projectFirst.map(([projectId, list]) => {
                    const projectName = projectId
                      ? list[0]?.project?.name ?? "Project"
                      : "No project";
                    return (
                      <li key={projectId ?? "_none"}>
                        <p className="px-3 py-1 text-xs font-medium text-slate-500 truncate" title={projectName}>
                          {projectName}
                        </p>
                        <ul className="space-y-0.5">
                          {list.map((ws) => (
                            <li key={ws.id}>
                              <button
                                type="button"
                                onClick={() => onSelectWorkspace?.(ws.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate ${
                                  activeWorkspaceId === ws.id
                                    ? "bg-teal-50 text-teal-700 font-medium"
                                    : "text-slate-700 hover:bg-slate-100"
                                }`}
                                title={ws.name}
                              >
                                {ws.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  });
                })()}
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Command palette hint */}
      <div className="shrink-0 px-3 py-3 border-t border-slate-100 bg-slate-50/50">
        <button
          type="button"
          onClick={() => {
            const event = new KeyboardEvent("keydown", {
              key: "k",
              metaKey: true,
              bubbles: true,
            });
            window.dispatchEvent(event);
          }}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-500 border border-slate-200 hover:bg-white hover:text-slate-700 transition-colors"
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="flex-1 text-left">Search commands</span>
          <kbd className="font-mono text-[10px] text-slate-400">⌘K</kbd>
        </button>
      </div>
    </aside>
  );
}
