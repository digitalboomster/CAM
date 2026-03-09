"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useWorkspaceNav } from "@/contexts/WorkspaceNavContext";
import type { Workspace } from "@/lib/types";

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));
}

function NavItem({ href, label, icon }: { href: string; label: string; icon: string }) {
  const pathname = usePathname();
  const active = isActive(pathname, href);
  return (
    <a
      href={href}
      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition-colors ${
        active
          ? "bg-slate-100 text-slate-900 font-medium"
          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
      }`}
    >
      <NavIcon icon={icon} active={active} />
      {label}
    </a>
  );
}

function MoreModulesSection({
  moreModules,
}: {
  moreModules: { href: string; label: string; icon: string; tip: string }[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <div className="pt-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[13px] text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
      >
        <span>More modules</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="mt-0.5 space-y-0.5">
          {moreModules.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition-colors ${
                  active
                    ? "bg-slate-100 text-slate-900 font-medium"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <NavIcon icon={item.icon} active={active} />
                <span className="truncate">{item.label}</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NavIcon({ icon, active }: { icon: string; active?: boolean }) {
  const c = `w-[15px] h-[15px] shrink-0 ${active ? "text-slate-700" : "text-slate-400"}`;
  const p = { fill: "none" as const, stroke: "currentColor", viewBox: "0 0 24 24" };
  const s = { strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeWidth: 1.75 };
  switch (icon) {
    case "dashboard":   return <svg className={c} {...p}><path {...s} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" /><path {...s} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" /><path {...s} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" /><path {...s} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
    case "grid":        return <svg className={c} {...p}><path {...s} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>;
    case "document":    return <svg className={c} {...p}><path {...s} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
    case "cog":         return <svg className={c} {...p}><path {...s} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path {...s} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    case "briefcase":   return <svg className={c} {...p}><path {...s} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    case "chart":       return <svg className={c} {...p}><path {...s} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
    case "search":      return <svg className={c} {...p}><path {...s} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
    case "newspaper":   return <svg className={c} {...p}><path {...s} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6" /></svg>;
    case "building":    return <svg className={c} {...p}><path {...s} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
    case "flow":        return <svg className={c} {...p}><path {...s} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>;
    case "scale":       return <svg className={c} {...p}><path {...s} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>;
    case "order":       return <svg className={c} {...p}><path {...s} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
    case "calculator":  return <svg className={c} {...p}><path {...s} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
    case "shield":      return <svg className={c} {...p}><path {...s} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
    default:            return <svg className={c} {...p}><path {...s} d="M4 6h16M4 12h16M4 18h16" /></svg>;
  }
}

const navItems = [
  { href: "/dashboard",  label: "Dashboard",              icon: "dashboard" },
  { href: "/workspace",  label: "Document Intelligence",  icon: "grid" },
  { href: "/reports",    label: "Reports",                icon: "document" },
  { href: "/settings",   label: "Settings",               icon: "cog" },
];

const moreModules = [
  { href: "/platform",             label: "Platform overview",   icon: "briefcase", tip: "" },
  { href: "/portfolios",           label: "Whole Portfolio",      icon: "chart",     tip: "" },
  { href: "/rebalancing",          label: "Rebalancing",          icon: "scale",     tip: "" },
  { href: "/deal-sourcing",        label: "Deal Sourcing",        icon: "search",    tip: "" },
  { href: "/market-intelligence",  label: "Market Intelligence",  icon: "newspaper", tip: "" },
  { href: "/institution-hub",      label: "Institution Hub",      icon: "building",  tip: "" },
  { href: "/docuflow",             label: "DocuFlow",             icon: "flow",      tip: "" },
  { href: "/oms",                  label: "Order Management",     icon: "order",     tip: "" },
  { href: "/valuation",            label: "Valuation",            icon: "calculator",tip: "" },
  { href: "/regulator-reporting",  label: "Regulator Reporting",  icon: "shield",    tip: "" },
  { href: "/developers",           label: "API Storefront",       icon: "document",  tip: "" },
];

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
    <aside className="fixed left-0 top-0 bottom-0 z-40 w-56 border-r border-slate-100 bg-white flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-slate-100 shrink-0">
        <a href="/dashboard" className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white text-xs font-bold shrink-0">
            N
          </div>
          <div className="min-w-0">
            <span className="text-[13px] font-semibold text-slate-900 tracking-tight">Nautilus</span>
          </div>
        </a>
        <a href="/" title="Home" className="p-1 rounded text-slate-300 hover:text-slate-500 transition-colors shrink-0">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </a>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}

        <MoreModulesSection moreModules={moreModules} />

        {/* Workspace list */}
        {onWorkspace && (workspaces.length > 0 || onNewWorkspace) && (
          <div className="pt-4 mt-2">
            <div className="flex items-center justify-between px-2.5 mb-1">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Workspaces</span>
              {onNewWorkspace && (
                <button
                  onClick={onNewWorkspace}
                  className="text-[11px] text-teal-600 hover:text-teal-700 font-medium"
                >
                  + New
                </button>
              )}
            </div>
            <div className="space-y-0.5">
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => onSelectWorkspace?.(ws.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-[13px] truncate transition-colors ${
                    activeWorkspaceId === ws.id
                      ? "bg-teal-50 text-teal-700 font-medium"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                  title={ws.name}
                >
                  {ws.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Search */}
      <div className="shrink-0 px-2 py-3 border-t border-slate-100">
        <button
          type="button"
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="flex-1 text-left">Search</span>
          <kbd className="text-[10px] text-slate-300 font-mono">⌘K</kbd>
        </button>
      </div>
    </aside>
  );
}
